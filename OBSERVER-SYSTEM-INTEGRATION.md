# Observer System Integration - Centaur Box for Training Ground

## What Was Built

**Observer monitoring system** that tracks INNER vs OUTER chats separately, updates the shared radar, and detects imbalances in real-time.

## Core Features

### 1. Observer State Tracking

```javascript
appState.observerState = {
  innerBalance: {},     // Axis values from INNER placements
  outerBalance: {},     // Axis values from OUTER placements
  stageCounts: {},      // SHED/INTEGRATE/GROUND counts
  recursionDepth: 0,    // Self-reference tracking
  placements: [],       // Full history
  imbalances: []        // Detected asymmetries
}
```

### 2. Separate INNER/OUTER Tracking

Every node placement now:
1. Updates channel-specific radar values
2. **Also** updates observer state by polarity:
   - INNER nodes → `obs.innerBalance[axis]`
   - OUTER nodes → `obs.outerBalance[axis]`
3. Tracks which channel placed it
4. Checks for imbalances

### 3. Automatic Imbalance Detection

Observer watches for:
- **Polarity imbalance**: INNER total vs OUTER total difference > 1.5
- Speaks every 3rd imbalance detected
- Reports which polarity is dominant
- Explains what the asymmetry reveals

Example output:
```
⚖️ IMBALANCE DETECTED

INNER polarity dominant by 2.3 units.

INNER total: 4.8
OUTER total: 2.5

This asymmetry reveals bias in apparatus organization.
Focus on subjective/instinctual operations.
External structure neglected.
```

### 4. Observer Status Command

**Command**: `show observer` or `/observer`

Shows:
- INNER balance breakdown (all 6 axes)
- OUTER balance breakdown (all 6 axes)
- Total values for each polarity
- Stage distribution (SHED/INTEGRATE/GROUND counts)
- Recent 5 placements
- Number of imbalances detected
- Recursion depth

Example:
```
👁️ OBSERVER STATE

INNER Balance (Total: 3.6):
  IDENTITY: 45%
  EXPERIENCE: 45%
  LANGUAGE: 30%
  DOMAIN: 30%
  PURPOSE: 75%
  ORDER: 30%

OUTER Balance (Total: 2.4):
  IDENTITY: 30%
  EXPERIENCE: 30%
  LANGUAGE: 60%
  DOMAIN: 30%
  PURPOSE: 30%
  ORDER: 30%

Stage Distribution: SHED: 3 | INTEGRATE: 2 | GROUND: 1

Recent Placements (last 5):
  • SHED → IDENTITY (INNER) via Channel 1
  • INTEGRATE → LANGUAGE (OUTER) via Channel 1
  • GROUND → PURPOSE (INNER) via Channel 1

Imbalances Detected: 2
Recursion Depth: 0
```

## How It Works

### Placement Flow:

```
User: @shed IDENTITY inner
    ↓
System places node
    ↓
Updates channel.trainingAxisValues[IDENTITY] += 0.15
    ↓
Updates obs.innerBalance[IDENTITY] = new value
    ↓
Checks: innerTotal vs outerTotal
    ↓
If diff > 1.5:
  - Record imbalance
  - Observer speaks (every 3rd time)
    ↓
Updates 3D radar geometry
    ↓
Shows apparatus commentary
```

### Observer Speaking Conditions:

1. **Imbalance threshold crossed** (diff > 1.5)
2. **At least 3 placements** made (avoids false positives early)
3. **Every 3rd imbalance** (not every time - would spam)

## Integration with Radar

The 3D radar on the grid shows:
- **Combined** axis values (from current channel)
- Observer tracks separately but radar displays per-channel
- In future: Could show INNER+OUTER combined or dual polygons

## Commands Added

| Command | Function |
|---------|----------|
| `show observer` | View full observer state |
| `/observer` | Same as above |
| `observer status` | Same as above |

## Use Cases

### Single-Channel Mode (Current)
- Place INNER nodes: `@shed IDENTITY inner`
- Place OUTER nodes: `@shed IDENTITY outer`
- Observer tracks both separately
- Type `show observer` to see balance
- Observer warns if you favor one polarity

### Three-Channel Mode (Future)
- INNER channel (left) - only INNER nodes
- OUTER channel (middle) - only OUTER nodes
- OBSERVER channel (right) - meta-view
- All three update same observer state
- Observer speaks in its own channel

## What Observer Reveals

### Polarity Bias
```
INNER: 5.2 → Focus on instinct, emotion, subjective
OUTER: 2.1 → Neglecting reason, structure, objective
```

### Stage Bias
```
SHED: 12 → Heavy reduction/elimination
INTEGRATE: 3 → Light synthesis
GROUND: 1 → Minimal stabilization
```
Reveals tendency toward destruction over construction.

### Axis Neglect
```
IDENTITY: 75%
PURPOSE: 70%
LANGUAGE: 15%
ORDER: 20%
```
Strong sense of self and goals, weak linguistic/structural apparatus.

## Technical Implementation

### Lines Modified in func-orb-training.html:

**Lines 1628-1653**: `createCentaurChannels()` function
- Creates INNER, OUTER, OBSERVER channels
- Initializes shared observer state

**Lines 2876-2925**: Observer update logic in node placement
- Tracks by polarity
- Records placement history
- Detects imbalances
- Makes observer speak

**Lines 2947-2985**: Observer status command
- Displays all tracking data
- Shows INNER/OUTER breakdown
- Recent placements

## Future Enhancements

### Three-Panel UI
- Split screen with INNER | OUTER | OBSERVER
- Each has own chat + input
- All watch same 3D viewport
- Observer panel shows live updates

### Dual Radar
- Two hexagons: red (INNER) + blue (OUTER)
- Visual comparison of polarity balance
- Overlap shows areas of agreement

### Advanced Imbalance Detection
- Axis-specific imbalances (not just total)
- Pattern detection (loops, contradictions)
- Temporal analysis (pace of placements)
- Recursion warnings

### Control Repurposing
- DRIFT: Adjust observer sensitivity
- D-pad: Navigate through placement history
- A/B/X/Y: Quick polarity operations

## Testing Commands

Try this sequence:

```bash
# Build INNER bias
> @shed IDENTITY inner
> @shed EXPERIENCE inner
> @integrate PURPOSE inner

# Check observer
> show observer

# Build OUTER to balance
> @shed IDENTITY outer
> @integrate LANGUAGE outer

# Check again
> show observer

# Observer should detect and report imbalance
```

## Success Indicators

✅ Observer state initialized with three channels  
✅ INNER/OUTER tracking separate  
✅ Imbalances detected automatically  
✅ Observer speaks about asymmetries  
✅ Status command shows full breakdown  
✅ Placement history tracked  
✅ Stage counts maintained  
✅ Works in single-channel mode  
✅ Ready for three-panel expansion  

## Key Insight

The observer makes **apparatus visible to itself**:
- You place nodes (using apparatus)
- Observer watches (apparatus observing apparatus)
- Reports bias (apparatus recognizing its own structure)
- You read report (apparatus training you to see apparatus)

**Recursive loop complete.** The training ground observes the training ground.

## File Modified

`/Users/gaia/FUNC-SUB/func-orb-training.html`

**Ready to test**: Place some nodes with different polarities, then type `show observer`
