# Implementation Plan: Radar Avatar System

## What You Need

Based on your request, here's what needs to happen:

### 1. **Replace Orbiting Spheres with Radar Scanning Lines**

**Remove** (around line 5700-5800):
```javascript
const orbitalBodies = [
  { name: 'SHED', size: 1.0, color: 0xff5c7c, radius: 12 },
  // ...
];

orbitalBodies.forEach((config, idx) => {
  const bodyGroup = createOrbitalBody(config.size, config.color, config.name);
  // ... positioning and animation
});
```

**Replace with**:
```javascript
// 6 radar scanning lines (one per axis)
const radarLines = [];

TRAINING_GROUND.AXES.forEach((axis, idx) => {
  const angle = (idx / 6) * Math.PI * 2;
  const color = [0xff5c7c, 0xff7c9c, 0x569fff, 0x76afff, 0x56ff9f, 0x76ffaf][idx];
  
  // Create line geometry
  const lineGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array([
    0, 0.1, 0,  // Start at center
    0, 0.1, 0   // End (will be updated)
  ]);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const lineMaterial = new THREE.LineBasicMaterial({
    color: color,
    linewidth: 3,
    transparent: true,
    opacity: 0.8
  });
  
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);
  
  radarLines.push({
    line: line,
    axis: axis,
    angle: angle,
    color: color,
    phase: idx * 0.5  // Stagger start times
  });
});

channel.radarLines = radarLines;
```

### 2. **Animate Radar Sweep in Animation Loop**

In `animate3D()` function, replace orbital body updates with:

```javascript
// Update radar scanning lines
if (channel.radarLines) {
  const time = Date.now() * 0.001;
  
  channel.radarLines.forEach(ray => {
    // Calculate sweep distance (0 to 45 over 3 seconds)
    const phase = (time + ray.phase) % 3;
    const distance = (phase / 3) * 45;
    
    // Update line endpoint
    const endX = Math.cos(ray.angle) * distance;
    const endZ = Math.sin(ray.angle) * distance;
    
    const positions = ray.line.geometry.attributes.position.array;
    positions[3] = endX;  // End X
    positions[5] = endZ;  // End Z
    ray.line.geometry.attributes.position.needsUpdate = true;
    
    // Pulse opacity based on distance
    ray.line.material.opacity = 0.3 + (distance / 45) * 0.5;
    
    // Detect entities in sweep
    detectEntitiesInSweep(channel, ray, distance);
  });
}
```

### 3. **Add Avatar System**

After grid creation:

```javascript
// Create avatar (player character)
function createAvatar(channel) {
  const geometry = new THREE.ConeGeometry(0.5, 1.5, 4);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff4d2e,
    emissive: 0xff4d2e,
    emissiveIntensity: 0.5,
    metalness: 0.3,
    roughness: 0.7
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = Math.PI; // Point upward
  
  // Start at center
  const centerPos = gridRowColToWorld(4, 4);
  mesh.position.set(centerPos.x, 1, centerPos.z);
  
  channel.scene.add(mesh);
  
  channel.avatar = {
    mesh: mesh,
    row: 4,
    col: 4,
    inventory: [],
    successfulNegotiations: 0,
    failedNegotiations: 0
  };
  
  return channel.avatar;
}

// Call after grid creation
createAvatar(channel);
```

### 4. **Arrow Key Controls**

Add global event listener:

```javascript
document.addEventListener('keydown', (e) => {
  const channel = appState.channels.get(appState.currentChannelId);
  if (!channel || !channel.avatar) return;
  
  const avatar = channel.avatar;
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
    case ' ':  // Spacebar
      e.preventDefault();
      interactWithEntity(channel);
      return;
  }
  
  if (newRow !== avatar.row || newCol !== avatar.col) {
    moveAvatar(channel, newRow, newCol);
  }
});

function moveAvatar(channel, newRow, newCol) {
  const avatar = channel.avatar;
  avatar.row = newRow;
  avatar.col = newCol;
  
  const pos = gridRowColToWorld(newRow, newCol);
  
  // Smooth movement animation
  avatar.mesh.position.x = pos.x;
  avatar.mesh.position.z = pos.z;
  
  addMessage(channel, 'system', `🚶 Moved to (${newRow}, ${newCol})`);
  
  // Check for nearby entities
  checkNearbyEntities(channel);
}
```

