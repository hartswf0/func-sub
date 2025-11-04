# TRA Mobile Rails Integration Architecture

## Problem Statement
Create a mobile-first viewer combining:
- **tra.html** → Data structure & temporal flow (T-1, T0, T+1)
- **func-orb.html** → No-scroll swipe UI pattern
- **index (13).html** → Radar visualization & observer pattern

Based on reference image showing rail navigation with "III" buttons and small squares for scrolling.

## Architecture Components

### 1. Data Structure (from tra.html)
```
3 STAGES × 6 AXES × 2 PAIRS × 3 TIMES = 108 total nodes

STAGES:
- SHED (Purification)
- INTEGRATE (Synthesis)
- GROUND (Commitment)

AXES:
- IDENTITY (Instinct ↔ Reason)
- EXPERIENCE (Seen ↔ Unseen)
- LANGUAGE (Ideas ↔ Ideology)
- DOMAIN (Source ↔ Resource)
- PURPOSE (Heart ↔ Head)
- ORDER (Parts ↔ Whole)

TEMPORAL FLOW:
- T-1 PAST (SHED context)
- T0 PRESENT (INTEGRATE context)
- T+1 NEXT (GROUND context)
```

### 2. UI Layout (from reference image)

```
┌─────────────────────────────┐
│  TRAINING GROUNDS   [T-1 T0 T+1] │ ← Header
├──┬────────────────────────┬──┤
│||│                        │  │
│||│    SHED                │ I│
│||│    IDENTITY            │ D│ ← Right rail: Axis selectors
│||│                        │ E│
│|||│    [INNER card]        │ N│
│|||│    [OUTER card]        │ T│
│||│                        │ I│
│||│    ◎─────────────      │ T│
│||│    Radar Chart         │ Y│
└──┴────────────────────────┴──┘
 ↑                             ↑
Left rail                  Right rail
(stage selectors)          (axis selectors)
```

### 3. Navigation Pattern

**LEFT RAIL** - Stage Navigation:
- 3 "III" buttons stacked vertically
- Click to switch SHED → INTEGRATE → GROUND
- Active state highlights current stage

**RIGHT RAIL** - Axis Navigation:
- 6 axis buttons (vertical scrollable)
- Text written vertically
- Click to switch axis
- Shows current axis highlighted

**INNER/OUTER TOGGLE** - Pair Navigation:
- Small squares on left/right edges of content
- Left square = INNER
- Right square = OUTER
- Click to toggle between pairs
- Swipe left/right also toggles

**TEMPORAL CONTROL** - Time Navigation:
- Top header pills: [T-1 PAST] [T0 NOW] [T+1 NEXT]
- Click to switch temporal context
- Changes interpretation of all operations

### 4. Radar Integration (from index 13.html)

**Purpose**: Visualize current state across all 6 axes

**Rendering**:
```javascript
function drawRadar(state) {
  // 6-axis radar chart
  // Each axis shows "intensity" or "completion"
  // Current axis highlighted
  // Values derived from navigation state
}
```

**Values**:
- Current axis at 100%
- Adjacent axes at lower values
- Creates visual "attention map"

### 5. No-Scroll Mobile Pattern (from func-orb.html)

**Critical Requirements**:
- `overflow: hidden` on body
- Fixed height: `100dvh`
- `position: fixed` for main container
- Touch-optimized button sizes (44px minimum)
- Swipe gestures for pair navigation

**Gesture Handling**:
```javascript
let touchStartX = 0;
let touchEndX = 0;

function handleGesture() {
  if (touchEndX < touchStartX) selectPair('OUTER'); // Swipe left
  if (touchEndX > touchStartX) selectPair('INNER'); // Swipe right
}
```

## Data Flow

```
User Action → State Update → Re-render Components
     ↓
[Stage Button] → state.stage = 'SHED'
[Axis Button]  → state.axis = 'IDENTITY'
[Pair Toggle]  → state.pair = 'INNER'
[Time Pill]    → state.time = 'T0'
     ↓
renderNode()   → Updates content display
renderRadar()  → Updates radar chart
updateRails()  → Highlights active buttons
```

## Mobile Optimization

**Breakpoint**: < 640px

**Adaptations**:
- Reduce rail widths (44px → 36px)
- Shrink button sizes
- Compress padding
- Radar canvas 160px × 160px (vs 200px desktop)
- Stack time pills if needed

**Touch Targets**:
- Minimum 44px × 44px (Apple HIG)
- Adequate spacing between elements
- Visual feedback on tap (scale animation)

## Context Engineering (from index 13.html observer pattern)

**Observer Object**:
```javascript
const observer = {
  currentStage: state.stage,
  currentAxis: state.axis,
  currentPair: state.pair,
  temporalContext: state.time,
  axisValues: computeAxisValues(state),
  recentTransitions: [...],
  attentionMap: generateAttentionMap(state)
};
```

**Prompt Construction**:
When integrating with LLM:
```
CONTEXT:
Stage: ${observer.currentStage}
Axis: ${observer.currentAxis} (${state.pair})
Temporal: ${observer.temporalContext}

CURRENT OPERATION:
${FLOW[stage][axis][pair].text}

TARGET:
${FLOW[stage][axis][pair].target}

RADAR STATE:
${JSON.stringify(observer.axisValues)}
```

## Implementation Priorities

1. **Phase 1**: Core navigation (rails + content display)
2. **Phase 2**: Radar integration
3. **Phase 3**: Gesture system (swipes)
4. **Phase 4**: Temporal switching
5. **Phase 5**: Observer/context system
6. **Phase 6**: LLM integration

## File Structure

```
tra-mobile-rails.html (MAIN IMPLEMENTATION)
├── Inline CSS (mobile-first)
├── Data (FLOW object from tra.html)
├── State management
├── Render functions
├── Radar canvas logic
├── Touch/gesture handlers
└── Context engineering utils
```

## Key Differences from Existing Files

**vs tra.html**:
- Mobile-first (not desktop Bauhaus grid)
- No collapsible details
- Rail navigation instead of columns
- Single-node focus (not matrix view)

**vs func-orb.html**:
- Simpler data (not multi-channel AI simulation)
- No 3D Three.js viewport
- Focused prompt architecture viewer
- Radar instead of grid

**vs tra-mobile-nodes.html**:
- Rail UI (not tab-based modes)
- Swipe navigation (not list/grid toggle)
- Single-node deep dive (not 81-node overview)
- Temporal context switching

**vs index (13).html**:
- Standalone (not multi-agent dialogue)
- Training ground data (not ethical sandbox)
- Visual navigation (not conversational)
- Single radar (not dual self/observer)

## Success Criteria

✅ **Navigation**: All 108 nodes accessible via rails
✅ **No Scroll**: Entire interface fits in 100dvh
✅ **Touch**: Minimum 44px touch targets
✅ **Radar**: Real-time visualization of state
✅ **Temporal**: Clean switching between T-1/T0/T+1
✅ **Performance**: < 16ms render time (60fps)
✅ **Context**: Observer object ready for LLM integration
