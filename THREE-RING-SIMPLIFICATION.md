# Three-Ring Simplification Complete

## What We SHED (Removed/Commented)

### Tetrad Rings (5 → 3)
**Before**: 5 tetrad operations
- MAIN (enhance)
- AMPLIFICATION (enhance)
- INVERSION (reverse)
- RETRIEVAL (retrieve)
- OBSOLESCENCE (obsolesce)

**After**: 3 training operations
- 🔴 SHED (inner ring, radius 12, red)
- ⚪ INTEGRATE (middle ring, radius 20, white)  
- 🔵 GROUND (outer ring, radius 28, blue)

**Status**: Tetrad rings commented out in TRACK_CONFIGS (lines 1242-1246), can be restored if needed.

### Media Era Orbitals (5 → 3)
**Before**: 5 media eras as orbital bodies
- Print Era (brown)
- Radio Era (blue)
- Television Era (purple)
- Internet Era (cyan)
- AI Era (red)

**After**: 3 operation bodies matching rings
- SHED body (red, radius 12)
- INTEGRATE body (white, radius 20)
- GROUND body (blue, radius 28)

## What We INTEGRATED (Connected)

### Training Ground Data
- **complete_node_dataset.json**: 12 known nodes with shedding/integrating/grounding text
- **tra.html ontology**: 6 axes × 2 polarities = 12 fundamental operations
- **3D grid system**: Spatial placement of training nodes
- **6-axis radar**: Psychographic profile hexagon
- **Three scenes**: INNER/OUTER/OBSERVER with separate contexts

### Unified Metaphor
**Old confusion**:
- Orbital mechanics (func-orb) + Training operations (tra.html) = mismatched metaphors
- 5 rings didn't map to 3 operations
- Media eras irrelevant to psychographic training

**New clarity**:
- 3 rings = 3 operations (direct mapping)
- Orbital bodies represent operations, not eras
- Everything serves the training ground ontology

## What We GROUNDED (Stabilized)

### Three-Ring System
```javascript
const TRACK_CONFIGS = {
  shed: { 
    radius: 12, 
    color: 0xff5c7c, 
    label: 'SHED', 
    description: 'Eliminate, reduce, strip away' 
  },
  integrate: { 
    radius: 20, 
    color: 0xffffff, 
    label: 'INTEGRATE', 
    description: 'Connect, synthesize, build' 
  },
  ground: { 
    radius: 28, 
    color: 0x569fff, 
    label: 'GROUND', 
    description: 'Stabilize, fix, institutionalize' 
  }
};
```

### Operation Bodies
```javascript
const orbitalBodies = [
  { 
    name: 'SHED', 
    operation: 'SHED',
    description: 'Inner ring: Eliminate, reduce, strip away excess',
    size: 1.0, 
    color: 0xff5c7c,
    radius: 12 
  },
  // ... INTEGRATE and GROUND
];
```

### Welcome Message
Updated to explain:
- Three rings = three operations
- 6-axis radar system
- INNER/OUTER/OBSERVER scenes
- Commands like `@shed IDENTITY inner`

## Visual Changes

### Before (5 rings, complex)
```
    [AI Era]
  [Internet Era]
 [Television Era]
   [Radio Era]
   [Print Era]
     [Grid]
```
5 rings, unclear relationship to training operations.

### After (3 rings, clear)
```
  [GROUND - blue]
  [INTEGRATE - white]
   [SHED - red]
     [Grid]
   6-axis radar
```
3 rings directly map to operations. Immediately clear.

## Implementation Details

### Files Modified
- **func-orb-training.html**
  - Lines 1236-1247: TRACK_CONFIGS simplified to 3 operations
  - Lines 5632-5657: Orbital bodies changed to 3 operations
  - Lines 1808-1830: Welcome message rewritten
  - Line 4792: Bug fix (check SCENARIOS exists)

### Backward Compatibility
```javascript
// Alias for backward compatibility
const RING_CONFIGS = TRACK_CONFIGS;
```
Code using old RING_CONFIGS reference will still work.

