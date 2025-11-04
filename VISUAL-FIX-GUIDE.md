# Visual Fix Guide - Before & After

## Character Orientation Fix

### BEFORE (Broken) ❌
```
        ╲___╱   ← Base at top
         ╲ ╱    
          ▼     ← Point facing DOWN (upside down!)
         
    (rotation.x = Math.PI)
```

### AFTER (Fixed) ✅
```
          ▲     ← Point facing UP (correct!)
    👁️ 👁️      ← Eyes on top
         ╱ ╲    ← Glowing red
        ╱___╲   ← Base at bottom
         
    (no rotation needed - default is correct)
```

---

## Interface Comparison

### shed-frame.html (Study Mode)
```
┌─────────────────────────────────────────────┐
│ ≡  [IDENTITY AXIS]                    ⊞    │
├──┬──────────────────────────────────────────┤
│ID│ SHED          INTEGRATE       GROUND     │
│  │┌────────────┐ ┌────────────┐ ┌─────────┐│
│EX││ INSTINCT   │ │ INSTINCT   │ │INSTINCT ││
│  ││ Eliminate  │ │ Align...   │ │Commit...││
│LA││ Current    │ │ Instinct   │ │Core...  ││
│  ││ Emotional  │ │ to Goals   │ │         ││
│DO││ Noise      │ │            │ │         ││
│  ││            │ │            │ │         ││
│PU││ [notes...] │ │ [notes...] │ │[notes..]││
│  │└────────────┘ └────────────┘ └─────────┘│
│OR│┌────────────┐ ┌────────────┐ ┌─────────┐│
│  ││ REASON     │ │ REASON     │ │REASON   ││
│  ││ Decomm...  │ │ Link...    │ │Formal...││
│  │└────────────┘ └────────────┘ └─────────┘│
└──┴──────────────────────────────────────────┘
                                            🎮 ← Click to train
```

### func-orb-training.html (Training Mode)
```
┌─────────────────────────────────────────────┐
│ INNER                                 ▲↺◉⛶‹ │
│ ⚡ INNER: Instinct · Seen · Ideas...        │
│         ^^^^^^^^ (click to focus camera)    │
├─────────────────────────────────────────────┤
│                                             │
│    🌐 Orbital rings (SHED/INTEGRATE/GROUND)│
│                                             │
│         [9×9 Grid with nodes]               │
│                                             │
│            👁️👁️  ← Your character         │
│             ▲                               │
│            ╱ ╲  (glowing red, upright!)    │
│           ╱___╲                             │
│                                             │
├─────────────────────────────────────────────┤
│ Chat:                                       │
│ 📚 Study Mode: Open Framework Sheet  ← Link│
│                                             │
│ 🎮 Use ↑←↓→ to move                        │
│ @shed IDENTITY inner → Place node          │
└─────────────────────────────────────────────┘
```

---

## Movement Controls Clarity

### OLD (Confusing) ❌
```
⚙️ Advanced Controls
  Tetrad (McLuhan):
  ↑←○→↓⏯  [mysterious buttons]
  
  (User thinks: "Do these move my character?")
```

### NEW (Clear) ✅
```
⚙️ Movement Controls
  🎮 Use Arrow Keys to Move Your Character
  
     ↑
  ←  ↓  →
  
  Press SPACE to interact with entities
  
  (User thinks: "Oh! Arrow keys move me!")
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         SHARED FLOW DATA STRUCTURE          │
│  6 Axes × 3 Phases × 2 Polarities = 36 ops │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌───────────────┐   ┌──────────────────┐
│ shed-frame    │   │ func-orb-training│
│   .html       │   │     .html        │
├───────────────┤   ├──────────────────┤
│ Study Mode    │◄─►│ Training Mode    │
│ Read theory   │ 🎮│ Practice spatial │
│ Take notes    │ 📚│ Move character   │
│ Print-ready   │   │ Place nodes      │
│ Side-by-side  │   │ Chat with axes   │
└───────────────┘   └──────────────────┘
```

---

## Track vs Movement Clarity

### What TETRAD Does (Narrative Lens):
```
ENHANCE  → "What if this grew stronger?"
REVERSE  → "What if this diminished?"
RETRIEVE → "What if this returned?"
OBSOLESCE→ "What if this faded away?"

Changes: AI interpretation, narrative stance
Does NOT: Move character on grid
```

