# QUICK REFERENCE CARD

## The One-Sentence Summary

**Orbital Psychographic Grid**: You orbit through a 9×9 coordinate system where your spatial position (inner/middle/outer ring) enacts psychographic operations (ground/integrate/shed) on nodes that inject context-aware prompts into AI conversations.

---

## The Essential Mappings

```
SPATIAL                 ⟺   SEMANTIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Outer ring (r=20)      ⟺   SHED operation
Middle ring (r=15)     ⟺   INTEGRATE operation  
Inner ring (r=10)      ⟺   GROUND operation

Grid cell [row,col]    ⟺   Psychographic node
Crossing node          ⟺   Trigger event
Node data              ⟺   Hidden system prompt
Orbital path           ⟺   Transformation journey

6 grid zones           ⟺   6 semantic axes:
                            Identity, Experience,
                            Language, Domain,
                            Purpose, Order

User avatar            ⟺   Current psychographic state
Observer history       ⟺   Profile/trajectory
```

---

## The Three Core Mechanics

### 1. POSITION = OPERATION
```
┌─────────────────────────────────────────┐
│  Move to outer ring (r=20) → SHED      │
│  Stay in middle ring (r=15) → INTEGRATE│
│  Move to inner ring (r=10) → GROUND    │
└─────────────────────────────────────────┘
```
**Not a dropdown menu—your orbit IS the operation.**

### 2. CROSSING = EVENT
```
┌─────────────────────────────────────────┐
│  Avatar crosses node → Prompt injects   │
│  Cell pulses green → User sees notice   │
│  Observer tracks → Context updates      │
└─────────────────────────────────────────┘
```
**Nodes are temporal waypoints, not static data.**

### 3. CONTEXT = AWARENESS
```
┌─────────────────────────────────────────┐
│  AI sees:                               │
│  • Current node ("Creative Balance")    │
│  • Active operation (INTEGRATE)         │
│  • Recent crossings (last 5)            │
│  • Surrounding cells (8 directions)     │
│  • Hidden prompt from node              │
└─────────────────────────────────────────┘
```
**AI knows where you are in psychographic space.**

---

## The Data Structure (81 Nodes)

### 12 Known Nodes (Brightest)
```
[1,5] Identity Inner (Instinct)
[1,7] Experience Inner (Seen)
[3,9] Language Inner (Ideas)
[5,9] Domain Inner (Source)
[7,9] Purpose Inner (Heart)
[9,7] Order Inner (Parts)
[9,5] Identity Outer (Reason)
[9,3] Experience Outer (Unseen)
[7,1] Language Outer (Ideology)
[5,1] Domain Outer (Resource)
[3,1] Purpose Outer (Head)
[1,3] Order Outer (Whole)
```

### 69 Synthetic Nodes (Interpolated)
Geometrically distributed across grid based on:
- Distance from center [5,5]
- Nearest known node influence
- Quadrant (8 zones: corners, edges, near-center)

**Each node has**:
```json
{
  "coordinate": [row, col],
  "name": "Creative Balance",
  "distance_from_center": 2.0,
  "quadrant": "Near Center",
  "nearest_node": "Identity Inner",
  "shedding": "Release perfectionist creation...",
  "integrating": "Address creative paralysis...",
  "grounding": "Make messy things..."
}
```

---

## The User Experience Flow

```
1. User enters → Avatar spawns at CENTER [5,5]
                 Begins orbiting in INTEGRATE ring (r=15)

2. Avatar moves → Crosses [5,6] "Vertical Axis"
                  Cell pulses, system injects prompt

3. User types  → "how do I balance depth vs breadth?"

4. AI responds → Sees hidden prompt: "Integrate depth with breadth"
                 Response: "You're at Vertical Axis, where..."
                 JSON: {"entities": [...]}

5. Entities    → Placed on grid at appropriate coordinates

6. User moves  → Continues orbiting, crosses next node
                 (Cycle repeats)
```

---

## UI Elements

### HUD (Top-Left)
```
📍 Creative Balance
[3,5] · Distance: 2.0
🔄 INTEGRATE
Axis: Identity · Near Center
```