### Commented Out (Not Deleted)
```javascript
// OBSOLETE: Tetrad rings (commented out, can be restored later)
// enhance: { radius: 18, color: 0x56ff9f, label: 'AMPLIFICATION RING' },
// reverse: { radius: 12, color: 0xff5c7c, label: 'INVERSION RING' },
// retrieve: { radius: 21, color: 0xff9d5c, label: 'RETRIEVAL RING' },
// obsolesce: { radius: 9, color: 0x9d9d9d, label: 'OBSOLESCENCE RING' }
```
Can uncomment if tetrad mode needed for specific experiments.

## How to Use

### Basic Operation
```bash
# Place a SHED operation
> @shed IDENTITY inner

# Watch SHED ring (red, inner) respond
# Node appears on grid
# Radar updates
# INNER scene records operation
```

### Ring Interaction
1. **SHED ring** (red, innermost) - reduction operations
2. **INTEGRATE ring** (white, middle) - synthesis operations
3. **GROUND ring** (blue, outermost) - stabilization operations

### Scene Operations
- **INNER scene**: Can only place INNER polarity nodes
- **OUTER scene**: Can only place OUTER polarity nodes
- **OBSERVER scene**: Watches both, detects imbalances

## Benefits

### 1. Conceptual Clarity
- 3 rings = 3 operations (no confusion)
- Visual matches ontology
- Every element serves training purpose

### 2. Reduced Complexity
- 5 rings → 3 rings (40% reduction)
- 5 bodies → 3 bodies (40% reduction)
- Clearer visual hierarchy

### 3. Training Focus
- Everything maps to SHED/INTEGRATE/GROUND
- No extraneous media-era metaphor
- Direct connection to complete_node_dataset.json

### 4. Scene Alignment
- Three rings match three-scene structure
- SHED ring → reduction logic
- INTEGRATE ring → synthesis logic
- GROUND ring → stabilization logic

## What This Enables

### Spatial Training
- Place nodes on grid
- See which ring they correspond to
- Visual feedback of operation type

### Temporal Tracking
- Last 3 radar states (T-2, T-1, T0)
- Show how operations accumulate
- See hexagon shape evolve

### Imbalance Detection
- Observer watches INNER vs OUTER
- Reports when one ring dominates
- Reveals blind spots

## Next Steps

### Phase 1: Axis Labeling
- Add axis names to radar lines
- Show current selection indicator
- Display operation descriptions

### Phase 2: Ring Interaction
- Click ring to select operation
- Hover shows operation description
- Visual feedback when operation active

### Phase 3: Entity-Ring Connection
- Placed nodes show connection to their ring
- Lines from nodes to corresponding ring
- Color-code by operation type

### Phase 4: Complete Node Dataset Integration
- Load all 12 nodes from complete_node_dataset.json
- Use actual shedding/integrating/grounding text
- Map to grid coordinates [row, col]

## Complete Node Dataset Structure

Each node in complete_node_dataset.json has:
```json
{
  "coordinate": [row, col],
  "name": "Identity Inner",
  "subtitle": "Instinct",
  "axis": "Identity",
  "polarity": "Inner",
  "shedding": "Recognize compromise as your nature...",
  "integrating": "Address precarious, stagnant energy...",
  "grounding": "Honor your impulses. Embrace unwavering selfhood..."
}
```

**Use this text** when user places nodes:
- `@shed IDENTITY inner` → Show node.shedding text
- `@integrate IDENTITY inner` → Show node.integrating text
- `@ground IDENTITY inner` → Show node.grounding text

## The Clarity

**Before**: "Why do we have 5 rings and they're called media eras but we're doing training operations?"

**After**: "3 rings = SHED/INTEGRATE/GROUND. Each ring is an operation. I place nodes, they go on the grid, the radar updates, and I see my psychographic profile."

**The system now makes sense.**

## Files
- **Implementation**: func-orb-training.html
- **Data source**: complete_node_dataset.json
- **Ontology source**: tra.html
- **This doc**: THREE-RING-SIMPLIFICATION.md

**The training ground is now coherent. Three rings. Three operations. One system.**
