# Radar Avatar System - Design Document

## Core Concept

**User controls an avatar** that moves on the 9x9 grid. **Radar lines sweep outward** from center detecting entities. **Avatar negotiates** with entities. **Observer decides** outcomes based on PLOT score.

## Visual System

### Remove Orbiting Bodies
- ❌ Delete: Spherical orbital bodies rotating in circles
- ✅ Replace with: Scanning lines radiating from center

### Radar Scanning Lines
```javascript
// 6 rays (one per axis) sweeping outward from center
const RADAR_RAYS = [
  { axis: 'IDENTITY', angle: 0, color: 0xff5c7c },
  { axis: 'EXPERIENCE', angle: 60, color: 0xff7c9c },
  { axis: 'LANGUAGE', angle: 120, color: 0x569fff },
  { axis: 'DOMAIN', angle: 180, color: 0x76afff },
  { axis: 'PURPOSE', angle: 240, color: 0x56ff9f },
  { axis: 'ORDER', angle: 300, color: 0x76ffaf }
];

// Each ray sweeps outward
function updateRadarScan() {
  const time = Date.now() * 0.001;
  
  RADAR_RAYS.forEach((ray, idx) => {
    const phase = (time + idx * 0.5) % 3; // 3 second cycle per ray
    const distance = phase * 15; // Sweep from 0 to 45 units
    
    // Draw line from center outward
    const endX = Math.cos(ray.angle * Math.PI / 180) * distance;
    const endZ = Math.sin(ray.angle * Math.PI / 180) * distance;
    
    updateRayLine(ray, 0, 0, endX, endZ);
    
    // Detect entities in sweep path
    detectEntitiesInSweep(ray, distance);
  });
}
```

**Visual**: 6 colored lines radiating from center, sweeping outward like radar, then resetting.

### Sweep Detection
```javascript
function detectEntitiesInSweep(ray, distance) {
  const entities = gridEntities.filter(entity => {
    // Check if entity is in ray's path
    const entityAngle = Math.atan2(entity.z, entity.x) * 180 / Math.PI;
    const angleDiff = Math.abs(entityAngle - ray.angle);
    
    const entityDist = Math.sqrt(entity.x * entity.x + entity.z * entity.z);
    
    // Entity is hit if within 30° of ray and at current distance
    return angleDiff < 30 && Math.abs(entityDist - distance) < 2;
  });
  
  entities.forEach(entity => {
    // Flash entity when detected
    entity.mesh.material.emissive.setHex(ray.color);
    
    // Log detection to observer
    if (!entity.detectedThisFrame) {
      addMessage(observerScene, 'system',
        `🛰️ ${ray.axis} scanner detected: ${entity.label} at (${entity.row},${entity.col})`
      );
      entity.detectedThisFrame = true;
    }
  });
}
```

## Avatar System

### Avatar Object
```javascript
const avatar = {
  row: 4,  // Center of grid
  col: 4,
  mesh: null,  // 3D representation
  inventory: [],
  negotiationAttempts: 0,
  successfulNegotiations: 0,
  failedNegotiations: 0
};

function createAvatar() {
  const geometry = new THREE.ConeGeometry(0.5, 1.5, 4);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff4d2e,
    emissive: 0xff4d2e,
    emissiveIntensity: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI; // Point upward
  
  // Position at center cell
  const pos = gridRowColToWorld(4, 4);
  mesh.position.set(pos.x, 1, pos.z);
  
  scene.add(mesh);
  avatar.mesh = mesh;
}
```

### Arrow Key Controls
```javascript
document.addEventListener('keydown', (e) => {
  if (!avatar.mesh) return;
  
  let newRow = avatar.row;
  let newCol = avatar.col;
  
  switch(e.key) {
    case 'ArrowUp':
      newRow = Math.max(0, avatar.row - 1);
      break;
    case 'ArrowDown':
      newRow = Math.min(8, avatar.row + 1);
      break;
    case 'ArrowLeft':
      newCol = Math.max(0, avatar.col - 1);
      break;
    case 'ArrowRight':
      newCol = Math.min(8, avatar.col + 1);
      break;
    case ' ':  // Spacebar to interact
      interactWithNearbyEntity();
      return;
  }
  
  if (newRow !== avatar.row || newCol !== avatar.col) {
    moveAvatar(newRow, newCol);
  }
});

function moveAvatar(newRow, newCol) {
  avatar.row = newRow;
  avatar.col = newCol;
  
  const pos = gridRowColToWorld(newRow, newCol);
  
  // Animate movement
  gsap.to(avatar.mesh.position, {
    x: pos.x,
    z: pos.z,
    duration: 0.2,
    ease: 'power2.out'
  });
  
  // Check for entities at new position
  checkForInteraction();
  
  addMessage(firstChannel, 'system',
    `🚶 Moved to (${newRow}, ${newCol})`
  );
}
```