### Operation Switcher (Bottom-Center)
```
[SHED r=20]  [INTEGRATE r=15]  [GROUND r=10]
   red           blue (active)      green
```

### Profile Panel (Collapsible)
```
Orbit Statistics
• Nodes crossed: 47
• Operations: SHED 14 | INT 22 | GRD 11
• Time: 18m 23s

Most Visited
1. Creative Balance (7x)
2. Stable Presence (6x)
3. The Center (5x)
```

---

## AI System Prompt Template

```
You are a psychographic navigator. User is orbiting [5,6] "Vertical Axis"
in INTEGRATE ring (r=15).

POSITION CONTEXT:
- Axis: Domain · Near Center
- Distance from center: 1.0
- Quadrant: Inner Ring

ACTIVE OPERATION: INTEGRATE
Node instruction: "Address scattered energy. Integrate depth with breadth."

RECENT CROSSINGS:
- Creative Balance [3,5]
- Stable Presence [4,5]
- The Center [5,5]

RESPONSE FORMAT:
1. Acknowledge position naturally
2. Respond with operation-aware guidance  
3. Include JSON entities reflecting integration theme

EXAMPLE:
"You're at Vertical Axis—the space where depth meets breadth. To integrate...

```json
{"entities": [
  {"type": "Solution", "row": 5, "col": 6, "label": "Unified approach"}
]}
```
"
```

---

## Technical Architecture

### File Structure (Single HTML)
```
orbit-psychographic-v1.html
├── <style>           CSS (grid, rings, HUD, profile)
├── <script>          Three.js, core logic
│   ├── Data loading  (fetch complete_node_dataset.json)
│   ├── Grid init     (9×9 cells, map to nodes)
│   ├── Avatar        (orbital body + trail)
│   ├── Rings         (3 circles, color-coded)
│   ├── Crossing      (detect, debounce, activate)
│   ├── Prompt inject (hidden system message)
│   ├── AI call       (context builder + OpenAI)
│   ├── Observer      (track crossings, build profile)
│   └── UI updates    (HUD, switcher, profile)
└── Dependencies:
    • Three.js (CDN)
    • GSAP (optional, smooth transitions)
    • complete_node_dataset.json (81 nodes)
```

### Key Functions
```javascript
// Core cycle
updateAvatar()           // Move along orbit
checkNodeCrossing()      // Detect cell change
activateNode()           // Inject prompt, notify
buildContext()           // Position + operation + observer
sendMessage()            // AI call with context
placeEntities()          // Parse JSON, update grid
updateObserver()         // Track action

// Ring switching
switchOperation('SHED')  // Animate to r=20

// Profile
renderProfile()          // Stats dashboard
exportProfile()          // Download JSON
```

---

## Implementation Checklist

### Phase 1: Foundation (4 hours)
- [ ] Load node dataset (complete_node_dataset.json)
- [ ] Render 9×9 grid with Three.js
- [ ] Map nodes to cells (hover → tooltip)
- [ ] Create user avatar (golden sphere)
- [ ] Animate orbital motion (smooth, configurable speed)
- [ ] Draw 3 operation rings (color-coded)
- [ ] Detect node crossings (worldToGrid transform)
- [ ] Visual feedback (cell pulse on cross)

### Phase 2: AI Integration (3 hours)
- [ ] Inject hidden prompts on crossing
- [ ] Build psychographic context string
- [ ] OpenAI API call with context
- [ ] Parse JSON entities from response
- [ ] Place entities on grid
- [ ] Update observer history

### Phase 3: Polish (3 hours)
- [ ] HUD (position, operation, node name)
- [ ] Operation switcher (buttons + transitions)
- [ ] Axis color gradients on grid
- [ ] Profile panel (statistics)
- [ ] Mobile-responsive layout
- [ ] Export functionality

---

## Testing Scenarios

### Test 1: Static Display
1. Open page → Grid visible with 81 cells
2. Hover any cell → Tooltip shows node data
3. Known nodes (12) brighter than synthetic (69)
4. Console: "Grid initialized with 81 nodes"

### Test 2: Orbital Motion
1. Avatar spawns at [5,5] center
2. Begins orbiting at r=15 (INTEGRATE ring)
3. Trail visible behind avatar (fades over time)
4. FPS counter shows 60fps

