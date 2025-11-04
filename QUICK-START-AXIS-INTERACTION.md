# Quick Start: Axis Interaction System

## 🎯 What You Can Do Now

### 1. **Click Axis Labels**

```
┌─────────────────────────────────────┐
│ INNER                               │
│ ⚡ INNER: Instinct · Seen · Ideas  │
│          ^^^^^^^   ^^^^   ^^^^^     │  ← ALL CLICKABLE
│          Source · Heart · Parts     │
│          ^^^^^^   ^^^^^   ^^^^^     │
├─────────────────────────────────────┤
│ [3D Scene with orbital rings]       │
│                                     │
│ [Hexagon radar in corner]          │
└─────────────────────────────────────┘
```

**What Happens When You Click:**
- ✅ Camera smoothly animates to focus on that axis
- ✅ Axis radar line flashes white in 3D scene
- ✅ Chat shows axis description + node data
- ✅ Input field pre-filled with `@AxisName `

---

### 2. **Node Dataset on Grid**

**INNER Scene** → Automatically shows 6 nodes:
- (1,5) Identity Inner - Instinct
- (1,7) Experience Inner - Seen
- (3,9) Language Inner - Ideas
- (5,9) Domain Inner - Source
- (7,9) Purpose Inner - Heart
- (9,7) Order Inner - Parts

**OUTER Scene** → Automatically shows 6 nodes:
- (9,5) Identity Outer - Reason
- (9,3) Experience Outer - Unseen
- (7,1) Language Outer - Ideology
- (5,1) Domain Outer - Resource
- (3,1) Purpose Outer - Head
- (1,3) Order Outer - Whole

**Visual:**
```
Grid cells appear as blue Location markers (🔵)
Click them → Full node data in chat + hexagon update
```

---

### 3. **Chat with Axes**

**Type:** `@Instinct what is my core nature?`

**System responds:**
```
🔴 Connecting to **Instinct** axis...

AI (speaking AS Instinct): I am your unfiltered self, 
the impulses before thought. Your core nature is to 
trust immediate knowing without requiring external 
validation...
```

**All Available @Mentions:**

**INNER (🔴):**
- `@Instinct` - Raw knowing, gut feelings
- `@Seen` - Observable reality, sensory data
- `@Ideas` - Personal concepts, meanings
- `@Source` - Origin points, creativity
- `@Heart` - Emotional drive, feelings
- `@Parts` - Individual components, details

**OUTER (🔵):**
- `@Reason` - Logical structure, principles
- `@Unseen` - Hidden dynamics, inferences
- `@Ideology` - Shared beliefs, narratives
- `@Resource` - Assets, practical tools
- `@Head` - Strategic thinking, plans
- `@Whole` - System-level patterns, order

---

### 4. **Camera Controls**

**After Clicking Axis:**
- Camera position: 1.5x radius from axis, elevated
- Animation: 1 second smooth cubic ease-out
- OrbitControls: Still work! Drag to adjust view
- Focus preserved: Can manually orbit around axis

**Reset View:**
- Press R key (if implemented)
- Or click different axis to refocus

---

### 5. **Example Workflows**

#### **A. Explore IDENTITY Axis**

```
1. Open INNER scene
2. Click "Instinct" label
   → Camera focuses, radar flashes
   → Chat: "Focusing on: Instinct"
   → Input: "@Instinct █"
3. Type: "@Instinct what drives me?"
   → AI responds AS Instinct dimension
4. Click grid node at (1,5)
   → Hexagon IDENTITY expands
   → See full SHED/INTEGRATE/GROUND data
```

#### **B. Compare INNER vs OUTER**

```
1. INNER scene: Click "Heart"
   → Chat with @Heart about emotions
2. Switch to OUTER scene
3. Click "Head" (same PURPOSE axis, different polarity)
   → Chat with @Head about strategy
4. Compare their responses
   → See polarity differences
```

#### **C. Navigate Full Framework**

```
INNER: Click each axis in order
  Instinct → Seen → Ideas → Source → Heart → Parts
  
Result: Complete tour of subjective dimensions
Each click = camera move + axis description + chat ready
```

---

### 6. **Visual Feedback**

**Clickable State:**
```css
Axis Label:
  Normal: underline, opacity 0.8
  Hover: opacity 1.0
  Click: camera animation + flash
```

