# 🏗️ Media Gallery System Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     NARA Media Gallery System                    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Public Users   │    │  Admin Users     │    │  Automated      │
│                 │    │                  │    │  Scrapers       │
│  • Browse       │    │  • Upload        │    │                 │
│  • Search       │    │  • Approve       │    │  • Facebook     │
│  • Filter       │    │  • Edit/Delete   │    │  • Instagram    │
│  • View         │    │  • Run Scraper   │    │  • YouTube      │
│  • Download     │    │  • Manage        │    │  • Twitter      │
└────────┬────────┘    └────────┬─────────┘    │  • News Sites   │
         │                      │               └────────┬────────┘
         │                      │                        │
         ▼                      ▼                        ▼
    ┌────────────────────────────────────────────────────────┐
    │              React Frontend Application                 │
    │  ┌──────────────────┐       ┌──────────────────┐      │
    │  │  Public Gallery  │       │   Admin Panel    │      │
    │  │                  │       │                  │      │
    │  │  • Image Tab     │       │  • Manual Upload │      │
    │  │  • Video Tab     │       │  • Auto-Scrape   │      │
    │  │  • Search Bar    │       │  • Approval UI   │      │
    │  │  • Filters       │       │  • CRUD Ops      │      │
    │  │  • Grid/List     │       │  • Stats         │      │
    │  └────────┬─────────┘       └────────┬─────────┘      │
    │           │                          │                │
    └───────────┼──────────────────────────┼────────────────┘
                │                          │
                ▼                          ▼
    ┌───────────────────────────────────────────────┐
    │           Firebase Backend                     │
    │  ┌─────────────────────────────────────┐     │
    │  │      Cloud Firestore Database       │     │
    │  │                                     │     │
    │  │  ┌──────────────────────────────┐  │     │
    │  │  │    media_images              │  │     │
    │  │  │  • title, description        │  │     │
    │  │  │  • url, thumbnail            │  │     │
    │  │  │  • category, source, tags    │  │     │
    │  │  │  • approved, views, likes    │  │     │
    │  │  └──────────────────────────────┘  │     │
    │  │                                     │     │
    │  │  ┌──────────────────────────────┐  │     │
    │  │  │    media_videos              │  │     │
    │  │  │  • title, description        │  │     │
    │  │  │  • videoUrl, thumbnail       │  │     │
    │  │  │  • duration, category        │  │     │
    │  │  │  • approved, views, likes    │  │     │
    │  │  └──────────────────────────────┘  │     │
    │  └─────────────────────────────────────┘     │
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │    Firebase Storage (Optional)      │     │
    │  │  • Uploaded image files             │     │
    │  │  • Uploaded video files             │     │
    │  └─────────────────────────────────────┘     │
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │    Firebase Authentication          │     │
    │  │  • Admin login system               │     │
    │  │  • Custom claims (admin role)       │     │
    │  └─────────────────────────────────────┘     │
    │                                               │
    │  ┌─────────────────────────────────────┐     │
    │  │    Cloud Functions (Optional)       │     │
    │  │  • Scheduled scraping (daily)       │     │
    │  │  • Image optimization               │     │
    │  │  • Notification system              │     │
    │  └─────────────────────────────────────┘     │
    └───────────────────────────────────────────────┘
                        ▲
                        │
                        ▼
    ┌───────────────────────────────────────────────┐
    │         External APIs & Sources                │
    │                                                │
    │  • Facebook Graph API                          │
    │  • Instagram Graph API                         │
    │  • YouTube Data API                            │
    │  • Twitter API                                 │
    │  • Sri Lankan News Websites (Web Scraping)     │
    └────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### **1. Public User Journey**

