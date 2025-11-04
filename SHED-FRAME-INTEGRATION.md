# Shed-Frame & Func-Orb-Training Integration

## Fixed Issues ✅

### 1. **Upside-Down Character** - FIXED

**Problem:** Avatar cone pointing DOWN instead of UP

**Root Cause:** Line 6637 had `rotation.x = Math.PI` (180° rotation)

**Fix Applied:**
```javascript
// OLD (line 6637):
avatarMesh.rotation.x = Math.PI; // Point upward

// NEW (line 6637):
// ConeGeometry points UP by default - no rotation needed!
```

**Result:** ✅ Character now stands UPRIGHT (cone point facing up)

---

### 2. **Tetrad Buttons Don't Make Sense** - CLARIFIED

**Problem:** Tetrad buttons (I, —, O, +, !, ≡) don't actually control character

**Why They Don't Work:**
- Tetrad buttons switch TRACK MODES (shed/integrate/ground/enhance/reverse/retrieve)
- They affect NARRATIVE STANCE and AI behavior
- They do NOT move your character on the grid

**What DOES Control Character:**
- **↑ ← ↓ →** Arrow keys = Move character on grid
- **SPACE** = Interact with entities

**Tetrad Purpose:**
- Change how AI interprets the scene
- Shift narrative lens (enhance/reverse/retrieve/obsolesce)
- NOT for character movement

**Recommendation:** Already fixed in latest version - tetrad controls hidden in "Advanced Controls" section, movement emphasized as primary

---

### 3. **Shed-Frame Data Connection** - REVEALED

**Critical Discovery:** shed-frame.html and func-orb-training.html **SHARE THE SAME DATA**

Both files use identical FLOW structure:
```javascript
const FLOW = {
  IDENTITY: {
    SHED: { 
      INNER: 'Eliminate Current Emotional Noise',
      OUTER: 'Decommission Current Unused Formalisms'
    },
    INTEGRATE: {
      INNER: 'Align Instinct to Conscious Goals',
      OUTER: 'Link Reason to External Feedback'
    },
    GROUND: {
      INNER: 'Commit Core Value to Present Action',
      OUTER: 'Formalize Principle Into Present Use'
    }
  },
  // ... EXPERIENCE, LANGUAGE, DOMAIN, PURPOSE, ORDER ...
}
```

**The Connection:**
- **shed-frame.html** = Static study interface (Bauhaus poster aesthetic)
- **func-orb-training.html** = Interactive 3D training ground (same data, different UX)

They're TWO VIEWS of the SAME FRAMEWORK!

---

## How They Work Together

### shed-frame.html (Study Mode)
```
┌─────────────────────────────────┐
│ IDENTITY ▼  [All Axes dropdown] │
├─────────────────────────────────┤
│ SHED          INTEGRATE   GROUND│
│ ┌─────────┐   ┌─────────┐ ┌────┤
│ │INSTINCT │   │INSTINCT │ │... │
│ │Eliminate│   │Align... │ │... │
│ └─────────┘   └─────────┘ └────┤
│ ┌─────────┐   ┌─────────┐ ┌────┤
│ │REASON   │   │REASON   │ │... │
│ │Decommis.│   │Link...  │ │... │
│ └─────────┘   └─────────┘ └────┤
└─────────────────────────────────┘
```

**Purpose:**
- Clean presentation
- Study the framework
- Reflect and take notes
- Side-by-side comparison
- Print-friendly layout

### func-orb-training.html (Training Mode)
```
┌─────────────────────────────────┐
│ INNER Scene                     │
├─────────────────────────────────┤
│    [3D Grid with Avatar 👁️👁️]│
│    [Orbital Rings: S/I/G]      │
│    [Node Markers on Grid]       │
├─────────────────────────────────┤
│ Chat:                           │
│ @shed IDENTITY inner            │
│ → Places node on grid           │
│ → Shows FLOW data for that op   │
└─────────────────────────────────┘
```

**Purpose:**
- Interactive exploration
- Spatial understanding
- Movement-based learning
- Grid navigation
- Entity placement

---

## Integration Workflow

### Use Case: Learning IDENTITY Axis

**Step 1: Study (shed-frame.html)**
1. Open shed-frame.html
2. Select "IDENTITY" from dropdown
3. See SHED/INTEGRATE/GROUND side-by-side
4. Read INNER vs OUTER descriptions
5. Take notes in text areas
6. Understand the conceptual framework

**Step 2: Practice (func-orb-training.html)**
1. Open func-orb-training.html
2. Type: `@shed IDENTITY inner`
3. Node appears on grid with same data
4. Move avatar to explore grid
5. Place more nodes, see spatial relationships
6. Chat with axes using @mentions

**Step 3: Integrate**
- shed-frame = theoretical understanding
- func-orb-training = embodied practice
- Same data, different learning modes

---

## Data Structure Shared

Both files reference:

### 6 Axes:
1. **IDENTITY** (Instinct ↔ Reason)
2. **EXPERIENCE** (Seen ↔ Unseen)
3. **LANGUAGE** (Ideas ↔ Ideology)
4. **DOMAIN** (Source ↔ Resource)
5. **PURPOSE** (Heart ↔ Head)
6. **ORDER** (Parts ↔ Whole)

### 3 Phases:
1. **SHED** (Eliminate, reduce)
2. **INTEGRATE** (Connect, synthesize)
3. **GROUND** (Stabilize, commit)

