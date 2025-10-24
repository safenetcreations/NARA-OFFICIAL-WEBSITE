# 🔧 Hero Section Images - Complete Fix Guide

## 🎯 **Issue:** Images not showing in hero section

## ✅ **Solution Steps:**

### **Step 1: Check if Images Exist in Admin Panel**
1. Go to: `http://localhost:4028/admin/division-images`
2. Select a division (e.g., Environmental Studies)
3. Look for existing images in the admin panel
4. **If you see images:** Continue to Step 2
5. **If NO images:** Go to Step 3 to generate new ones

---

### **Step 2: Sync Images to Hero Section**
1. In the admin panel, you'll now see a **blue "Sync to Hero"** button
2. Click **"Sync to Hero (X)"** button
3. You should see: "✅ Synced X images to hero section!"
4. Go to the division page: `http://localhost:4028/divisions/environmental-studies`
5. Hard refresh: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
6. Images should now appear!

---

### **Step 3: Generate New Images (if needed)**
1. In admin panel, select a division
2. Click **"Enhance Prompts with Gemini"** (optional but recommended)
3. Click **"Generate with Gemini Native"**
4. Wait for images to generate (shows progress)
5. Once complete, images automatically upload to Firebase
6. Click **"Sync to Hero"** button
7. Visit division page and refresh

---

## 🔍 **Check Console Logs:**

### **Good Signs (Working):**
```
🔍 Checking localStorage for division: environmental-studies
💾 SUCCESS! Loaded 4 images from localStorage
🎉 AI IMAGES CONNECTED TO HERO SECTION!
```

### **Problem Signs:**
```
💾 SUCCESS! Loaded 0 images from localStorage
// OR
💾 SUCCESS! Loaded 2 images from localStorage  ← Should be 4!
```

---

## 🆘 **Still Not Working?**

### **Option 1: Clear Everything and Start Fresh**
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```
Then regenerate images in admin panel.

### **Option 2: Check Firebase Storage Console**
1. Visit: https://console.firebase.google.com/project/nara-web-73384/storage
2. Navigate to: `divisions/environmental-studies/`
3. Check if images exist
4. Copy an image URL
5. Try opening it in a new tab
6. Should load without errors

### **Option 3: Manual Sync via Console**
```javascript
// Open browser console on admin page
const urls = [
  "https://firebasestorage.googleapis.com/...",  // Paste your image URLs here
  "https://firebasestorage.googleapis.com/...",
  "https://firebasestorage.googleapis.com/...",
  "https://firebasestorage.googleapis.com/..."
];
localStorage.setItem('division-images-environmental-studies', JSON.stringify(urls));
console.log('✅ Manually synced!');
```

---

## 📊 **Image Flow:**

1. **Generate** → Gemini creates images
2. **Upload** → Saves to Firebase Storage
3. **Sync** → Copies URLs to localStorage  
4. **Display** → Hero section loads from localStorage
5. **Rotate** → Changes every 5 seconds

---

## ✨ **New Features Added:**

✅ **"Sync to Hero" Button** - Manually push images to hero section  
✅ **Better Console Logging** - See exactly what's happening  
✅ **Auto-sync on Load** - Images auto-sync when admin loads  
✅ **Firebase First** - Always checks Firebase before localStorage  

---

## 🎯 **Expected Result:**

Hero section should display:
- 4 rotating images
- Changes every 5 seconds
- "Firebase" badge in bottom right
- Smooth fade transitions

**Your images WILL work after following these steps!** 🎊