```
User Opens Gallery
        │
        ▼
┌───────────────────┐
│  /media-gallery   │
└────────┬──────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Choose Tab: Images or Videos      │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Enter Search Query (Optional)     │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Apply Filters (Optional)          │
│  • Category                        │
│  • Source                          │
│  • Date Range                      │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Firebase Query:                   │
│  collection('media_images')        │
│  .where('approved', '==', true)    │
│  .orderBy('createdAt', 'desc')     │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Frontend Filters Results:         │
│  • By search query                 │
│  • By selected filters             │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Display Media Cards               │
│  • Grid or List view               │
│  • Thumbnails                      │
│  • Metadata                        │
└────────┬───────────────────────────┘
         │
         ▼
User Clicks Card
         │
         ▼
┌────────────────────────────────────┐
│  Open Full-Screen Modal            │
│  • Large image/video               │
│  • Full metadata                   │
│  • Download button                 │
│  • Share button                    │
└────────────────────────────────────┘
```

### **2. Admin Upload Journey**

```
Admin Logs In
        │
        ▼
┌────────────────────────────────────┐
│  /admin/research-login             │
│  • Email + Password                │
│  • Firebase Auth                   │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Navigate to /admin/media          │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  View Dashboard                    │
│  • Total images: 150               │
│  • Total videos: 45                │
│  • Approved: 180                   │
│  • Pending: 15                     │
└────────┬───────────────────────────┘
         │
         ▼
Admin Clicks "Add Image"
         │
         ▼
┌────────────────────────────────────┐
│  Fill Form:                        │
│  • Title (required)                │
│  • Description                     │
│  • Upload file OR URL              │
│  • Category (dropdown)             │
│  • Tags (comma-separated)          │
│  • Location                        │
│  • Date                            │
│  • Photographer                    │
│  • Approve immediately? (checkbox) │
└────────┬───────────────────────────┘
         │
         ▼
Admin Clicks "Save"
         │
         ▼
┌────────────────────────────────────┐
│  If file uploaded:                 │
│  1. Upload to Firebase Storage     │
│  2. Get download URL               │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Save to Firestore:                │
│  addDoc(collection('media_images'),│
│    { ...formData,                  │
│      createdAt: timestamp,         │
│      approved: true/false,         │
│      views: 0, likes: 0 })         │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Success Message                   │
│  "Image added successfully!"       │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Reload Data                       │
│  • Fetch updated list              │
│  • Update UI                       │
└────────────────────────────────────┘
```

### **3. Automated Scraping Journey**

```
Admin Clicks "Auto-Scrape"
        │
        ▼
┌────────────────────────────────────┐
│  manualScrape() function called    │
└────────┬───────────────────────────┘
         │
         ├─────────────┬──────────────┬─────────────┬──────────────┐
         ▼             ▼              ▼             ▼              ▼
┌─────────────┐ ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────┐
│  Facebook   │ │Instagram │ │  YouTube  │ │ Twitter  │ │  News Sites  │
│             │ │          │ │           │ │          │ │              │
│ Graph API   │ │Graph API │ │ Data API  │ │   API    │ │ Web Scraping │
└─────┬───────┘ └────┬─────┘ └─────┬─────┘ └────┬─────┘ └──────┬───────┘
      │              │              │            │              │
      ▼              ▼              ▼            ▼              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Extract Media Data:                                             │
│  • URLs                                                          │
│  • Titles & Descriptions                                         │
│  • Timestamps                                                    │
│  • Metadata                                                      │
└────────┬─────────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  For each media item:              │
│  1. Check if already exists        │
│     (query by externalId)          │
│  2. Skip if duplicate              │
│  3. Continue if new                │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Save to Firestore:                │
│  addDoc(collection, {              │
│    title, description, url,        │
│    source: 'social',               │
│    sourceName: 'Facebook',         │
│    approved: false,  ←──── IMPORTANT!
│    autoScraped: true,              │
│    externalId: 'fb_123',           │
│    createdAt: timestamp            │
│  })                                │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Return Summary:                   │
│  {                                 │
│    success: true,                  │
│    images: 12,                     │
│    videos: 5,                      │
│    total: 17                       │
│  }                                 │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Show Success Message:             │
│  "✅ Found 17 new items"           │
│  "(12 images, 5 videos)"           │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Admin Reviews Items:              │
│  • Filter by "Pending Only"        │
│  • Click eye icon to approve       │
│  • Items become visible to public  │
└────────────────────────────────────┘
```

### **4. Search Algorithm Flow**

