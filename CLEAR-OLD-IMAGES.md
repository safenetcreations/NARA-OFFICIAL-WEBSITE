# 🔄 Clear Old Images - Quick Fix

## ⚠️ **Problem:**
Hero section is still showing old images even after generating new ones.

## ✅ **Quick Solutions:**

### **Option 1: Clear localStorage (Fastest)**
```javascript
// Open browser console (F12) and run:
localStorage.clear();
location.reload();
```
Then:
1. Go to admin panel
2. Select your division
3. Click "Sync to Hero" button
4. Refresh division page

---

### **Option 2: Clear Specific Division**
```javascript
// Open console and run (replace 'fishing-technology' with your division):
localStorage.removeItem('division-images-fishing-technology');
location.reload();
```

---

### **Option 3: Sync Button**
1. Go to admin panel: `http://localhost:4028/admin/division-images`
2. Select the division
3. **If you see images** in admin panel → Click **"Sync to Hero (X)"** button
4. Refresh division page (`Ctrl+Shift+R`)

---

## 🔍 **Check What's in localStorage:**

```javascript
// See all division images:
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('division-images-')) {
    console.log(key, ':', localStorage.getItem(key).length, 'characters');
  }
}
```

---

## 🎯 **Force Re-Generate:**

1. **Clear localStorage first:**
   ```javascript
   localStorage.clear();
   ```

2. **Generate new images:**
   - Go to admin panel
   - Select division
   - Generate with Gemini or Pollinations
   - Should auto-sync to localStorage

3. **Check console for:**
   ```
   💾 Saving 4 NEW images to localStorage...
   ✅ Verified localStorage sync: 4 images
   ```

4. **Visit division page**
   - Images should be new ones!

---

## 💡 **Why This Happens:**

- localStorage persists across page refreshes
- New images don't automatically replace old ones if localStorage isn't cleared
- The "Sync to Hero" button forces a refresh

---

## ✅ **Verify It Worked:**

After clearing and regenerating:

```javascript
// Check the image URLs:
const imgs = JSON.parse(localStorage.getItem('division-images-fishing-technology'));
console.log('First image URL:', imgs[0].substring(0, 100));
// Should show new URL, not old one
```

---

**Try Option 1 (clear localStorage) - it's the fastest fix!** 🚀
