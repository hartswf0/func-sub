# Func-Orb-Training.html Complete Audit

## Critical Issue: MISMATCH Between Controls and Training Ground Ontology

**The Problem**: We have orbital mechanics from func-orb.html that don't map to SHED/INTEGRATE/GROUND operations. The controls exist but serve the wrong metaphor.

---

## Current State (What Exists)

### Orbital System
- **5 orbital bodies**: Print Era, Radio Era, Television Era, Internet Era, AI Era
- **5 orbital rings**: Concentric circles at radii 10, 14, 18, 22, 26
- **Orbital motion**: Bodies rotate around center at different speeds
- **Metaphor**: Media evolution / technological eras

### Controls That Don't Map
1. **DRIFT slider** (orbital speed) → Not connected to training operations
2. **Add Moon button** → Adds satellite to orbital body (not polarity pairing)
3. **Reset button** → Resets orbital positions (not axis clearing)
4. **Physics toggle** → N-body gravity simulation (not recursion mode)
5. **Release button** → Launches entity into orbit (not grounding)
6. **D-pad** → Moves train/camera (not stage/axis navigation)
7. **A/B/X/Y buttons** → Game-like actions (not operation shortcuts)

### Chat System
- **Single channel** model (not three-panel INNER/OUTER/OBSERVER)
- **Generic message formatting** (not scene-aware)
- **Manual commands** only (no control panel integration)

### 3D Grid
- **9×9 grid cells** ✓ Good
- **Training nodes as entities** ✓ Good
- **3D radar hexagon** ✓ Good
- **But**: No connection to orbital system

---

## What We Need (Training Ground Integration)

### 1. Orbital Bodies → Axis Representation

**Current**: 5 orbital bodies = media eras  
**Should Be**: 6 orbital bodies = 6 training axes

```javascript
const TRAINING_ORBITALS = {
  IDENTITY: { 
    radius: 10, 
    color: 0xff5c7c,
    innerName: 'Instinct',
    outerName: 'Reason'
  },
  EXPERIENCE: { 
    radius: 14, 
    color: 0xff7c9c,
    innerName: 'Seen',
    outerName: 'Unseen'
  },
  LANGUAGE: { 
    radius: 18, 
    color: 0x569fff,
    innerName: 'Ideas',
    outerName: 'Ideology'
  },
  DOMAIN: { 
    radius: 22, 
    color: 0x76afff,
    innerName: 'Source',
    outerName: 'Resource'
  },
  PURPOSE: { 
    radius: 26, 
    color: 0x56ff9f,
    innerName: 'Heart',
    outerName: 'Head'
  },
  ORDER: { 
    radius: 30, 
    color: 0x76ffaf,
    innerName: 'Parts',
    outerName: 'Whole'
  }
};
```

**Visual**: Each axis is a ring. Two satellites on each ring (INNER + OUTER polarity).

### 2. Orbital Motion → Radar Scanning

**Current**: Bodies orbit randomly  
**Should Be**: Bodies "scan" the grid, detecting placed training nodes

```javascript
// Orbital body acts as radar scanner
function scanForEntities(orbitalBody, gridEntities) {
  const scanRadius = 5; // Detection range
  const nearbyNodes = gridEntities.filter(entity => {
    const dist = distance(orbitalBody.position, entity.position);
    return dist < scanRadius;
  });
  
  if (nearbyNodes.length > 0) {
    // Highlight orbital body (detected something)
    orbitalBody.material.emissive.setHex(0xff4d2e);
    
    // Report to observer
    addMessage(observerScene, 'system',
      `🛰️ ${orbitalBody.axis} scanner detected ${nearbyNodes.length} nodes`
    );
  }
}
```

**Visual Effect**: Orbital bodies "light up" when passing over training nodes on their axis.

### 3. DRIFT Control → Axis Intensity

**Current**: Controls orbital speed (meaningless)  
**Should Be**: Controls how much each placement affects that axis

```javascript
const DRIFT = getDriftValue(); // 0-36

// When placing node:
const axisIncrease = 0.15 * (DRIFT / 18); // Normalized to 1.0 at DRIFT=18

channel.trainingAxisValues[axisIndex] += axisIncrease;
```

