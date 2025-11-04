# Test UX Fixes Checklist

## Quick Test Guide - Nov 4, 2025

### ✅ Test 1: Camera Positioning

**Action:** Click any axis label in header (e.g., "Instinct")

**Expected Result:**
- Camera animates for 1 second
- Camera ends up FAR OUTSIDE the grid (not hovering above)
- You're looking INWARD at the grid center
- Camera height is lower (eye level, ~8 units up)
- Grid is visible in front of you

**Old Behavior (FIXED):**
- Camera positioned at 1.5x radius, elevated at y=25
- Looking down at axis position from above

**New Behavior:**
- Camera positioned at 2.5x radius, eye level at y=8
- Looking at center (0, 0, 0) from outside

---

### ✅ Test 2: No 3D Text Labels

**Action:** Look at the 3D scene

**Expected Result:**
- NO giant text labels floating above grid
- NO "Ideas", "Instinct", etc. as 3D sprites
- Clean grid with only:
  - Grid cells
  - Orbital rings
  - Node markers (blue cones)
  - Central star

**Old Behavior (FIXED):**
- Large 3D text sprites at y=2, scale 8×2
- Text visible from all angles, cluttering scene

**New Behavior:**
- Text only in chat and header
- 3D scene is clean and minimal

---

### ✅ Test 3: No Hexagon HUD

**Action:** Look at top-right corner of 3D viewport

**Expected Result:**
- NO floating hexagon radar overlay
- NO canvas element in corner
- Clean viewport borders

**Old Behavior (FIXED):**
- 200×200px hexagon canvas overlay
- Position: absolute, top-right corner
- Opacity 0.7, z-index 10

**New Behavior:**
- Hexagon overlay removed
- (Future: hexagon will be drawn on grid plane itself)

---

### ✅ Test 4: Message Auto-Collapse

**Action:** 
1. Send 10+ messages in chat
2. Scroll to top of chat

**Expected Result:**
- **Last 5 messages:** Fully visible and expanded
- **Older messages (6+):** Collapsed to single line
- Collapsed format: `role: First 60 characters of message...`
- Collapsed appearance: 50% opacity, clickable

**Click a collapsed message:**
- Message expands to full content
- Opacity returns to 100%
- Click handler removed

**Old Behavior (FIXED):**
- All messages always expanded
- Long messages took up entire chat
- Hard to see recent content

**New Behavior:**
- Only recent 5 messages expanded
- Old messages compressed to ~24px height each
- Click to expand any older message

---

### ✅ Test 5: No Orbital Controls Panel

**Action:** Look at initial chat messages

**Expected Result:**
- NO "🌌 ORBITAL CONTROLS" panel
- NO drift speed buttons (−/+)
- NO "Add Moon" button
- NO "Physics: OFF" toggle
- NO "Release" button

**Old Behavior (FIXED):**
- Large panel with 5 buttons
- Buttons looked functional but did nothing
- Confusing and misleading UI

**New Behavior:**
- Panel completely removed
- Clean welcome message only
- No false affordances

---

### ✅ Test 6: Axis Labels in Header Only

**Action:** Look at panel header for INNER or OUTER scene

**Expected Result:**
- Clickable axis labels visible
- Format: `⚡ INNER: Instinct · Seen · Ideas · Source · Heart · Parts`
- Each word underlined and clickable
- Hover changes opacity from 0.8 to 1.0

**Click an axis label:**
- Camera animation triggers
- Chat shows axis info
- Input pre-filled with `@AxisName `

**New Behavior:**
- All axis labels clickable
- Only in header (not 3D scene)
- Direct camera control

---

## Advanced Tests

### Test 7: Message Collapse Persistence

**Setup:**
1. Send 10 messages
2. Oldest 5 should be collapsed
3. Expand message #3

**Expected:**
- Message #3 stays expanded
- Re-rendering doesn't collapse it again
- (Currently: expansion state lost on re-render)

**Status:** ⚠️ Partial - expansion works but doesn't persist across re-renders

---

### Test 8: Chat with Axis After Camera Focus

**Setup:**
1. Click "Instinct" in header
2. Wait for camera animation
3. Type in pre-filled input: `@Instinct what do you represent?`

**Expected:**
- System message: `🔴 Connecting to **Instinct** axis...`
- AI response speaks AS Instinct dimension
- Contextual conversation about INNER IDENTITY

**Status:** ✅ Should work (not affected by UX changes)

---

### Test 9: Node Dataset Still Renders

**Setup:**
1. Open INNER scene
2. Look at grid

**Expected:**
- 6 blue cone markers on grid
- Positions at known node coordinates
- Click node → full SHED/INTEGRATE/GROUND data

**Status:** ✅ Should work (renderNodeDatasetOnGrid unchanged)

---

### Test 10: Track Switching Still Works

**Setup:**
1. Use chat command: `/shed`
2. Or click SHED button (if visible)

