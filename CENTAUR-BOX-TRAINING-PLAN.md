# Centaur Box Training Ground - Three-Panel Architecture

## Your Request (I hear you - you're tired, I'm strong, let's finish this)

Transform func-orb-training.html into three-panel chat system:
- **INNER chat** (left) - Polarity 1
- **OUTER chat** (middle) - Polarity 2
- **OBSERVER chat** (right) - Meta-layer watching INNER ↔ OUTER

Based on index (13).html's centaur box experiment pattern.

Repurpose all controls (DRIFT, Moon, Physics, D-pad, A/B/X/Y) for SHED/INTEGRATE/GROUND operations.

## New Layout Structure

```
┌────────────────────────────────────────────────┐
│           3D GRID VIEWPORT (full width)         │
│     [Radar hexagon on grid, orbital rings]      │
│               [Resizable ↕]                      │
├────────────────┬────────────────┬───────────────┤
│   INNER CHAT   │   OUTER CHAT   │ OBSERVER CHAT │
│   (polarity 1) │   (polarity 2) │  (meta-view)  │
│                │                │               │
│   Messages     │   Messages     │  Messages     │
│   about INNER  │   about OUTER  │  about both   │
│   operations   │   operations   │  + radar      │
│                │                │               │
│   [Input box]  │   [Input box]  │  [Input box]  │
└────────────────┴────────────────┴───────────────┘
│          CONTROL PANEL (full width)             │
│  [DRIFT ± ] [Buttons] [D-pad] [A/B/X/Y]        │
└────────────────────────────────────────────────┘
```

## Control Repurposing (This is the crucial part)

### DRIFT Controls (−/+)
**Before**: Orbital speed  
**After**: **Axis Intensity Adjuster**

```javascript
DRIFT value (0-36) controls:
- How much each node placement affects radar
- Speed of axis value changes
- Intensity of apparatus commentary

DRIFT 0  = Minimal effect (blind operation)
DRIFT 18 = Normal effect (balanced)
DRIFT 36 = Maximum effect (hypersensitive)
```

### Moon Button (🌙)
**Before**: Add moon to orbital body  
**After**: **Add Polarity Pair**

```javascript
Clicking "🌙" places BOTH polarities:
- @shed IDENTITY inner → INNER chat
- @shed IDENTITY outer → OUTER chat
- Simultaneously shows the polarity relationship
- Observer comments on the pairing
```

### Reset Button (↻)
**Before**: Reset orbits  
**After**: **Clear Current Axis**

```javascript
Clears all nodes on currently selected axis
Resets that axis value to 0.3 (baseline)
Observer announces what was SHED
```

### Physics Button (⚛️)
**Before**: Toggle N-body physics  
**After**: **Toggle Recursion Mode**

```javascript
OFF: Normal operation
ON:  Every node placement also places:
     - The operation describing itself
     - Example: @shed IDENTITY inner also places
       a node explaining "what SHED does to IDENTITY"
     - Creates recursive self-reference
     - Observer tracks recursion depth
```

### Release Button (🎯)
**Before**: Release entity into orbit  
**After**: **Commit to GROUND**

```javascript
Takes current selection and:
- Places GROUND version of that operation
- "Stabilizes" it on the grid
- Observer warns about groundlessness
- Shows what was "fixed" vs what remains fluid
```

## D-Pad Navigation (MAIN)

**Before**: Move train/camera  
**After**: **Navigate Training Ground Structure**

### ↑ (Up)
```javascript
Cycle STAGE: SHED → INTEGRATE → GROUND → SHED
Shows current stage in all three chats
Observer explains stage transition
```

### ↓ (Down)
```javascript
Cycle STAGE: GROUND → INTEGRATE → SHED → GROUND
(Reverse of Up)
```

### ← (Left)
```javascript
Cycle AXIS: ...← IDENTITY ← ORDER ← PURPOSE ← DOMAIN...
Shows current axis in all chats
Updates which axis is "selected" for operations
```

### → (Right)
```javascript
Cycle AXIS: IDENTITY → EXPERIENCE → LANGUAGE → DOMAIN → PURPOSE → ORDER →...
(Forward through axes)
```

### ○ (Center)
```javascript
Quick place: Current STAGE + Current AXIS + INNER/OUTER toggle
Asks: "Which polarity? (i)nner or (o)uter?"
Or auto-alternates between placements
```

## A/B/X/Y Buttons (Action Buttons)

### A Button (Primary - Green)
```javascript
Quick INTEGRATE operation
Places: @integrate [current_axis] [alternating polarity]
Sent to: INNER or OUTER chat (alternates)
Observer: Comments on synthesis
```

### B Button (Secondary - Red)
```javascript
Quick SHED operation
Places: @shed [current_axis] [alternating polarity]
Sent to: INNER or OUTER chat (alternates)
Observer: Comments on reduction/elimination
```

### X Button (Tertiary - Yellow)
```javascript
Quick GROUND operation
Places: @ground [current_axis] [alternating polarity]
Sent to: INNER or OUTER chat (alternates)
Observer: Warns about groundlessness
```

### Y Button (Special - Gray)
```javascript
Observer Query
Doesn't place anything
Sends message to OBSERVER chat:
"What do you see in the current configuration?"
Observer analyzes:
- Radar shape
- INNER vs OUTER balance
- Which axes are developed/neglected
- Suggests next operations
```

## Three-Chat Architecture

### INNER Chat (Left Panel)
**Purpose**: INNER polarity operations

**Messages include**:
- INNER node placements (Instinct, Seen, Ideas, Source, Heart, Parts)
- Apparatus commentary about inner operations
- Status: "INNER axis strong: IDENTITY 75%, PURPOSE 60%"

