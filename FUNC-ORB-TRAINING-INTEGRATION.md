# Func-Orb + Training Ground Integration

## What Was Added

Extended **func-orb.html** → **func-orb-training.html** with training ground psychographic system.

### 1. Training Ground Data Structure

Added complete 108-node dataset from tra.html:
- **3 Stages** × **6 Axes** × **2 Pairs** = 36 operations
- Color-coded by stage:
  - 🔴 SHED (red tones: 0xff5c7c, 0xff7c9c)
  - 🔵 INTEGRATE (blue tones: 0x569fff, 0x76afff)
  - 🟢 GROUND (green tones: 0x56ff9f, 0x76ffaf)

Each node has:
- `text`: Operation description
- `target`: Target state
- `pair`: Polarity name (Instinct, Reason, Seen, etc.)
- `color`: Hex color for 3D visualization

### 2. 6-Axis Psychographic Radar Overlay

**Visual**: Top-right corner of 3D viewport (200×200 canvas)

**Axes**:
1. **IDENTITY** (Instinct ↔ Reason)
2. **EXPERIENCE** (Seen ↔ Unseen)
3. **LANGUAGE** (Ideas ↔ Ideology)
4. **DOMAIN** (Source ↔ Resource)
5. **PURPOSE** (Heart ↔ Head)
6. **ORDER** (Parts ↔ Whole)

**Updates**:
- Draws every frame in animation loop
- Values increase as you place nodes on corresponding axes
- Shows your "psychographic profile" as you train

### 3. Training Node Placement Commands

#### **@shed [AXIS] [inner/outer]**
Places a SHED operation node on the grid.

Example:
```
@shed IDENTITY inner
```
Places "Instinct" (Eliminate Current Emotional Noise) on grid.

Result:
- Node appears as 3D marker on grid
- IDENTITY axis increases by 15% on radar
- Chat shows operation details + target state

#### **@integrate [AXIS] [inner/outer]**
Places an INTEGRATE operation node.

Example:
```
@integrate LANGUAGE outer
```
Places "Ideology" (Connect Ideas to Guiding Narrative) on grid.

#### **@ground [AXIS] [inner/outer]**
Places a GROUND operation node.

Example:
```
@ground PURPOSE inner
```
Places "Heart" (Execute Goal With Full Commit) on grid.

### 4. Radar Display Command

**`show radar`** or **`psychographic`**

Shows current axis values:
```
📊 PSYCHOGRAPHIC RADAR

IDENTITY: 45%
EXPERIENCE: 30%
LANGUAGE: 60%
DOMAIN: 30%
PURPOSE: 75%
ORDER: 30%

The radar overlay (top-right) shows your
current axis distribution.
```

## How It Works

### Placement Flow

1. User types: `@shed IDENTITY inner`
2. System finds empty grid cell
3. Creates entity with node data
4. Places 3D marker (colored by stage)
5. Updates radar axis value (+15%)
6. Displays operation + target in chat

### Axis Tracking

Each channel tracks `trainingAxisValues` array:
```javascript
channel.trainingAxisValues = [
  0.30,  // IDENTITY
  0.30,  // EXPERIENCE
  0.30,  // LANGUAGE
  0.30,  // DOMAIN
  0.30,  // PURPOSE
  0.30   // ORDER
]
```

Placing a node increases corresponding axis by 0.15 (capped at 1.0).

### Visual Feedback

**Grid Markers**:
- SHED nodes: Red/pink tones
- INTEGRATE nodes: Blue tones
- GROUND nodes: Green tones
- Size/shape from existing entity system

**Radar Polygon**:
- Connects axis values into hexagon
- Filled with transparent accent color
- Updates in real-time as nodes placed

## Usage Example

**Session 1**: Build IDENTITY axis
```
> @shed IDENTITY inner
✅ Placed Instinct (SHED • IDENTITY • INNER)
📊 IDENTITY axis: 45%

> @integrate IDENTITY inner
✅ Placed Instinct (INTEGRATE • IDENTITY • INNER)
📊 IDENTITY axis: 60%

> @ground IDENTITY inner
✅ Placed Instinct (GROUND • IDENTITY • INNER)
📊 IDENTITY axis: 75%
```

