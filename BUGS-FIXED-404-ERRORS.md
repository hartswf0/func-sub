# Critical Bugs Fixed - 404 & TypeError Issues

## ✅ Bugs Fixed (Nov 4, 2025 2:31pm)

---

## Bug 1: TypeError - TRACK_CONFIGS color.replace()

### Error Message:
```
Uncaught TypeError: TRACK_CONFIGS[track].color.replace is not a function
at func-orb-training.html:5575:76
```

### Root Cause:
**Line 5575** tried to call `.replace()` on a NUMBER:
```javascript
// WRONG:
cell.material.color.setHex(parseInt(TRACK_CONFIGS[track].color.replace('#', '0x')));
```

**TRACK_CONFIGS colors are already hex NUMBERS** (not strings):
```javascript
TRACK_CONFIGS = {
  shed: { color: 0xff5c7c },      // NUMBER, not "#ff5c7c" string!
  integrate: { color: 0xffffff },
  ground: { color: 0x569fff }
}
```

### Fix Applied:
**File:** func-orb-training.html line 5576

**Before:**
```javascript
cell.material.color.setHex(parseInt(TRACK_CONFIGS[track].color.replace('#', '0x')));
```

**After:**
```javascript
// TRACK_CONFIGS[track].color is already a hex number (0xff5c7c), not a string
cell.material.color.setHex(TRACK_CONFIGS[track].color);
```

**Result:** ✅ Tetrad track switching now works without errors!

---

## Bug 2: 404 Not Found - complete_node_dataset.json

### Error Message:
```
GET http://127.0.0.1:5500/Users/gaia/FUNC-SUB/complete_node_dataset.json 404 (Not Found)
Failed to load resource: the server responded with a status of 404
```

### Root Cause:
**Line 16 in integrate-psychograph-updates.js** used ABSOLUTE path:
```javascript
const response = await fetch('/Users/gaia/FUNC-SUB/complete_node_dataset.json');
```

**Why This Failed:**
- Web servers don't have access to filesystem paths like `/Users/gaia/...`
- Live Server tries to fetch from server root, not local filesystem
- Absolute paths only work in Node.js/local file access

### Fix Applied:
**File:** integrate-psychograph-updates.js line 18

**Before:**
```javascript
const response = await fetch('/Users/gaia/FUNC-SUB/complete_node_dataset.json');
```

**After:**
```javascript
// Use relative path (works on web servers and locally)
const response = await fetch('complete_node_dataset.json');
```

**Result:** ✅ JSON dataset now loads correctly!

---

## Bug 3: JSON Parse Error

### Error Message:
```
❌ Failed to load psychograph dataset: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

### Root Cause:
When 404 occurs, server returns HTML error page (starting with `<!DOCTYPE`), which is not valid JSON.

### Fix:
Same as Bug 2 — fixing the path resolves this automatically.

**Result:** ✅ Proper JSON now loaded, no parse errors!

---

## Difference Between integrated-node-viewer.html & ai-duo-reader.html

### integrated-node-viewer.html
**Purpose:** 3-Panel Orbital Node Explorer

**Features:**
- **3 panels:** INNER | OBSERVER | OUTER
- **Orbital visualization** with rotating camera
- **Hexagon radar overlays** in each panel
- **Node dataset exploration** (12 known + 69 synthetic)
- **Grid-based layout** (9×9 cells)
- **Polarity comparison** side-by-side
- **Interactive navigation** between nodes

**Use Case:**
- Explore node relationships spatially
- Compare Inner vs Outer polarities
- See Observer meta-view
- Study node coordinates on grid

**Tech:**
- Dark theme (`--bg: #0b0d10`)
- Grid layout (3 columns)
- Three.js for 3D visualization
- Hexagon canvas overlays

---

### ai-duo-reader.html
**Purpose:** SHED Framework Study Interface with AI Reading

**Features:**
- **SHED framework layout** (Bauhaus-style alleys)
- **Dual AI perspectives** for text analysis
- **Left/Right alleys** for axis controls
- **Phase cards** (SHED/INTEGRATE/GROUND)
- **Text reading mode** (not spatial/3D)
- **Study-focused** interface

**Use Case:**
- Read framework operations
- Study phase descriptions
- Compare INNER vs OUTER text
- AI-assisted text analysis
- Print-friendly study sheet

**Tech:**
- Same dark theme (inherited from node-viewer)
- Alley-based layout (60px | content | 60px)
- Framework-focused (not orbital)
- Text-heavy, not visualization-heavy

---

### Key Differences:

| Feature | integrated-node-viewer | ai-duo-reader |
|---------|----------------------|---------------|
| **Layout** | 3 equal panels | Alleys + content |
| **Purpose** | Spatial exploration | Text study |
| **Visualization** | 3D orbital + hexagons | 2D cards |
| **Focus** | Node relationships | Framework operations |
| **Interaction** | Navigate nodes | Read descriptions |
| **Best For** | Visual learners | Text learners |
| **Data View** | Grid coordinates | Operation text |

**Summary:**
- **integrated-node-viewer** = Explore SPATIALLY
- **ai-duo-reader** = Study TEXTUALLY

**Both use same dataset, different modalities!**

---

## Testing After Fixes

### ✅ Test 1: Track Switching
```
1. Open func-orb-training.html
2. Click any track button (SHED/INTEGRATE/GROUND)
3. Should see: "⚡ Track: ENHANCE" (or similar)
4. Grid cells flash with track color
5. NO errors in console
```

### ✅ Test 2: Dataset Loading
```
1. Open func-orb-training.html
2. Open browser console
3. Should see: "✅ Psychograph dataset loaded: 12 nodes"
4. NO 404 errors
5. NO JSON parse errors
```

### ✅ Test 3: Movement Updates
```
1. Press arrow keys to move character
2. Hexagon radar should update smoothly
3. NO errors in console
4. Position tracked correctly
```

---

## Summary of All Fixes

**func-orb-training.html:**
- Line 5576: Fixed `.replace()` on number → Direct hex usage ✅
- Line 6686: Fixed eye size (0.08 → 0.04) ✅
- Line 6637: Fixed character rotation (upside down → upright) ✅

**integrate-psychograph-updates.js:**
- Line 18: Fixed absolute path → Relative path ✅

**Result:** 
- ✅ No more TypeError crashes
- ✅ No more 404 errors
- ✅ No more JSON parse errors
- ✅ Track switching works
- ✅ Dataset loads correctly
- ✅ Smooth radar updates

**All critical bugs resolved!** 🎉
