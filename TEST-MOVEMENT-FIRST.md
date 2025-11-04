# Test Movement-First UX

## Quick Test Guide

### ✅ Test 1: Avatar Visibility (< 5 seconds)

**Action:** Open `func-orb-training.html`

**Look for:**
- Glowing RED cone on grid
- Floating circle with TWO EYES above it: 👁️👁️
- Glow halo around character

**Expected:**
- Avatar visible within 2 seconds ✅
- Eyes clearly visible ✅
- Brighter than before (2.4x glow) ✅

**Pass Criteria:** Can identify character immediately

---

### ✅ Test 2: Movement Instructions (< 10 seconds)

**Action:** Look at INNER scene chat messages

**Find:**
```
🎮 HOW TO START

1. Move your character using ↑ ← ↓ → arrow keys
2. Explore the grid - find the glowing red cone with eyes 👁️👁️
3. Press SPACE when near entities to interact
```

**Expected:**
- Instructions front and center ✅
- Arrow keys emphasized ✅
- Clear 3-step process ✅

**Pass Criteria:** Know to use arrow keys without reading anything else

---

### ✅ Test 3: Movement Works

**Action:** Press UP arrow key (↑)

**Expected:**
- Character moves UP one grid cell ✅
- Chat shows: `🚶 Moved to (X, Y)` ✅
- Smooth animation ✅

**Try All Arrows:**
- ↑ = Move up
- ← = Move left  
- ↓ = Move down
- → = Move right

**Pass Criteria:** All 4 directions work

---

### ✅ Test 4: No Tetrad Clutter

**Action:** Look at chat interface

**Should NOT see:**
- ❌ "Tetrad (McLuhan):"
- ❌ Complex track mode switching buttons embedded in chat
- ❌ "RETRIEVE MODE ACTIVATED" long messages

**Should see:**
- ✅ "⚙️ Movement Controls" (collapsed details)
- ✅ Simple track confirmations: "⚡ Track: ENHANCE"

**Pass Criteria:** No overwhelming tetrad UI

---

### ✅ Test 5: Track Messages Simplified

**Action:** 
1. Expand "Movement Controls"
2. Click a track button (if visible)

**Expected Message:**
```
⚡ Track: ENHANCE
```

**NOT:**
```
⚡ **ENHANCE MODE ACTIVATED**

The tracks widen. The train accelerates...
[5 more lines of text]
```

**Pass Criteria:** Track message is 1 line, not paragraph

---

### ✅ Test 6: Movement Controls Visual

**Action:** Expand "⚙️ Movement Controls" in chat

**Expected Display:**
```
🎮 Use Arrow Keys to Move Your Character

   ↑
←  ↓  →

Press SPACE to interact with entities
```

**Features:**
- Visual 3×3 grid layout ✅
- Arrow symbols in correct positions ✅
- SPACE key mentioned ✅

**Pass Criteria:** Crystal clear control scheme

---

### ✅ Test 7: Avatar Eye Billboard

**Action:** Move camera around avatar (drag to rotate view)

**Look for:**
- Circle always faces camera ✅
- Two eyes always visible ✅
- Billboard stays same size regardless of zoom ✅

**Expected:**
- Eyes visible from ALL angles
- Face "follows" camera
- Small but readable

**Pass Criteria:** Eyes never disappear or become unreadable

---

### ✅ Test 8: Avatar Glow Sphere

**Action:** Look at avatar from different angles

**Expected:**
- Soft red glow around character ✅
- Halo effect extends beyond cone ✅
- Visible even against dark background ✅

**Pass Criteria:** Avatar "pops" visually from grid

---

### ✅ Test 9: Progression Panel Still Works

**Action:** Look for progression indicators

**Should still see:**
```
🔓 PROGRESSION
SHED ✅ UNLOCKED
INTEGRATE 🔒 LOCKED  
GROUND 🔒 LOCKED
```

**Pass Criteria:** Progression system unchanged

---

### ✅ Test 10: Grid Exploration

**Action:** 
1. Move character around grid for 30 seconds
2. Visit different cells
3. Press SPACE near entities (if any)

**Expected Experience:**
- Movement feels natural ✅
- Grid cells react to presence ✅
- SPACE interaction works ✅
- No confusion about what to do ✅

**Pass Criteria:** Can navigate and explore intuitively

---

## 🎯 Overall Experience Test

### First 60 Seconds:

**0-10 sec:** See avatar with eyes, read "Use Arrow Keys"  
**10-20 sec:** Press arrow, character moves  
**20-40 sec:** Explore grid, find entities/nodes  
**40-60 sec:** Press SPACE, interact with something  

**Success = User engaged and exploring within 1 minute**

---

## ❌ Red Flags

If you see ANY of these, something broke:

- ❌ Avatar has no eyes
- ❌ Avatar not glowing
- ❌ "Tetrad (McLuhan)" still visible in main UI
- ❌ Long "MODE ACTIVATED" messages
- ❌ Arrow keys don't move character
- ❌ Can't find character on grid
- ❌ No movement instructions

---

## 🔧 Debug Checklist

**Avatar not visible?**
- Check console for Three.js errors
- Verify avatar created at line 6619-6680
- Check camera position (should see grid)

**Eyes not showing?**
- Check canvas rendering (lines 6646-6664)
- Verify sprite added to avatar mesh
- Check sprite scale (0.08, 0.08, 1)

**Movement not working?**
- Check arrow key handlers
- Verify avatar.row and avatar.col update
- Check gridRowColToWorld function

**Track messages too long?**
- Check lines 5517-5523
- Should be simple emoji + text only

---

## ✅ Pass/Fail Criteria

**PASS = All 10 tests pass**

**FAIL = Any of:**
- Can't see avatar
- Can't see eyes
- Arrow keys don't work
- Tetrad clutter still present
- Track messages still verbose

---

## 📊 Quick Scorecard

| Test | Pass | Notes |
|------|------|-------|
| 1. Avatar Visibility | ⬜ | Glowing cone + eyes |
| 2. Movement Instructions | ⬜ | Clear 3-step guide |
| 3. Movement Works | ⬜ | All 4 arrows |
| 4. No Tetrad Clutter | ⬜ | Clean UI |
| 5. Track Messages Simple | ⬜ | 1 line each |
| 6. Control Visual | ⬜ | 3×3 grid shown |
| 7. Eye Billboard | ⬜ | Always faces camera |
| 8. Glow Sphere | ⬜ | Halo effect |
| 9. Progression Works | ⬜ | Unchanged |
| 10. Grid Exploration | ⬜ | Intuitive |

**Score: ___/10**

**Status: [ ] PASS  [ ] FAIL**

---

## 🎮 User Feedback Questions

After testing, ask:

1. "How quickly did you find your character?"
2. "Did you know to use arrow keys?"
3. "Could you see the eyes on the character?"
4. "Was it clear how to move around?"
5. "Did the track mode messages distract you?"

**Good answers:**
- "Saw it right away"
- "Yes, instructions were clear"
- "Eyes made it obvious"
- "Just started pressing arrows"
- "What track messages?" (because they're so minimal)

---

## Summary

**Test focuses on:**
- ✅ Visual clarity (can you see the character?)
- ✅ Control clarity (do you know to use arrows?)
- ✅ Immediate engagement (can you start moving?)
- ✅ No distractions (tetrad/track clutter removed?)

**Expected result:** User moving and exploring within 30 seconds with no confusion.
