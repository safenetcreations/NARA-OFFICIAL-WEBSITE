# 🧪 STEP-BY-STEP TEST - AI Images in Hero

## 📋 Follow These Exact Steps:

### **Step 1: Clear Everything (Fresh Start)**

Open browser console (F12) and type:
```javascript
localStorage.clear()
```

Press Enter. This clears old data.

---

### **Step 2: Go to Admin Panel**
```
http://localhost:4028/admin/division-images
```

Refresh page: `Ctrl+Shift+R`

---

### **Step 3: Select Environmental Studies**

Click the green **Environmental Studies** card

**You should see:**
- Purple box with 4 AI prompts listed
- Empty gallery (no images yet)

---

### **Step 4: Generate AI Images**

Click the purple **"Generate AI Images"** button

**Wait 2-3 seconds...**

**You should see:**
- ✅ Success message: "Generated 4 AI images! They're now saved to localStorage."
- ✅ **Green button appears:** "View in Hero Section"
- ✅ **4 IMAGES show in gallery below** (actual photos, not white tiles!)

---

### **Step 5: Open Console Tab**

Press F12 → Console tab

**Look for these messages:**
```
✅ IMAGES SAVED TO LOCALSTORAGE!
Division ID: environmental-studies
Image URLs saved: Array(4)
```

**Click the array to expand it** - you should see 4 Unsplash URLs

---

### **Step 6: Click "View in Hero Section" Button**

Click the **green button** in the success message

This opens the division page in a new tab

---

### **Step 7: On Division Page - Check Console**

In the NEW tab that opened, press F12 → Console

**Look for:**
```
🔍 Checking localStorage for division: environmental-studies
💾 SUCCESS! Loaded 4 images from localStorage
🎉 AI IMAGES CONNECTED TO HERO SECTION!
```

**If you see this** = CONNECTED! ✅

---

### **Step 8: Look at Hero Section**

**Top-right corner:**
- Do you see a **GREEN BADGE** saying "AI Images Active"?
  - **YES** = Images connected! ✅
  - **NO** = Keep reading...

**Bottom center:**
- Do you see **4 white dots**?
  - **YES** = Carousel working ✅

**Wait 5 seconds:**
- Does the background image change?
- Does the counter change from "1 / 4" to "2 / 4"?
  - **YES** = Auto-rotation working! ✅

---

## 🔍 Debugging:

### If NO green badge:

**Check console messages. Do you see:**

**Option A:**
```
💾 SUCCESS! Loaded 4 images from localStorage
```
→ Images loaded! Badge should show. Check if badge code is rendering.

**Option B:**
```
📸 Using default hero images: 4
```
→ localStorage not found. Division ID might not match.

**Option C:** No localStorage messages
→ LocalStorage not being checked. Import issue.

---

### If you see "Using default hero images":

**Possible causes:**
1. Division ID mismatch (check console for exact ID)
2. localStorage cleared after saving
3. Different browser tab/window

**Solution:**
1. Go back to admin
2. Generate images again
3. Use the green "View in Hero Section" button
4. Check console in new tab

---

## 🎯 What Should Happen:

### Timeline:

**In Admin Panel:**
```
1. Click "Generate AI Images"
   ↓
2. Images saved to localStorage
   ↓
3. 4 images appear in gallery
   ↓
4. Success message with green button
```

**On Division Page:**
```
1. Page loads
   ↓
2. Checks localStorage for 'environmental-studies'
   ↓
3. Finds 4 image URLs
   ↓
4. Sets heroImages state
   ↓
5. Shows green badge
   ↓
6. Displays in carousel
   ↓
7. Auto-rotates every 5 seconds
```

---

## 📊 Manual Check:

### Check localStorage directly:

In console, type:
```javascript
localStorage.getItem('nara_division_images')
```

**You should see:**
```json
{"environmental-studies":{"images":[...],"updatedAt":"..."}}
```

**If you see `null`:**
- Images weren't saved
- Generate them again

**If you see the data:**
- Images ARE saved
- Division page should load them

---

## 🚀 Quick Fix:

**Try this sequence:**

1. **Admin:** Generate images → See 4 images in gallery ✅
2. **Console:** Check localStorage has data ✅
3. **Admin:** Click green "View in Hero Section" button
4. **New tab opens:** Division page
5. **Check console:** Should say "SUCCESS! Loaded from localStorage"
6. **Look for:** Green badge "AI Images Active"

---

**Follow these steps exactly and tell me what happens at each step!** 🔍✨