**Session 2**: Explore LANGUAGE axis
```
> @shed LANGUAGE inner
✅ Placed Ideas...

> @integrate LANGUAGE outer
✅ Placed Ideology...

> show radar
📊 IDENTITY: 75%
    LANGUAGE: 60%
    (others: 30%)
```

## What Func-Orb SHED

By adding training ground to func-orb instead of rebuilding:

### ✅ **Kept From Func-Orb**
- 3D grid visualization (9×9 cells)
- Observer system (entity tracking)
- Chat interface with commands
- Existing entity placement logic
- Camera controls
- Orbital bodies
- Resize bar
- Multi-channel support

### ➕ **Added From Training Ground**
- 108-node psychographic dataset
- 6-axis radar overlay
- Training-specific commands (@shed, @integrate, @ground)
- Axis value tracking
- Stage-based color coding
- Operation → Target display

### 🎯 **What's SHED**
Nothing removed - pure addition. Func-orb's existing features still work:
- Regular entity placement still works
- Grid commands still work
- Camera commands still work
- Orbital motion still works

Training nodes are just a new entity type that updates radar values.

## Integration Architecture

```
func-orb.html (base)
    ↓
    + TRAINING_GROUND data object (lines 4888-4972)
    + drawTrainingRadar() function (lines 4975-5057)
    + Training commands in sendMessageWithLEGOS() (lines 2798-2878)
    + drawTrainingRadar() call in animate3D() (line 5542)
    ↓
func-orb-training.html (extended)
```

**Total additions**: ~180 lines
**Base preserved**: 5370 lines

## Technical Details

### Radar Rendering

Called every frame in `animate3D()`:
```javascript
function drawTrainingRadar(channel) {
  // Create canvas overlay on first call
  if (!channel.radarCanvas) {
    const overlay = document.createElement('canvas');
    overlay.width = 200;
    overlay.height = 200;
    overlay.style.position = 'absolute';
    overlay.style.top = '50px';
    overlay.style.right = '10px';
    channel.dom.trainViewport.appendChild(overlay);
    channel.radarCanvas = overlay;
  }
  
  // Draw 6-axis radar with current values
  // ... (lines 4990-5056)
}
```

### Node Placement

Uses existing `placeEntityOnGrid()` function:
```javascript
const entity = {
  row: emptyCell.row,
  col: emptyCell.col,
  type: stageName,        // SHED, INTEGRATE, or GROUND
  label: `${axisName}-${pairName}`,
  nodeData: nodeData      // Full training ground data
};

placeEntityOnGrid(channel, entity);
```

Node color determined by stage (lines 4895-4968).

### Command Parsing

```javascript
if (lowerText.startsWith('@shed') || 
    lowerText.startsWith('@integrate') || 
    lowerText.startsWith('@ground')) {
  
  const stageName = lowerText.split(' ')[0].substring(1).toUpperCase();
  // Extract axis name from remaining text
  // Extract inner/outer from remaining text
  // Find node data from TRAINING_GROUND.FLOW
  // Place on grid + update radar
}
```

## Next Steps

### Immediate Enhancements
- [ ] Click node on grid → show full operation details in chat
- [ ] Highlight radar axis when hovering over node
- [ ] Animate radar polygon transitions
- [ ] Add `/analyze` command to interpret radar shape

### Advanced Features
- [ ] Node relationships visualization (connect related nodes with lines)
- [ ] Temporal layers (T-1, T0, T+1 as different grid levels)
- [ ] Training path recording (sequence of nodes placed)
- [ ] Export psychographic profile as JSON
- [ ] Compare profiles between channels

### Observer Integration (from index 13.html)
- [ ] Track which operations performed most
- [ ] Detect patterns (e.g., avoiding certain axes)
- [ ] Suggest missing operations
- [ ] Generate narrative from node placement history

## Files

**Main**: `/Users/gaia/FUNC-SUB/func-orb-training.html`

**Open and test**:
1. Type `show radar` to see initial state
2. Type `@shed IDENTITY inner` to place first node
3. Watch radar update
4. Place more nodes across different axes
5. Type `show grid` to see all placed nodes
6. Watch psychographic profile emerge

**The training ground now lives inside func-orb's 3D grid.**