**At DRIFT 0**: Minimal effect (blind operation)  
**At DRIFT 18**: Normal effect (balanced)  
**At DRIFT 36**: Maximum effect (hypersensitive)

### 4. Add Moon → Add Polarity Pair

**Current**: Adds random moon to orbital body  
**Should Be**: Places BOTH polarities of selected axis simultaneously

```javascript
function addPolarityPair(axis) {
  // Place INNER node
  placeNode('SHED', axis, 'INNER', innerScene);
  
  // Place OUTER node  
  placeNode('SHED', axis, 'OUTER', outerScene);
  
  // Observer comments on pairing
  addMessage(observerScene, 'system',
    `🌙 Polarity pair placed: ${axis} INNER + OUTER\n\n` +
    `Watch how the two satellites interact...`
  );
}
```

**Visual**: Two satellites appear on the axis ring (INNER + OUTER).

### 5. Reset → Clear Axis

**Current**: Resets all orbital positions  
**Should Be**: Clears all nodes on selected axis

```javascript
function clearAxis(axisName) {
  // Remove all nodes with this axis
  const entities = gridEntities.filter(e => e.axis !== axisName);
  
  // Reset axis value
  innerScene.trainingAxisValues[axisIndex] = 0.3;
  outerScene.trainingAxisValues[axisIndex] = 0.3;
  
  // Update radar
  update3DRadar();
  
  // Observer notes what was SHED
  addMessage(observerScene, 'system',
    `↻ ${axisName} axis cleared. All operations on this axis SHED.`
  );
}
```

### 6. Physics Toggle → Recursion Mode

**Current**: Enables N-body gravity  
**Should Be**: Places self-referential nodes

```javascript
let recursionMode = false;

function toggleRecursion() {
  recursionMode = !recursionMode;
  
  if (recursionMode) {
    // Every placement also places a node explaining itself
    addMessage(observerScene, 'system',
      `⚛️ RECURSION MODE: ON\n\n` +
      `Every operation will also place a node describing that operation.` +
      `The apparatus will reference itself.`
    );
  }
}

// When placing node in recursion mode:
if (recursionMode) {
  // Place actual node
  placeNode(stage, axis, pair, scene);
  
  // Also place meta-node
  placeNode('INTEGRATE', 'LANGUAGE', 'OUTER', observerScene);
  addMessage(observerScene, 'system',
    `🔄 Recursive placement: This ${stage} operation is itself an operation.`
  );
  
  observerState.recursionDepth++;
}
```

### 7. Release → Commit to GROUND

**Current**: Launches entity with physics  
**Should Be**: Takes current selection and GROUNDS it

```javascript
function commitToGround() {
  const currentAxis = state.currentAxis;
  const currentPair = state.currentPair;
  
  // Place GROUND operation
  placeNode('GROUND', currentAxis, currentPair, getCurrentScene());
  
  // Observer warns about groundlessness
  addMessage(observerScene, 'system',
    `🎯 COMMITTED TO GROUND\n\n` +
    `${currentAxis} • ${currentPair} has been "stabilized".\n\n` +
    `⚠️ But ground is itself groundless. This stability is temporary apparatus.`
  );
}
```

### 8. D-Pad → Stage/Axis Navigation

**Current**: Moves train/camera  
**Should Be**: Navigates training structure

```javascript
// ↑ - Cycle stage forward
function dpadUp() {
  const stages = ['SHED', 'INTEGRATE', 'GROUND'];
  const idx = stages.indexOf(state.currentStage);
  state.currentStage = stages[(idx + 1) % 3];
  
  updateStageIndicator();
  highlightStageOrbitals();
}

// ↓ - Cycle stage backward
function dpadDown() {
  const stages = ['SHED', 'INTEGRATE', 'GROUND'];
  const idx = stages.indexOf(state.currentStage);
  state.currentStage = stages[(idx - 1 + 3) % 3];
  
  updateStageIndicator();
}

// ← - Cycle axis backward
function dpadLeft() {
  const axes = TRAINING_GROUND.AXES;
  const idx = axes.indexOf(state.currentAxis);
  state.currentAxis = axes[(idx - 1 + 6) % 6];
  
  highlightAxisOrbital(state.currentAxis);
}

// → - Cycle axis forward
function dpadRight() {
  const axes = TRAINING_GROUND.AXES;
  const idx = axes.indexOf(state.currentAxis);
  state.currentAxis = axes[(idx + 1) % 6];
  
  highlightAxisOrbital(state.currentAxis);
}

// ○ - Quick place current selection
function dpadCenter() {
  placeNode(state.currentStage, state.currentAxis, state.currentPair, getCurrentScene());
}
```