```
User Types in Search Bar
        │
        ▼
┌────────────────────────────────────┐
│  searchQuery = "coral reef"        │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  filteredMedia = mediaItems.filter│
│    item => {                       │
│      const query = searchQuery     │
│        .toLowerCase()              │
│                                    │
│      return (                      │
│        item.title.toLowerCase()    │
│          .includes(query)          │
│        ||                          │
│        item.description.toLowerCase()
│          .includes(query)          │
│        ||                          │
│        item.tags.some(tag =>       │
│          tag.toLowerCase()         │
│            .includes(query))       │
│        ||                          │
│        item.location?.toLowerCase()│
│          .includes(query)          │
│      )                             │
│    })                              │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Apply Additional Filters:         │
│  • selectedCategory !== 'all'      │
│  • selectedSource !== 'all'        │
│  • dateFilter !== 'all'            │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│  Update UI:                        │
│  • Re-render grid/list             │
│  • Show filtered count             │
│  • Animate transitions             │
└────────────────────────────────────┘
```

---

## 🗂️ File Structure

```
nara_digital_ocean/
│
├── src/
│   ├── pages/
│   │   ├── media-gallery/
│   │   │   └── index.jsx ─────────────► Public Gallery Page
│   │   │                                • MediaGallery component
│   │   │                                • MediaCard component
│   │   │                                • MediaModal component
│   │   │                                • Search & filter logic
│   │   │                                • Grid/list views
│   │   │
│   │   └── admin/
│   │       ├── MediaAdmin.jsx ─────────► Admin Panel
│   │       │                             • Dashboard stats
│   │       │                             • CRUD operations
│   │       │                             • Auto-scrape button
│   │       │                             • Approval workflow
│   │       │
│   │       ├── ResearchAdminLogin.jsx ─► Admin Login
│   │       └── ResearchDataAdmin.jsx ──► Research Admin
│   │
│   ├── services/
│   │   └── mediaScraperService.js ─────► Scraping Service
│   │                                     • scrapeNewsImages()
│   │                                     • fetchFacebookMedia()
│   │                                     • fetchInstagramMedia()
│   │                                     • fetchYouTubeVideos()
│   │                                     • saveScrapedMedia()
│   │                                     • runAllScrapers()
│   │
│   ├── components/
│   │   └── ui/
│   │       └── ThemeNavbar.jsx ────────► Navigation Bar
│   │                                     • Added Media to About
│   │
│   ├── locales/
│   │   └── en/
│   │       └── common.json ────────────► Translations
│   │                                     • Added mediaGallery key
│   │
│   └── Routes.jsx ─────────────────────► App Routes
│                                         • /media-gallery
│                                         • /admin/media
│
├── research-firestore.rules ───────────► Firebase Rules
│                                         • media_images rules
│                                         • media_videos rules
│
├── MEDIA_GALLERY_GUIDE.md ─────────────► Complete Documentation
├── MEDIA_GALLERY_SUMMARY.md ───────────► Quick Summary
└── MEDIA_SYSTEM_ARCHITECTURE.md ───────► This File
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Security Layers                            │
└─────────────────────────────────────────────────────────────┘

Layer 1: Firebase Authentication
├── Admin users have custom claims { admin: true }
├── Regular users cannot access admin routes
└── Protected routes require authentication check

Layer 2: Firestore Security Rules
├── Public users: READ approved items only
├── Admin users: FULL CRUD access
└── Rules enforced at database level

Layer 3: Frontend Route Protection
├── Admin routes hidden if not authenticated
├── useNavigate redirects unauthorized users
└── Components check auth state

Layer 4: Component-Level Checks
├── Buttons disabled for non-admins
├── Forms hidden from public
└── API calls require auth tokens

Layer 5: Approval Workflow
├── Auto-scraped items default to approved: false
├── Admin must manually approve
└── Public sees only approved items
```

---

## ⚡ Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                Performance Strategies                        │
└─────────────────────────────────────────────────────────────┘

1. Lazy Loading
   • Routes loaded on-demand
   • Images lazy-loaded as user scrolls
   • Videos load thumbnails first

2. Firestore Queries
   • Indexed queries for speed
   • Limit to 50 items per load
   • Pagination (can be added)