### What ARROWS Do (Character Movement):
```
  ↑  → Move UP    (row - 1)
  ←  → Move LEFT  (col - 1)
  ↓  → Move DOWN  (row + 1)
  →  → Move RIGHT (col + 1)

Changes: Character position on 9×9 grid
Does NOT: Affect narrative mode
```

### These Are DIFFERENT Functions! ✅
```
Track Mode    = AI's lens (how it sees the scene)
Arrow Keys    = Your position (where you are)
Both working  = Not broken, just different purposes
```

---

## Integration Workflow Visual

```
START
  ↓
┌──────────────────────────────┐
│ Open shed-frame.html         │
│ Select: IDENTITY             │
│ Read: SHED · INTEGRATE · GRD │
│ Note: INNER vs OUTER         │
└──────────────┬───────────────┘
               │ 🎮 Click training button
               ↓
┌──────────────────────────────┐
│ func-orb-training.html opens │
│ See: Character with eyes 👁️ │
│ Press: ↑←↓→ to move          │
│ Type: @shed IDENTITY inner   │
│ See: Same data from study!   │
└──────────────┬───────────────┘
               │ 📚 Click study link
               ↓
         Back to shed-frame
               │
               ↓
      Repeat until learned!
```

---

## Character Features

### Enhanced Avatar Checklist:

✅ **Emissive Glow:** 2.4x brighter (1.2 vs 0.5)  
✅ **Glow Sphere:** Halo effect around body  
✅ **Eye Billboard:** Two eyes always facing camera  
✅ **Upright Pose:** Cone points UP (not down)  
✅ **Small Eyes:** Visible but not overwhelming (0.08 scale)  
✅ **Red Color:** #ff4d2e (matches theme)  

### Visual Breakdown:
```
         👁️ 👁️     ← Billboard sprite (always faces you)
           |        
           |        
           ▲        ← Cone mesh (now pointing UP!)
          ╱🔴╲      ← Glow sphere (halo effect)
         ╱___╲     ← Cone base
          |||       
      Floor grid    ← Standing on grid cell
```

---

## Data Match Verification

### Example: IDENTITY Axis

**In shed-frame.html card:**
```
┌────────────────────────────┐
│ SHED                       │
│ ┌────────────────────────┐ │
│ │ INSTINCT        [INNER]│ │
│ │ Eliminate Current      │ │
│ │ Emotional Noise        │ │
│ │ • Noise In Immediate   │ │
│ │   Preference           │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

**In func-orb-training.html when you type:**
```
> @shed IDENTITY inner

Response:
✅ Placed Instinct (SHED • IDENTITY • inner) at (2,3)

📍 Operation: Eliminate Current Emotional Noise
🎯 Target: Noise In Immediate Preference

(Exact same data!)
```

---

## Quick Reference Card

```
╔═══════════════════════════════════════════╗
║      SHED-FRAME INTEGRATION GUIDE         ║
╠═══════════════════════════════════════════╣
║                                           ║
║ Character Fixed:                          ║
║   ✅ Upright (no rotation)               ║
║   ✅ Eyes on top 👁️👁️                  ║
║   ✅ Bright glow (2.4x)                  ║
║                                           ║
║ Movement:                                 ║
║   ↑←↓→  = Move character                 ║
║   SPACE = Interact                        ║
║   Tetrad ≠ Movement (it's AI lens)       ║
║                                           ║
║ Two Tools, One Framework:                 ║
║   shed-frame.html    = Study 📚          ║
║   func-orb-training  = Train 🎮          ║
║                                           ║
║ Links:                                    ║
║   📚 In training → "Study Mode" link     ║
║   🎮 In study → bottom-left button       ║
║                                           ║
║ Data:                                     ║
║   Same FLOW structure in both files      ║
║   36 operations (6×3×2)                  ║
║   Perfect match verified ✅              ║
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## Summary

All fixes complete! 🎉

1. ✅ Character upright (not upside-down)
2. ✅ Movement controls clear (arrows, not tetrad)
3. ✅ Data connected (same FLOW in both files)
4. ✅ Links added (study ↔ training)
5. ✅ Documentation complete (4 guide files)

**You're ready to use both tools together!** 🚀