### Test 3: Node Crossing
1. Avatar crosses [5,6]
2. Cell pulses green briefly
3. Notification: "📍 Vertical Axis"
4. Console: "Node activated: Vertical Axis (INTEGRATE)"

### Test 4: Operation Switch
1. Click [SHED] button
2. Avatar smoothly transitions to r=20 (1.5s)
3. HUD updates: "🔄 SHED"
4. Outer ring highlights

### Test 5: AI Context
1. Cross node [3,5] "Creative Balance"
2. Type: "I'm stuck on this project"
3. AI response mentions "Creative Balance" and "perfectionism"
4. JSON entities placed on grid
5. Observer history includes crossing

---

## Common Patterns

### Spatial → Semantic Mapping
```javascript
// Position determines operation
const radius = Math.sqrt(x*x + z*z);
if (radius > 17.5) operation = 'SHED';
else if (radius > 12.5) operation = 'INTEGRATE';
else operation = 'GROUND';

// Cell → Node lookup
const {row, col} = worldToGrid(x, z);
const node = nodeDataset.find(n => 
  n.coordinate[0] === row && n.coordinate[1] === col
);

// Operation → Prompt extraction
const prompt = node[operation.toLowerCase()]; // "shedding" | "integrating" | "grounding"
```

### Context Building
```javascript
const context = `
POSITION: ${node.name} at [${row},${col}]
OPERATION: ${operation}
AXIS: ${node.axis} · ${node.polarity}
DISTANCE: ${node.distance_from_center}

INSTRUCTION: ${prompt}

RECENT: ${recentCrossings.map(c => c.node.name).join(', ')}
`;
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Grid not visible | Camera position wrong | Reset: `camera.position.set(0, 20, 20)` |
| Avatar not moving | Speed too slow | Increase `orbitSpeed` (try 0.005) |
| No crossings detected | Transform broken | Check `worldToGrid()` math |
| Duplicate triggers | No debounce | Add `lastVisited` timestamp per cell |
| AI doesn't see context | Hidden message not included | Filter: `messages.filter(m => m.hidden || !m.system)` |
| Entities off-grid | Bad coordinates in JSON | Clamp: `row = Math.max(0, Math.min(8, row))` |

---

## Extensions (Future)

- [ ] **Multi-user orbits**: See other users' avatars
- [ ] **Shared profiles**: Compare orbital trajectories
- [ ] **Time-lapse replay**: Animate your journey
- [ ] **Heatmap overlay**: Most-visited zones
- [ ] **Path prediction**: ML suggests next node
- [ ] **Axis isolation**: Focus single dimension
- [ ] **Custom nodes**: User-defined coordinates
- [ ] **Export to VR**: Immersive psychographic space

---

## Key Equations

### World ↔ Grid Transform
```javascript
// Grid to World (center = origin)
x = (col - 4) * cellSize
z = (row - 4) * cellSize

// World to Grid
row = Math.floor(z / cellSize) + 4
col = Math.floor(x / cellSize) + 4
```

### Orbital Position
```javascript
// Circular motion
x = Math.cos(angle) * radius
z = Math.sin(angle) * radius
angle += speed  // Increment each frame
```

### Operation from Radius
```javascript
// Quantize radius to operation
if (radius > 17.5) return 'SHED';
else if (radius > 12.5) return 'INTEGRATE';
else return 'GROUND';
```

---

## Resources

- **Three.js Docs**: https://threejs.org/docs/
- **GSAP Animations**: https://greensock.com/gsap/
- **OpenAI API**: https://platform.openai.com/docs/
- **Spencer-Brown Laws of Form**: Distinction calculus
- **McLuhan Tetrad**: Enhance/Reverse/Retrieve/Obsolesce

---

## Credits

**Synthesis by**: Cascade AI  
**Frameworks used**: Spencer-Brown olog, McLuhan tetrad, LEGOS spatial narrative  
**Data source**: complete_node_dataset.json (12 known + 69 synthetic nodes)  
**Base system**: orbit-graph (1).html (Three.js orbital mechanics)  
**Operation framework**: index.html (SHED/INTEGRATE/GROUND)  

---

**Print this page for quick reference during implementation!** 📄