### Entity Interaction
```javascript
function checkForInteraction() {
  const entities = appState.gridEntities.get(channel.id) || [];
  const nearbyEntity = entities.find(e => 
    e.row === avatar.row && e.col === avatar.col
  );
  
  if (nearbyEntity) {
    addMessage(firstChannel, 'system',
      `📍 You are at: ${nearbyEntity.label}\n\nPress SPACE to interact`
    );
    highlightEntity(nearbyEntity);
  }
}

function interactWithNearbyEntity() {
  const entities = appState.gridEntities.get(channel.id) || [];
  const entity = entities.find(e => 
    e.row === avatar.row && e.col === avatar.col
  );
  
  if (!entity) {
    addMessage(firstChannel, 'system', '❌ Nothing here to interact with');
    return;
  }
  
  // Open negotiation dialogue
  startNegotiation(entity);
}
```

## Negotiation System

### Initiate Negotiation
```javascript
function startNegotiation(entity) {
  addMessage(firstChannel, 'user',
    `🤝 Attempting to negotiate with ${entity.label}...`
  );
  
  // Show entity's stance
  const stance = entity.stance || generateStance(entity);
  
  addMessage(firstChannel, 'system',
    `**${entity.label}** says:\n"${stance.opening}"\n\n` +
    `They seem: ${stance.mood}\n` +
    `Type your negotiation approach:`
  );
  
  // Set state waiting for user response
  appState.negotiationMode = {
    active: true,
    entity: entity,
    stance: stance,
    attempts: 0
  };
}
```

### User Makes Offer
```javascript
// In sendMessageWithLEGOS, check if in negotiation mode
if (appState.negotiationMode && appState.negotiationMode.active) {
  const result = evaluateNegotiation(
    userText, 
    appState.negotiationMode.entity,
    appState.negotiationMode.stance
  );
  
  // Observer decides outcome
  const observerDecision = observerEvaluateNegotiation(result);
  
  return handleNegotiationResult(observerDecision);
}
```

### Observer Evaluation (PLOT Score)
```javascript
function observerEvaluateNegotiation(attempt) {
  // Calculate PLOT score components
  const scores = {
    // From centaur box system
    P: calculatePowerDynamic(avatar, attempt.entity),      // 0-100
    L: calculateLeveragePosition(avatar, attempt.entity),  // 0-100
    O: calculateOpeningRhetorical(attempt.message),        // 0-100
    T: calculateTimingContext(attempt.entity)              // 0-100
  };
  
  const totalPLOT = (scores.P + scores.L + scores.O + scores.T) / 4;
  
  // Observer explains scoring
  addMessage(observerScene, 'system',
    `⚖️ **NEGOTIATION EVALUATION**\n\n` +
    `**Power** (P): ${scores.P}/100 - ${getPowerExplanation(scores.P)}\n` +
    `**Leverage** (L): ${scores.L}/100 - ${getLeverageExplanation(scores.L)}\n` +
    `**Opening** (O): ${scores.O}/100 - ${getOpeningExplanation(scores.O)}\n` +
    `**Timing** (T): ${scores.T}/100 - ${getTimingExplanation(scores.T)}\n\n` +
    `**Total PLOT Score**: ${totalPLOT.toFixed(1)}/100\n\n` +
    `${totalPLOT >= 60 ? '✅ Negotiation SUCCEEDS' : '❌ Negotiation FAILS'}`
  );
  
  return {
    success: totalPLOT >= 60,
    scores: scores,
    total: totalPLOT
  };
}

function calculatePowerDynamic(avatar, entity) {
  // Based on avatar's previous successes, inventory, position
  let power = 50;
  
  // More successes = more credibility
  power += avatar.successfulNegotiations * 5;
  power -= avatar.failedNegotiations * 3;
  
  // Inventory items give leverage
  power += avatar.inventory.length * 10;
  
  // Being on their cell (visiting them) shows respect
  if (avatar.row === entity.row && avatar.col === entity.col) {
    power += 10;
  }
  
  return Math.min(100, Math.max(0, power));
}

function calculateLeveragePosition(avatar, entity) {
  // Based on what entity wants vs what avatar can offer
  let leverage = 50;
  
  // Check if avatar has items entity needs
  const entityNeeds = entity.needs || [];
  const matches = avatar.inventory.filter(item => 
    entityNeeds.includes(item.type)
  );
  
  leverage += matches.length * 20;
  
  // Check grid position advantages
  if (isStrategicPosition(avatar.row, avatar.col)) {
    leverage += 15;
  }
  
  return Math.min(100, Math.max(0, leverage));
}

function calculateOpeningRhetorical(message) {
  // Analyze user's negotiation text
  let opening = 50;
  
  const lowerMsg = message.toLowerCase();
  
  // Positive words
  if (lowerMsg.includes('help') || lowerMsg.includes('together')) opening += 15;
  if (lowerMsg.includes('benefit') || lowerMsg.includes('both')) opening += 10;
  
  // Negative words
  if (lowerMsg.includes('demand') || lowerMsg.includes('must')) opening -= 20;
  if (lowerMsg.includes('or else') || lowerMsg.includes('threat')) opening -= 30;
  
  // Length (too short or too long)
  if (message.length < 10) opening -= 10;
  if (message.length > 200) opening -= 5;
  
  // Questions show engagement
  if (message.includes('?')) opening += 10;
  
  return Math.min(100, Math.max(0, opening));
}

function calculateTimingContext(entity) {
  // Based on game state, entity's current mood, recent events
  let timing = 50;
  
  // Entity's current needs
  if (entity.urgent) timing += 20;
  if (entity.satisfied) timing -= 20;
  
  // Recent interactions
  if (entity.lastInteraction && Date.now() - entity.lastInteraction < 30000) {
    timing -= 15; // Too soon
  }
  
  // Grid position timing (are they near goal?)
  const distanceToGoal = calculateDistanceToGoal(entity);
  if (distanceToGoal < 3) timing += 15; // Close to goal, more motivated
  
  return Math.min(100, Math.max(0, timing));
}
```