### 5. **Negotiation System**

```javascript
function interactWithEntity(channel) {
  const avatar = channel.avatar;
  const entities = appState.gridEntities.get(channel.id) || [];
  
  const nearbyEntity = entities.find(e => 
    e.row === avatar.row && e.col === avatar.col
  );
  
  if (!nearbyEntity) {
    addMessage(channel, 'system', '❌ No entity here. Move to an entity and press SPACE.');
    return;
  }
  
  // Start negotiation
  appState.negotiationMode = {
    active: true,
    entity: nearbyEntity,
    channel: channel
  };
  
  addMessage(channel, 'system',
    `🤝 **Negotiating with ${nearbyEntity.label}**\n\n` +
    `Type your approach to convince them.\n` +
    `The observer will evaluate your PLOT score.`
  );
}

// Modify sendMessageWithLEGOS to handle negotiation
if (appState.negotiationMode && appState.negotiationMode.active) {
  const result = evaluatePLOT(channel, userText, appState.negotiationMode.entity);
  
  // Show PLOT breakdown
  addMessage(window.observerScene, 'system',
    `⚖️ **PLOT EVALUATION**\n\n` +
    `Power: ${result.P}/100\n` +
    `Leverage: ${result.L}/100\n` +
    `Opening: ${result.O}/100\n` +
    `Timing: ${result.T}/100\n\n` +
    `**Total**: ${result.total}/100\n\n` +
    `${result.success ? '✅ SUCCESS' : '❌ FAILED'}`
  );
  
  handleNegotiationResult(channel, result);
  appState.negotiationMode.active = false;
  return;
}
```

### 6. **PLOT Calculation**

```javascript
function evaluatePLOT(channel, message, entity) {
  const avatar = channel.avatar;
  
  // P - Power (avatar's credibility)
  let P = 50;
  P += avatar.successfulNegotiations * 5;
  P -= avatar.failedNegotiations * 3;
  P = Math.min(100, Math.max(0, P));
  
  // L - Leverage (inventory matches entity needs)
  let L = 50;
  if (avatar.inventory.length > 0) L += 20;
  L = Math.min(100, Math.max(0, L));
  
  // O - Opening (message quality)
  let O = 50;
  const lower = message.toLowerCase();
  if (lower.includes('help') || lower.includes('together')) O += 15;
  if (lower.includes('please') || lower.includes('?')) O += 10;
  if (lower.includes('demand') || lower.includes('must')) O -= 20;
  O = Math.min(100, Math.max(0, O));
  
  // T - Timing (entity's current state)
  let T = 50;
  if (entity.type === 'Goal') T += 20;  // Goals more receptive
  if (entity.type === 'Obstacle') T -= 10;  // Obstacles less receptive
  T = Math.min(100, Math.max(0, T));
  
  const total = (P + L + O + T) / 4;
  
  return {
    P, L, O, T,
    total,
    success: total >= 60
  };
}
```

## What This Gives You

1. **Radar scanning lines** sweep outward from center (no more orbiting spheres)
2. **Lines detect entities** and flash them when scanned
3. **Avatar character** at center that you control with arrow keys
4. **Move around grid** with ↑←↓→
5. **Press SPACE** to interact with entities at your position
6. **Type negotiation message** to convince entity
7. **Observer calculates PLOT** score and decides outcome
8. **Success** → entity agrees, gives item, or follows you
9. **Failure** → entity refuses, moves away

## Files to Modify

1. **func-orb-training.html** - Main implementation
   - Lines ~5700-5800: Replace orbital bodies with radar lines
   - Lines ~5900-6000: Replace animation loop for radar sweep
   - Add avatar creation after grid
   - Add arrow key event listener
   - Add negotiation system in sendMessageWithLEGOS

## Ready to Implement?

I can start making these changes to func-orb-training.html now, or would you like to review this plan first?

The key insight: **You're turning the 3D grid into a negotiation game where YOU control an avatar that moves around and negotiates with entities, with the observer judging your PLOT score like in centaur box.**