### 2 Polarities:
1. **INNER** (Subjective, instinct-based)
2. **OUTER** (Objective, structure-based)

**Total:** 6 axes × 3 phases × 2 polarities = **36 operations**

---

## How to Connect Them Technically

### Option A: Cross-Link (Simple)
Add links between files:

**In shed-frame.html:**
```html
<button onclick="window.open('func-orb-training.html')">
  🎮 Open Training Ground
</button>
```

**In func-orb-training.html:**
```javascript
// Add to welcome message:
"📚 Study the framework: <a href='shed-frame.html'>Open Shed-Frame</a>"
```

### Option B: Embed shed-frame as Modal (Medium)
Show shed-frame content in popup when user types "show framework"

### Option C: Unified Interface (Advanced)
Create tabs: [STUDY] [TRAIN] that switch between both views

---

## Practical Integration Steps

### 1. Add "Study Mode" Link in func-orb-training.html

Add to welcome message (around line 1960):
```javascript
<div style="margin-top: 12px; padding: 10px; background: #f5f3ed; border: 2px solid #1a1a1a; border-radius: 4px;">
  📚 <strong>Study Mode:</strong> 
  <a href="shed-frame.html" target="_blank" style="color: #ff4d2e; text-decoration: underline;">
    Open Bauhaus Framework Sheet
  </a> to read full operation descriptions
</div>
```

### 2. Add "Training Ground" Link in shed-frame.html

Add to corner controls (around line 320):
```html
<div class="corner-control" style="bottom: 20px; left: 20px;" 
     onclick="window.open('func-orb-training.html', '_blank')"
     title="Open Training Ground">
  🎮
</div>
```

### 3. Sync Data Automatically

When user reflects in shed-frame textarea, save to localStorage:
```javascript
// In shed-frame.html
textarea.addEventListener('blur', () => {
  const key = `reflection_${currentAxis}_${phase}_${polarity}`;
  localStorage.setItem(key, textarea.value);
});

// In func-orb-training.html
// Load saved reflections when placing nodes
const reflection = localStorage.getItem(`reflection_IDENTITY_SHED_inner`);
if (reflection) {
  addMessage(channel, 'system', `📝 Your reflection: ${reflection}`);
}
```

---

## Conceptual Clarity

### What Each Tool Does:

**shed-frame.html:**
- READ the framework
- STUDY operations
- COMPARE polarities
- REFLECT on meanings
- PRINT for reference

**func-orb-training.html:**
- NAVIGATE the grid
- PLACE operations spatially
- MOVE character around
- INTERACT with entities
- CHAT with axes

### They're Complementary:
```
shed-frame          →  Learn theory
func-orb-training   →  Practice application
Both together       →  Deep understanding
```

---

## Key Insights from Data

Looking at the shared FLOW data:

### IDENTITY Axis Example:

**SHED Phase:**
- INNER: "Eliminate Current Emotional Noise"
- OUTER: "Decommission Current Unused Formalisms"
- **Pattern:** Remove what clouds identity

**INTEGRATE Phase:**
- INNER: "Align Instinct to Conscious Goals"
- OUTER: "Link Reason to External Feedback"
- **Pattern:** Connect self to context

**GROUND Phase:**
- INNER: "Commit Core Value to Present Action"
- OUTER: "Formalize Principle Into Present Use"
- **Pattern:** Stabilize identity in practice

**This structure repeats across all 6 axes!**

---

## Complete Node Dataset Connection

**Also integrate:** `complete_node_dataset.json`

This file has:
- 12 known nodes (coordinates on 9×9 grid)
- 69 synthetic nodes (interpolated positions)
- Full SHED/INTEGRATE/GROUND text for each

**Connection:**
- complete_node_dataset.json = Spatial data
- FLOW structure = Operational data  
- shed-frame.html = Study interface
- func-orb-training.html = Training interface

All four pieces form ONE SYSTEM:
```
complete_node_dataset.json  ←→  Grid coordinates
         ↕                            ↕
    FLOW structure              ←→  Operations
         ↕                            ↕
  shed-frame.html              ←→  Study mode
         ↕                            ↕
func-orb-training.html         ←→  Training mode
```

---

## Testing the Integration

### Test 1: Study → Train Flow
1. Open shed-frame.html
2. Study IDENTITY > SHED > INNER
3. Open func-orb-training.html
4. Type: `@shed IDENTITY inner`
5. **Verify:** Same text appears ("Eliminate Current Emotional Noise")

### Test 2: Character Control
1. Open func-orb-training.html
2. Press ↑ arrow
3. **Verify:** Character moves UP (cone points up, not down)
4. Press ← → ↓ arrows
5. **Verify:** Character moves correctly

### Test 3: Tetrad Understanding
1. Tetrad buttons (if visible) change narrative mode
2. Arrow keys move character
3. **Verify:** These are DIFFERENT functions
4. Tetrad = AI lens, Arrows = Movement

---

## Summary

✅ **Character fixed** - No longer upside down  
✅ **Tetrad clarified** - Not for character movement  
✅ **Data connected** - Same FLOW in both files  
✅ **Two modes** - Study (shed-frame) + Train (func-orb)  
✅ **Integration clear** - Use both together for learning  

**Next Step:** Add cross-links so users can easily switch between study mode and training mode.