### Handle Result
```javascript
function handleNegotiationResult(decision) {
  const entity = appState.negotiationMode.entity;
  
  if (decision.success) {
    // Success - entity agrees
    addMessage(firstChannel, 'system',
      `✅ **${entity.label} AGREES!**\n\n` +
      `"${generateAgreementResponse(entity)}"\n\n` +
      `${entity.label} ${getSuccessAction(entity)}`
    );
    
    avatar.successfulNegotiations++;
    
    // Entity performs action
    performEntityAction(entity, 'agree');
    
  } else {
    // Failure - entity refuses
    addMessage(firstChannel, 'system',
      `❌ **${entity.label} REFUSES**\n\n` +
      `"${generateRefusalResponse(entity)}"\n\n` +
      `PLOT score too low. Try improving your approach.`
    );
    
    avatar.failedNegotiations++;
    
    // Entity might become hostile or leave
    performEntityAction(entity, 'refuse');
  }
  
  // Clear negotiation mode
  appState.negotiationMode = { active: false };
}

function performEntityAction(entity, type) {
  if (type === 'agree') {
    // Entity moves toward avatar or gives item
    if (entity.hasItem) {
      avatar.inventory.push(entity.item);
      removeEntityFromGrid(channel, entity);
      addMessage(observerScene, 'system',
        `📦 ${entity.label} gave avatar: ${entity.item.name}`
      );
    } else if (entity.canMove) {
      // Entity follows avatar
      entity.following = true;
      addMessage(observerScene, 'system',
        `🚶 ${entity.label} now following avatar`
      );
    }
  } else {
    // Entity refuses - might move away or become obstacle
    if (entity.canMove) {
      moveEntityAway(entity, avatar);
      addMessage(observerScene, 'system',
        `🚶 ${entity.label} moved away from avatar`
      );
    }
  }
}
```

## UI Display

### PLOT Score Display
```html
<div class="plot-display">
  <h3>Observer PLOT Score</h3>
  <div class="plot-bars">
    <div class="plot-bar">
      <span>Power (P)</span>
      <div class="bar"><div class="fill" style="width: 65%"></div></div>
      <span>65</span>
    </div>
    <!-- Similar for L, O, T -->
  </div>
  <div class="plot-total">
    Total: <strong>72/100</strong>
    <span class="status success">✅ SUCCESS</span>
  </div>
</div>
```

### Avatar Status
```html
<div class="avatar-status">
  <h3>Avatar</h3>
  <div>Position: (4, 4)</div>
  <div>Inventory: 3 items</div>
  <div>Negotiations: 5 / 2 (W/L)</div>
  <div>Following: 2 entities</div>
</div>
```

## Implementation Priority

### Phase 1: Remove Orbitals, Add Radar Lines
1. Delete orbital body creation code
2. Create 6 radar line geometries
3. Animate lines sweeping outward
4. Implement detection logic

### Phase 2: Avatar System
1. Create avatar cone mesh at center
2. Bind arrow key controls
3. Implement grid movement
4. Add interaction detection

### Phase 3: Negotiation
1. Create negotiation state machine
2. Implement PLOT scoring
3. Observer evaluation display
4. Success/failure actions

### Phase 4: Polish
1. Visual feedback (entity highlights, scan effects)
2. Sound effects
3. Particle effects
4. Score history tracking

## Key Differences from Centaur Box

**Centaur Box PLOT (ally vs keeper)**:
- P = Power balance between two AI agents
- L = Leverage (what each can offer)
- O = Opening move quality
- T = Timing in turn sequence

**Our System PLOT (avatar vs entity)**:
- P = Avatar's accumulated credibility + position
- L = Avatar's inventory vs entity's needs
- O = User's negotiation message rhetoric
- T = Entity's current state + urgency

**Same concept, adapted to avatar-entity interaction instead of AI-AI negotiation.**
