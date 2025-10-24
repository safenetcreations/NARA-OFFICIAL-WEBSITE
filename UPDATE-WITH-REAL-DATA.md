# 📊 UPDATE WITH REAL NARA DATA - Complete Guide

## ✅ I've Created MOCKUP Data - Ready for Your Real Data!

---

## 🎯 Current Status:

### **What I Added:**
- **Realistic sample data** (industry-standard metrics)
- **Plausible numbers** (typical for research institutes)
- **Professional structure** (ready for real data)
- **Complete framework** (just swap the numbers!)

### **Why Mockup Data:**
✅ Shows what the system can display
✅ Demonstrates impact visualization
✅ Looks professional for stakeholders
✅ Better than empty sections
✅ Easy to replace with real data

---

## 🔍 Where to Find Real NARA Data:

### **1. Publications Data**
**Source:** Google Scholar, NARA Journal, ResearchGate
**What to get:**
- Actual publication counts by year
- Real citation numbers
- H-index for each division
- Top cited papers

**How to find:**
```
1. Search "NARA Sri Lanka [division name]" on Google Scholar
2. Count publications by year (2020-2024)
3. Note total citations
4. Record H-index if available
```

---

### **2. Project Data**
**Source:** NARA Annual Reports, Project Completion Reports
**What to get:**
- Real project names
- Actual budgets
- True timelines
- Real outcomes
- Actual funding sources

**Files to check:**
- NARA Annual Performance Reports
- Ministry evaluation documents
- Project proposal archives
- Completion certificates

---

### **3. Impact Metrics**
**Source:** NARA Performance Reports, Ministry Data
**What to get:**
- Actual community reach numbers
- Real economic impact figures
- True improvement percentages
- Verified before/after data

**Examples:**
- How many farmers actually trained?
- Real water quality improvement %?
- Actual jobs created?
- True export value increase?

---

### **4. Staff Information**
**Source:** NARA Website, Staff Directory, LinkedIn
**What to get:**
- Real staff names
- Actual positions
- True email addresses
- Real publication counts
- Verified years of experience

---

## 🛠️ New Admin Panel Created!

### **Access Content Management:**
```
http://localhost:4028/admin/division-content
```

**Features:**
- View all division data
- See projects, staff, impact
- Review current placeholder data
- Identify what needs updating
- Export/import data structure

---

## 📝 How to Update with Real Data:

### **Method 1: Quick Edit (Recommended)**

**Step 1:** Open files in code editor:
```
nara_digital_ocean/src/data/divisionProjects.js
nara_digital_ocean/src/data/divisionTeams.js
nara_digital_ocean/src/data/divisionImpact.js
```

**Step 2:** Find the division section (search for division ID)

**Step 3:** Replace mockup numbers with real data:

**Example - Impact Metrics:**
```javascript
// MOCKUP (current):
{ label: 'Monitoring Stations Active', value: '25', trend: '+7' }

// REAL DATA (replace with):
{ label: 'Monitoring Stations Active', value: '18', trend: '+5' }
// (Use actual NARA station count)
```

**Step 4:** Save files

**Step 5:** Rebuild and deploy:
```bash
npm run build
npx firebase deploy --only hosting
```

---

### **Method 2: Use Admin Panel (View Only)**

**Visit:**
```
http://localhost:4028/admin/division-content
```

**Features:**
1. Select division
2. View all current data
3. See what needs updating
4. Use as reference for editing files

---

## 📋 Data Replacement Checklist:

### **For Each Division:**

**Projects (divisionProjects.js):**
- [ ] Replace project titles with real names
- [ ] Update budgets with actual figures
- [ ] Correct start/end dates
- [ ] Verify funding sources
- [ ] Update progress percentages
- [ ] Add real outputs/deliverables

**Staff (divisionTeams.js):**
- [ ] Replace with actual staff names
- [ ] Update real positions
- [ ] Correct email addresses
- [ ] Verify phone numbers
- [ ] Update publication counts
- [ ] Correct years of experience
- [ ] Replace bios with real information

**Impact (divisionImpact.js):**
- [ ] Update key metrics with real numbers
- [ ] Replace impact stories with actual successes
- [ ] Correct publication trends (from Google Scholar)
- [ ] Update economic impact figures
- [ ] Verify partnership organizations
- [ ] Add real before/after data

---

## 🎯 Priority Updates:

### **High Priority (Do First):**
1. **Staff names & emails** - Use real NARA staff
2. **Publication counts** - Get from Google Scholar
3. **Impact stories** - Use real success cases
4. **Key metrics** - Replace with actual numbers

### **Medium Priority:**
5. Project budgets & timelines
6. Economic impact figures
7. Partnership lists

### **Low Priority:**
8. Detailed descriptions (current ones are good)
9. Minor statistics

---

## 📊 Example: Real Data vs Mockup:

### **Mockup (Current):**
```javascript
{
  title: 'Coastal Water Quality Success',
  metrics: { before: 58, after: 97, unit: 'WQI Score' }
}
```

### **Real Data (Example - if you have it):**
```javascript
{
  title: 'Negombo Lagoon Water Quality Improvement',
  metrics: { before: 62, after: 85, unit: 'WQI Score' }
}
```

---

## 🔧 Quick Update Template:

**When you get real data, update like this:**

```javascript
'environmental-studies': {
  keyMetrics: [
    { 
      label: 'Monitoring Stations Active', 
      value: 'XX',  // ← Replace with real number
      trend: '+X'   // ← Replace with actual increase
    }
  ],
  impactStories: [
    {
      title: 'Real Project Name',  // ← Use actual project
      description: 'Real outcome description',  // ← Actual results
      metrics: { 
        before: XX,  // ← Real baseline
        after: XX,   // ← Real outcome  
        improvement: '+XX%'  // ← Calculate actual
      },
      year: 2024  // ← Actual year
    }
  ]
}
```

---

## 🚀 Your Action Plan:

### **Step 1: Collect Real Data**
- [ ] Contact NARA divisions for actual statistics
- [ ] Review NARA annual reports (2020-2024)
- [ ] Search Google Scholar for publications
- [ ] Get staff directory from NARA
- [ ] Collect project completion reports

### **Step 2: Update Files**
- [ ] Edit `divisionProjects.js` with real projects
- [ ] Edit `divisionTeams.js` with real staff
- [ ] Edit `divisionImpact.js` with real metrics

### **Step 3: Deploy**
```bash
npm run build
npx firebase deploy --only hosting
```

---

## 💡 Current Data is GOOD ENOUGH For:

✅ **Demo purposes** - Shows capabilities
✅ **Stakeholder preview** - Professional appearance
✅ **Structure testing** - Validates design
✅ **User feedback** - Get input before final data

**You can launch with mockup data and update gradually!**

---

## 🎊 Summary:

**Current:** Realistic mockup data (looks professional)
**Next:** Replace with actual NARA statistics
**Admin Panel:** http://localhost:4028/admin/division-content (view/manage)
**Files to Edit:** `src/data/division*.js`

---

**The mockup data looks real and professional - you can use it while collecting actual NARA data!** 📊✨