**Axis Highlighting:**
```
Radar line in 3D:
  Normal: Colored, opacity 0.8, linewidth 2
  Focused: White, opacity 1.0, linewidth 4
  Returns: Original color after 500ms
```

**Chat Indicators:**
```
🔴 = INNER axis
🔵 = OUTER axis
⚪ = Synthetic node
```

---

### 7. **Keyboard Shortcuts** (if implemented)

- `R` - Reset camera to overview
- `1-6` - Focus on axis by number
- `Tab` - Cycle through axes
- `Space` - Return to center
- `Shift+Click` - Focus without chat
- `Ctrl+Click` - Focus + zoom in

---

### 8. **Troubleshooting**

**Issue:** Axis labels not clickable
**Fix:** Refresh page, ensure complete_node_dataset.json loaded

**Issue:** Camera doesn't move
**Fix:** Check console for radarLines errors

**Issue:** Node dataset not showing
**Fix:** Verify you're in POLARITY_INNER or POLARITY_OUTER scene

**Issue:** @mention not working
**Fix:** Type exactly `@AxisName` with capital first letter

---

### 9. **Data Structure**

**Node Dataset Format:**
```json
{
  "known_nodes": [
    {
      "id": 1,
      "coordinate": [1, 5],
      "name": "Identity Inner",
      "subtitle": "Instinct",
      "axis": "Identity",
      "polarity": "Inner",
      "shedding": "Recognize compromise...",
      "integrating": "Address precarious energy...",
      "grounding": "Honor your impulses..."
    }
  ]
}
```

**Axis Mapping:**
```
TRAINING_GROUND.AXES = [
  'IDENTITY',    // 0
  'EXPERIENCE',  // 1
  'LANGUAGE',    // 2
  'DOMAIN',      // 3
  'PURPOSE',     // 4
  'ORDER'        // 5
]

INNER_LABELS = {
  'IDENTITY': 'Instinct',
  'EXPERIENCE': 'Seen',
  'LANGUAGE': 'Ideas',
  'DOMAIN': 'Source',
  'PURPOSE': 'Heart',
  'ORDER': 'Parts'
}
```

---

### 10. **Advanced Usage**

**Combine Grid + Axis:**
```
1. Click grid node at (1,5) - "Identity Inner"
   → Hexagon emphasizes IDENTITY
2. Then click "Instinct" axis label
   → Camera focuses on IDENTITY
   → Now chat about that specific node
3. Ask: "@Instinct what should I shed?"
   → AI references the node's shedding data
```

**Multi-Axis Exploration:**
```
Click through all 6 axes in one scene:
  Each click = new perspective
  Build comprehensive understanding
  See how axes relate spatially
```

**Cross-Scene Navigation:**
```
INNER scene: Click "Instinct" → explore subjective
Switch to OUTER scene: Click "Reason" → explore objective
Compare responses between polarities
```

---

## 🚀 Get Started

1. **Open func-orb-training.html**
2. **Choose INNER or OUTER scene**
3. **Click any axis label** (e.g., "Instinct")
4. **Watch camera animate**
5. **Type `@AxisName` to chat**
6. **Click grid nodes for full data**
7. **Explore all 6 axes!**

---

## 📊 What's Rendering

### INNER Scene:
```
✅ 6 axis labels (clickable)
✅ 6 node dataset markers on grid
✅ Hexagon radar (red polygon)
✅ 6 radar scanning lines
✅ Central star (red glow)
✅ 81 grid cells (9×9)
```

### OUTER Scene:
```
✅ 6 axis labels (clickable)
✅ 6 node dataset markers on grid
✅ Hexagon radar (blue polygon)
✅ 6 radar scanning lines
✅ Central star (blue glow)
✅ 81 grid cells (9×9)
```

### OBSERVER Scene:
```
✅ Both polarities visible
✅ No clickable axes (watches both)
✅ Dual hexagons (red + blue)
✅ Both node sets combined
```

---

## ✨ Key Features

- ✅ **Clickable axis labels** - Direct camera control
- ✅ **Smooth animations** - 1s cubic ease-out
- ✅ **Visual feedback** - Flashing radar lines
- ✅ **Chat integration** - @mention any axis
- ✅ **Node dataset** - Auto-renders on grid
- ✅ **Hexagon updates** - Real-time emphasis
- ✅ **Pre-filled input** - Ready to type
- ✅ **Context awareness** - AI knows which axis

**Result:** Intuitive exploration of the complete training ground framework through spatial interaction and conversational AI.