### 9. A/B/X/Y → Operation Shortcuts

**Current**: Generic game buttons  
**Should Be**: Quick operations

```javascript
// B button (red) - SHED
function buttonB() {
  placeNode('SHED', state.currentAxis, togglePair(), getCurrentScene());
}

// A button (green) - INTEGRATE
function buttonA() {
  placeNode('INTEGRATE', state.currentAxis, togglePair(), getCurrentScene());
}

// X button (blue) - GROUND
function buttonX() {
  placeNode('GROUND', state.currentAxis, togglePair(), getCurrentScene());
}

// Y button (yellow) - Observer Query
function buttonY() {
  addMessage(observerScene, 'user', 'What do you see in the current configuration?');
  
  // Observer analyzes and responds
  const analysis = generateObserverAnalysis();
  addMessage(observerScene, 'system', analysis);
}

function togglePair() {
  state.currentPair = (state.currentPair === 'INNER') ? 'OUTER' : 'INNER';
  return state.currentPair;
}
```

---

## Radar Improvements Needed

### Show Last 3 Updates

**Current**: Single hexagon showing current state  
**Should Be**: 3 overlaid hexagons showing temporal progression

```javascript
// Store radar history
channel.radarHistory = [
  { timestamp: Date.now(), values: [...] },  // Current
  { timestamp: Date.now() - 5000, values: [...] },  // -1
  { timestamp: Date.now() - 10000, values: [...] }  // -2
];

// Draw 3 hexagons with different opacity
function update3DRadarWithHistory() {
  // T-2: Very transparent (oldest)
  drawRadarPolygon(channel.radarHistory[2].values, 0x666666, 0.1);
  
  // T-1: Medium transparent
  drawRadarPolygon(channel.radarHistory[1].values, 0x999999, 0.3);
  
  // T0: Full opacity (current)
  drawRadarPolygon(channel.radarHistory[0].values, 0xff4d2e, 0.8);
}
```

**Visual**: See how the hexagon shape changed over time.

### Orbital Scanner Lines

**Current**: Static rings  
**Should Be**: Rings pulse when scanning, lines shoot from center to detected nodes

```javascript
function createScannerEffect(orbitalBody, detectedNode) {
  // Create line from center to detected node
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    detectedNode.position
  ]);
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: orbitalBody.color,
    opacity: 0.8,
    transparent: true
  });
  
  const scanLine = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(scanLine);
  
  // Fade out after 1 second
  setTimeout(() => {
    scene.remove(scanLine);
  }, 1000);
}
```

**Visual**: Radar-like scanning lines shooting from center to entities.

---

## Three-Panel Chat Integration

### Current Layout
```
┌─────────────────────────────────┐
│      Single chat panel          │
│      (no scene distinction)     │
└─────────────────────────────────┘
```

### Needed Layout
```
┌──────────┬──────────┬──────────┐
│  INNER   │  OUTER   │ OBSERVER │
│  Chat    │  Chat    │  Chat    │
│          │          │          │
│ (subjec- │ (objec-  │ (meta-   │
│  tive)   │  tive)   │  view)   │
└──────────┴──────────┴──────────┘
```

### Implementation Needed

```javascript
// Create three chat panels
const innerChatPanel = createChatPanel('INNER');
const outerChatPanel = createChatPanel('OUTER');
const observerChatPanel = createChatPanel('OBSERVER');

// Route messages by scene
function addMessageToScene(sceneType, role, content) {
  const panel = {
    'POLARITY_INNER': innerChatPanel,
    'POLARITY_OUTER': outerChatPanel,
    'META_OBSERVER': observerChatPanel
  }[sceneType];
  
  appendMessage(panel, role, content);
}
```

---

## Entity Scanning by Orbitals

### Concept
Each orbital body represents an axis. As it orbits, it "scans" the grid looking for entities on its axis.

### Implementation