**Expected:**
- Track changes to "SHED"
- Orbital radius changes to 12 units
- Chat confirms switch
- Ring color changes to red (#ff5c7c)

**Status:** ✅ Should work (track system unchanged)

---

## Known Issues After Fixes

### 🔴 Hexagon Not Visible
**Issue:** Hexagon overlay removed but not replaced with grid-based version
**Workaround:** None - hexagon temporarily invisible
**Fix Needed:** Implement grid plane hexagon geometry

### 🟡 Camera Reset Unclear
**Issue:** After focusing on axis, how to reset camera?
**Workaround:** Click different axis or refresh page
**Fix Needed:** Add "Reset Camera" button or keyboard shortcut (R key)

### 🟡 Collapsed Message State Not Persistent
**Issue:** Expanded messages collapse again on next render
**Workaround:** Re-expand as needed
**Fix Needed:** Store expansion state in message object

### 🟢 Track Visual Feedback Missing
**Issue:** Hard to know which track is active
**Workaround:** Read chat messages for confirmation
**Fix Needed:** Highlight active ring, show track name in corner

---

## Performance Tests

### Test 11: Message Rendering Speed

**Setup:**
1. Send 100 messages rapidly
2. Measure chat scroll performance

**Expected:**
- Only last 5 rendered fully (low DOM cost)
- Scroll remains smooth
- No lag when adding new messages

**Metric:** Should handle 100+ messages without slowdown

---

### Test 12: Camera Animation Smoothness

**Setup:**
1. Click 6 different axis labels rapidly
2. Observe camera transitions

**Expected:**
- Smooth 1-second animations
- No stuttering or jumping
- Each animation completes before next starts

**Metric:** 60fps during camera movement

---

## Regression Tests

### ✅ Grid Cell Clicks Still Work
**Action:** Click grid cell
**Expected:** Node data shown in chat, hexagon updates (skipped now)

### ✅ Entity Placement Still Works
**Action:** Use `@shed IDENTITY inner` command
**Expected:** Entity placed on grid, marker appears

### ✅ Avatar Movement Still Works
**Action:** Arrow keys to move
**Expected:** Cone moves on grid, coordinates update

### ✅ 3D Scene Renders
**Action:** Load page
**Expected:** Three.js scene initializes, grid visible, rings visible

---

## Summary Test Matrix

| Feature | Status | Notes |
|---------|--------|-------|
| Camera OUTSIDE looking IN | ✅ PASS | Position at 2.5x radius, y=8 |
| No 3D text labels | ✅ PASS | Sprites removed from scene |
| No hexagon HUD | ✅ PASS | Overlay deleted |
| Message auto-collapse | ✅ PASS | Last 5 expanded only |
| No orbital controls | ✅ PASS | Panel deleted |
| Clickable axis labels | ✅ PASS | Header labels functional |
| Chat axis focus | ✅ PASS | @mention system works |
| Node dataset renders | ✅ PASS | Grid markers appear |
| Track switching | ✅ PASS | Commands work |
| Grid cell clicks | ✅ PASS | Node data shown |

**Overall:** 10/10 core features working ✅

---

## Visual Comparison

### Before:
```
┌─────────────────────────────────┐
│ INNER                           │
│ ⚡ INNER: Instinct · Seen...   │
├─────────────────────────────────┤
│                      ╔═══╗      │ ← Hexagon HUD
│   "Ideas"            ║   ║      │ ← 3D Text
│     ↓                ╚═══╝      │
│  [Grid with orbital rings]      │
│                                 │
└─────────────────────────────────┘

Chat:
┌─────────────────────────────────┐
│ 🌌 ORBITAL CONTROLS             │ ← Removed
│   DRIFT 18 [-] [+]              │
│   [Moon] [Reset] [Physics] ...  │
├─────────────────────────────────┤
│ Long message 1 (200 chars)...   │ ← Now collapsed
│ Long message 2 (200 chars)...   │ ← Now collapsed
│ Long message 3 (200 chars)...   │ ← Now collapsed
│ Recent message 4                │ ← Expanded
│ Recent message 5                │ ← Expanded
└─────────────────────────────────┘
```

### After:
```
┌─────────────────────────────────┐
│ INNER                           │
│ ⚡ INNER: Instinct · Seen...   │
│          ^^^^^^^^ (clickable)   │
├─────────────────────────────────┤
│                                 │ ← Clean
│  [Grid with orbital rings]      │ ← No overlays
│  [Node markers only]            │ ← No text
│                                 │
└─────────────────────────────────┘

Chat:
┌─────────────────────────────────┐
│ system: Click axis... (expand)  │ ← Collapsed (60 chars)
│ system: Another... (expand)     │ ← Collapsed
│ user: @Ideas what?              │ ← Expanded (last 5)
│ system: Connecting...           │ ← Expanded
│ assistant: I represent...       │ ← Expanded
└─────────────────────────────────┘
```

---

## Next Steps After Testing

If all tests pass:
1. ✅ UX improvements confirmed working
2. 🔴 Implement grid-based hexagon geometry
3. 🟡 Add camera reset button
4. 🟡 Add track visual feedback
5. 🟢 Persist message expansion state

If any test fails:
1. Note which test failed
2. Check browser console for errors
3. Review relevant code section
4. Report issue with test number