3. Caching
   • Firebase caches results
   • Browser caches images
   • LocalStorage for favorites

4. Image Optimization
   • Thumbnails for grid view
   • Full resolution only in modal
   • WebP format support

5. Search Optimization
   • Client-side filtering (fast)
   • Debounced search input
   • Memoized results

6. Code Splitting
   • Separate bundles for public/admin
   • Dynamic imports
   • Tree-shaking unused code
```

---

## 🔄 State Management

```
┌─────────────────────────────────────────────────────────────┐
│                   State Architecture                         │
└─────────────────────────────────────────────────────────────┘

Component State (useState)
├── searchQuery
├── selectedCategory
├── selectedSource
├── dateFilter
├── showFilters
├── selectedMedia
├── mediaItems
├── loading
└── favorites

Firebase Real-time State
├── mediaItems (synced from Firestore)
├── Auto-updates when data changes
└── No manual refresh needed

Local Storage
├── Favorites (persisted)
├── View mode preference
└── Filter preferences

Global State (if needed)
├── Auth state (user, admin status)
└── Theme preferences
```

---

## 📱 Responsive Design Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  Breakpoint Strategy                         │
└─────────────────────────────────────────────────────────────┘

Mobile (< 768px)
├── 1-column grid
├── Stacked filters
├── Full-width search
├── Simplified cards
└── Touch-optimized

Tablet (768px - 1024px)
├── 2-column grid
├── Collapsible filters
├── Expanded cards
└── Hover effects disabled

Desktop (> 1024px)
├── 3-column grid
├── Side-by-side filters
├── Rich hover effects
├── Keyboard shortcuts
└── Full feature set
```

---

## 🎯 Future Scalability

```
┌─────────────────────────────────────────────────────────────┐
│              Scalability Considerations                      │
└─────────────────────────────────────────────────────────────┘

Current Capacity
├── Handles ~10,000 images efficiently
├── Firestore free tier: 50,000 reads/day
└── Storage: Unlimited (with paid plan)

Growth Strategy
├── Add pagination (load more)
├── Implement infinite scroll
├── CDN for image delivery
├── Compress images server-side
└── Add search indexes

Performance at Scale
├── Algolia for advanced search
├── Cloud Functions for processing
├── Image optimization pipeline
└── Caching layer (Redis/Memcached)
```

---

## 🛠️ Monitoring & Maintenance

```
┌─────────────────────────────────────────────────────────────┐
│                Monitoring Strategy                           │
└─────────────────────────────────────────────────────────────┘

Metrics to Track
├── Total media items
├── Approval rate
├── Search usage
├── Popular categories
├── User engagement
├── Load times
├── Error rates
└── API quota usage

Maintenance Tasks
├── Daily: Review scraped content
├── Weekly: Check API quotas
├── Monthly: Analyze trends
└── Quarterly: Update scrapers

Alerts to Set Up
├── Scraping failures
├── API quota limits
├── Storage limits
└── High error rates
```

---

## 🎨 Component Hierarchy

```
MediaGallery (Main Component)
│
├── Hero Section
│   ├── Title & Description
│   ├── Main Search Bar
│   └── Stats Cards
│
├── Controls Section
│   ├── Tab Buttons (Images/Videos)
│   ├── Auto-Scrape Button (Admin)
│   └── View Mode Toggle (Grid/List)
│
├── Filters Panel (Collapsible)
│   ├── Category Filter
│   ├── Source Filter
│   └── Date Filter
│
├── Media Grid/List
│   └── MediaCard (Multiple)
│       ├── Thumbnail
│       ├── Title & Description
│       ├── Metadata
│       ├── Tags
│       └── Favorite Button
│
└── MediaModal (Full Screen)
    ├── Large Image/Video
    ├── Full Metadata
    ├── All Tags
    ├── Download Button
    ├── Share Button
    └── Close Button
```

---

**This architecture is designed for:**
- ✅ High performance
- ✅ Easy maintenance
- ✅ Scalability
- ✅ Security
- ✅ Great UX

---

**Built with modern best practices for production-ready deployment** 🚀