```javascript
function animate3D() {
  requestAnimationFrame(animate3D);
  
  appState.channels.forEach(channel => {
    if (!channel.trainCars) return;
    
    // Update orbital positions
    channel.trainCars.forEach((body, idx) => {
      const axis = TRAINING_GROUND.AXES[idx];
      const angle = Date.now() * body.orbitSpeed;
      
      body.group.position.x = Math.cos(angle) * body.orbitRadius;
      body.group.position.z = Math.sin(angle) * body.orbitRadius;
      
      // SCAN for entities on this axis
      const entities = appState.gridEntities.get(channel.id) || [];
      const axisEntities = entities.filter(e => e.axis === axis);
      
      axisEntities.forEach(entity => {
        const dist = body.group.position.distanceTo(entity.position);
        
        if (dist < 8) {  // Within scan range
          // Visual feedback
          entity.mesh.material.emissive.setHex(body.color);
          
          // Log detection
          console.log(`🛰️ ${axis} scanner detected ${entity.label}`);
          
          // Optional: Send to observer
          if (Math.random() < 0.01) {  // 1% chance per frame
            addMessageToScene('META_OBSERVER', 'system',
              `🛰️ ${axis} orbital detected: ${entity.label} (${entity.type})`
            );
          }
        }
      });
    });
    
    channel.renderer.render(channel.scene, channel.camera);
  });
}
```

---

## Critical Disconnects to Fix

### 1. Orbital Bodies ≠ Training Axes
- **Fix**: Change 5 media-era bodies to 6 axis bodies
- **Each body**: Represents one training axis
- **Satellites**: Represent INNER/OUTER polarities

### 2. Controls ≠ Operations
- **Fix**: Remap all buttons to training operations
- **DRIFT**: Axis intensity (not speed)
- **D-pad**: Stage/axis navigation (not camera)
- **A/B/X**: INTEGRATE/SHED/GROUND shortcuts

### 3. Chat ≠ Scenes
- **Fix**: Three-panel layout
- **INNER panel**: Only sees INNER operations
- **OUTER panel**: Only sees OUTER operations
- **OBSERVER panel**: Sees both + meta-commentary

### 4. Radar ≠ Temporal
- **Fix**: Show last 3 radar states
- **T-2**: Faded hexagon (oldest)
- **T-1**: Medium opacity
- **T0**: Full opacity (current)

### 5. Orbitals ≠ Scanners
- **Fix**: Make orbitals detect entities
- **Scan effect**: Lines shoot from center to detected nodes
- **Visual**: Orbital body lights up when detecting

---

## Implementation Priority

### Phase 1: Fix Critical Disconnects
1. ✅ Fix bug at line 4794
2. ⬜ Change 5 orbital bodies to 6 axis bodies
3. ⬜ Remap DRIFT to axis intensity
4. ⬜ Remap D-pad to stage/axis navigation
5. ⬜ Remap A/B/X to operation shortcuts

### Phase 2: Integrate Orbital Scanning
1. ⬜ Make orbitals detect entities on their axis
2. ⬜ Add scanner line visual effects
3. ⬜ Report detections to observer

### Phase 3: Three-Panel Chat
1. ⬜ Create three chat panels
2. ⬜ Route messages by scene type
3. ⬜ Show scene constraints visually

### Phase 4: Radar Improvements
1. ⬜ Store radar history (last 3 states)
2. ⬜ Draw 3 overlaid hexagons
3. ⬜ Show temporal progression

---

## The Deep Problem

**We grafted training ground ontology onto orbital mechanics without reconciling the metaphors.**

- Orbitals = media evolution (func-orb)
- Training = psychographic operations (tra.html)
- **These don't match**

**Solution**: Make orbitals REPRESENT axes, not eras. Make them SCAN, not just orbit. Make controls MAP to operations.

**The system should feel like**: "I'm navigating a training apparatus where orbital scanners detect my operations and the radar shows my psychographic profile evolving over time."

**Not**: "I'm playing with orbital physics while separately doing training operations."

---

## Your Fatigue is Valid

You can see the system ISN'T integrated. The controls don't match the concepts. The orbitals don't map to axes. The chat doesn't show scenes.

**I'll fix this.** You rest. I'll implement the proper mappings.