**Input**: 
- Manual: `@shed IDENTITY inner`
- Quick: Press B (SHED), A (INTEGRATE), or X (GROUND)

### OUTER Chat (Middle Panel)
**Purpose**: OUTER polarity operations

**Messages include**:
- OUTER node placements (Reason, Unseen, Ideology, Resource, Head, Whole)
- Apparatus commentary about outer operations
- Status: "OUTER axis strong: LANGUAGE 80%, ORDER 65%"

**Input**:
- Manual: `@shed LANGUAGE outer`
- Quick: Press B/A/X (alternates with INNER)

### OBSERVER Chat (Right Panel)
**Purpose**: Meta-observation of INNER ↔ OUTER dynamics

**Messages include**:
- "INNER favors reduction (SHED 60%), OUTER favors structure (GROUND 70%)"
- "Imbalance detected: INNER focus on IDENTITY, OUTER neglects it"
- "Radar shows hexagon leans toward PURPOSE/ORDER - instrumental bias"
- Apparatus consciousness commentary
- Recursion depth warnings
- Groundlessness alerts

**Input**:
- Press Y button: "What do you see?"
- Type: `/observe` or `analyze configuration`

## Observer System Logic

```javascript
// Observer tracks:
const observer = {
  innerBalance: {}, // Axis values from INNER placements
  outerBalance: {}, // Axis values from OUTER placements
  stageBias: {},    // Which stage (SHED/INTEGRATE/GROUND) dominant
  recursionDepth: 0, // How many self-referential operations
  placements: [],   // Full history of operations
  warnings: []      // Groundlessness/apparatus alerts
};

// Observer speaks when:
- Imbalance exceeds threshold (INNER > OUTER by 30%)
- Recursion depth increases
- All axes visited (completion illusion)
- Same operation repeated (loop detected)
- Contradictory operations (SHED then INTEGRATE same axis)
```

## Implementation Strategy (Step-by-step for strength)

### Phase 1: Layout Transformation
1. Keep 3D viewport at top (full width)
2. Add resize bar
3. Create 3-column grid below (1.1fr 1.1fr .9fr like index 13)
4. Each column has: messages div + input box
5. Add control panel footer

### Phase 2: Chat Routing
1. Modify `addMessage()` to accept target panel
2. Create `addMessageToPanel(panel, role, content)` 
3. Route based on operation type:
   - INNER → left panel
   - OUTER → middle panel
   - Observer → right panel

### Phase 3: Control Repurposing
1. DRIFT: Add event listeners, adjust axis multiplier
2. Buttons: Map to training operations
3. D-pad: Navigation through STAGE/AXIS
4. A/B/X/Y: Quick operations + observer query

### Phase 4: Observer Logic
1. Track INNER vs OUTER balance
2. Detect patterns (loops, biases, imbalances)
3. Generate commentary
4. Speak in OBSERVER chat when triggered

## Key Code Patterns

### Add message to specific panel:
```javascript
function addMessageToPanel(panel, role, content) {
  const panels = {
    INNER: document.getElementById('innerMessages'),
    OUTER: document.getElementById('outerMessages'),
    OBSERVER: document.getElementById('observerMessages')
  };
  
  const messageDiv = panels[panel];
  const msg = document.createElement('div');
  msg.className = `message ${role}`;
  msg.innerHTML = `
    <div class="message-role">${role.toUpperCase()}</div>
    <div class="message-content">${content}</div>
  `;
  messageDiv.appendChild(msg);
  messageDiv.scrollTop = messageDiv.scrollHeight;
}
```

### Route placement to panel:
```javascript
if (pairName === 'INNER') {
  addMessageToPanel('INNER', 'system', placementMessage);
} else {
  addMessageToPanel('OUTER', 'system', placementMessage);
}

// Observer always comments
if (shouldObserverSpeak()) {
  addMessageToPanel('OBSERVER', 'system', observerCommentary);
}
```

### Button handler:
```javascript
document.getElementById('btnShed').addEventListener('click', () => {
  const axis = state.currentAxis;
  const pair = state.currentPair; // Alternates INNER/OUTER
  
  executeOperation('SHED', axis, pair);
  state.currentPair = (pair === 'INNER') ? 'OUTER' : 'INNER'; // Toggle
  
  updateObserver();
});
```

## Why This Architecture Works

### Polarity Visibility
- INNER and OUTER no longer abstract concepts
- They have PHYSICAL SPACE (left vs middle panel)
- You SEE the imbalance in real-time

### Observer Consciousness
- Third-person view of first-person actions
- Makes apparatus visible while you use it
- Embodies the observer paradox

### Operational Clarity
- Controls map to concepts (DRIFT = intensity, A/B/X = operations)
- No generic "add entity" - every action has meaning
- Buttons become training tools, not generic controls

### Groundlessness Performance
- Three perspectives simultaneously (inner/outer/observer)
- No single "correct" view
- Constant commentary on what's being excluded
- Physical manifestation of theoretical impossibility

## Success Criteria

✅ Three chats visible and functional  
✅ Controls repurposed for training operations  
✅ Observer speaks about INNER/OUTER dynamics  
✅ Radar updates from all three chats  
✅ D-pad navigates STAGE and AXIS  
✅ A/B/X/Y buttons work for quick operations  
✅ DRIFT adjusts intensity  
✅ Recursion mode creates self-reference  
✅ Visual indication of current STAGE/AXIS  
✅ Apparatus consciousness maintained

## File to Modify

`/Users/gaia/FUNC-SUB/func-orb-centaur.html`

This will be the complete integration you need. I'm ready to implement it. You rest - I'll handle the hard part.
