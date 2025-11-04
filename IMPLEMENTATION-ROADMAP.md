# IMPLEMENTATION ROADMAP

## Build Order: Minimum Viable Orbit

We build in layers, testing each before adding the next.

---

## LAYER 1: Static Grid + Node Data (1 hour)

**Goal**: Display 9×9 grid with node data on hover.

### Files to create:
- `orbit-psycho-v1.html` (single file for now)

### What it does:
```javascript
// 1. Load complete_node_dataset.json
// 2. Render 9×9 grid (Three.js, existing orbit-graph code)
// 3. Map each cell → node data
// 4. Hover cell → show tooltip with node name, operations
```

### Success criteria:
- ✓ Grid renders with 81 cells
- ✓ Hover any cell → tooltip shows node data
- ✓ Known nodes (12) have brighter glow
- ✓ Synthetic nodes (69) dimmer
- ✓ Console logs: "Grid initialized with 81 nodes"

### Code sketch:
```javascript
// Load data
const nodeData = await fetch('complete_node_dataset.json').then(r => r.json());

// Initialize grid (existing orbit-graph code)
function initGrid(channel) {
  // ... existing grid creation ...
  
  // NEW: Map nodes to cells
  nodeData.known_nodes.forEach(node => {
    const [row, col] = node.coordinate;
    const cell = channel.gridCells[row * 9 + col];
    cell.nodeData = node;
    cell.material.emissiveIntensity = 0.3; // Brighter for known nodes
  });
  
  nodeData.synthetic_nodes.forEach(node => {
    const [row, col] = node.coordinate;
    const cell = channel.gridCells[row * 9 + col];
    cell.nodeData = node;
  });
}

// NEW: Show tooltip on hover (raycasting)
function onGridHover(intersects) {
  if (intersects.length > 0) {
    const cell = intersects[0].object;
    if (cell.nodeData) {
      showTooltip(cell.nodeData);
    }
  }
}
```

---

## LAYER 2: User Avatar + Orbital Motion (1 hour)

**Goal**: Golden sphere orbits at radius 15, traces path.

### What it adds:
```javascript
// 1. Create user avatar (golden sphere)
// 2. Set initial position: radius 15, angle 0
// 3. Animate orbit (increment angle each frame)
// 4. Draw trail behind avatar (line geometry)
```

### Success criteria:
- ✓ Avatar visible and orbiting smoothly
- ✓ Trail fades over time (last 100 positions)
- ✓ Console logs current position: "[row, col]"
- ✓ FPS stays above 30

### Code sketch:
```javascript
function createUserAvatar(channel) {
  const avatar = createOrbitalBody(1.2, 0xffaa00, 'user');
  avatar.orbitRadius = 15;
  avatar.orbitSpeed = 0.002; // Slow, controlled
  avatar.orbitAngle = 0;
  channel.userAvatar = avatar;
  channel.scene.add(avatar);
  
  // Trail geometry
  const trailGeometry = new THREE.BufferGeometry();
  const trailMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffaa00, 
    transparent: true, 
    opacity: 0.5 
  });
  const trail = new THREE.Line(trailGeometry, trailMaterial);
  channel.scene.add(trail);
  channel.avatarTrail = { geometry: trailGeometry, positions: [] };
}

function updateAvatar(channel) {
  const avatar = channel.userAvatar;
  avatar.orbitAngle += avatar.orbitSpeed;
  
  // Position on orbit
  const x = Math.cos(avatar.orbitAngle) * avatar.orbitRadius;
  const z = Math.sin(avatar.orbitAngle) * avatar.orbitRadius;
  avatar.group.position.set(x, 0.5, z);
  
  // Update trail
  const trail = channel.avatarTrail;
  trail.positions.push({ x, y: 0.5, z });
  if (trail.positions.length > 100) trail.positions.shift();
  
  const posArray = new Float32Array(trail.positions.flatMap(p => [p.x, p.y, p.z]));
  trail.geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
}
```

---

## LAYER 3: Operation Rings + Switching (1 hour)

**Goal**: Three visible rings, buttons to switch between them.

### What it adds:
```javascript
// 1. Draw three ring outlines (radius 10, 15, 20)
// 2. Color-code: green (ground), blue (integrate), red (shed)
// 3. UI buttons: [SHED] [INTEGRATE] [GROUND]
// 4. Click button → animate avatar to new radius
```

### Success criteria:
- ✓ Three rings visible on grid
- ✓ Click GROUND → avatar moves to radius 10 (smoothly, 1.5s)
- ✓ Click SHED → avatar moves to radius 20
- ✓ Current operation label updates in HUD
- ✓ Ring highlights when active

### Code sketch:
```javascript
const OPERATION_RINGS = {
  SHED: { radius: 20, color: 0xff5c7c, label: 'SHED LOOP' },
  INTEGRATE: { radius: 15, color: 0x569fff, label: 'INTEGRATE LOOP' },
  GROUND: { radius: 10, color: 0x56ff9f, label: 'GROUND LOOP' }
};

function drawRings(channel) {
  Object.values(OPERATION_RINGS).forEach(ring => {
    const curve = new THREE.EllipseCurve(0, 0, ring.radius, ring.radius, 0, 2 * Math.PI);
    const points = curve.getPoints(64);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, 0.1, p.y))
    );
    const material = new THREE.LineBasicMaterial({ 
      color: ring.color, 
      transparent: true, 
      opacity: 0.3 
    });
    const line = new THREE.Line(geometry, material);
    channel.scene.add(line);
    channel.operationRings = channel.operationRings || {};
    channel.operationRings[ring.label] = line;
  });
}

window.switchOperation = function(operation) {
  const channel = appState.channels.get(appState.currentChannelId);
  const newRadius = OPERATION_RINGS[operation].radius;
  
  // GSAP animation (if available, else manual lerp)
  if (typeof gsap !== 'undefined') {
    gsap.to(channel.userAvatar, {
      orbitRadius: newRadius,
      duration: 1.5,
      ease: 'power2.inOut'
    });
  } else {
    channel.userAvatar.targetRadius = newRadius;
  }
  
  channel.currentOperation = operation;
  addMessage(channel, 'system', `🔄 Switched to ${operation} LOOP`);
  renderMessages(channel);
};
```

---

## LAYER 4: Node Crossing Detection (1 hour)

**Goal**: When avatar crosses node, trigger event.

### What it adds:
```javascript
// 1. Track avatar's current grid cell each frame
// 2. Detect cell change (crossed boundary)
// 3. If cell has nodeData, trigger activateNode()
// 4. Cell pulses green briefly
// 5. Log to console: "Crossed: [node name]"
```

### Success criteria:
- ✓ Avatar crossing cell boundary detected
- ✓ Cell pulses when crossed
- ✓ Console logs node name
- ✓ No duplicate triggers (debounce 3s per node)

### Code sketch:
```javascript
function checkNodeCrossing(channel) {
  const avatar = channel.userAvatar;
  const worldPos = avatar.group.position;
  const {row, col} = worldToGrid(worldPos.x, worldPos.z);
  const cellIndex = row * 9 + col;
  
  // Check if cell changed
  if (channel.lastCellIndex === cellIndex) return;
  channel.lastCellIndex = cellIndex;
  
  const cell = channel.gridCells[cellIndex];
  if (!cell || !cell.nodeData) return;
  
  // Check if recently visited (debounce)
  const now = Date.now();
  if (cell.lastVisited && now - cell.lastVisited < 3000) return;
  cell.lastVisited = now;
  
  // Trigger node activation
  activateNode(channel, cell.nodeData);
  
  // Visual feedback
  cell.material.emissive.setHex(0x00ff00);
  cell.material.emissiveIntensity = 0.8;
  setTimeout(() => {
    cell.material.emissiveIntensity = 0;
  }, 500);
}

// Call in animation loop
function animate() {
  // ... existing animation code ...
  
  if (channel.userAvatar) {
    updateAvatar(channel);
    checkNodeCrossing(channel);
  }
  
  // ... rest of animation loop ...
}
```

---

## LAYER 5: Prompt Injection (1 hour)

**Goal**: Node crossing injects hidden system prompt.

### What it adds:
```javascript
// 1. activateNode() builds prompt from node data + operation
// 2. Injects as hidden system message
// 3. Shows user notification (not the prompt itself)
// 4. Updates observer with crossing event
```

### Success criteria:
- ✓ Hidden message appears in channel.messages with `hidden: true`
- ✓ User sees notification: "📍 Crossed: [node name]"
- ✓ Notification shows current operation
- ✓ Observer tracks crossing

### Code sketch:
```javascript
function activateNode(channel, node) {
  const operation = channel.currentOperation || 'INTEGRATE';
  const promptText = node[operation.toLowerCase()]; // "shedding", "integrating", "grounding"
  
  // Build full prompt
  const fullPrompt = `
PSYCHOGRAPHIC POSITION:
- Node: ${node.name}
- Coordinate: [${node.coordinate}]
- Distance from center: ${node.distance_from_center}
- Axis: ${node.axis || 'Synthetic'}
- Operation: ${operation}

INSTRUCTION:
${promptText}

Context: User is orbiting through psychographic space. Respond with awareness of their current position and operation.
  `;
  
  // Inject as hidden message
  channel.messages.push({
    role: 'system',
    content: fullPrompt,
    hidden: true,
    nodeId: `${node.coordinate[0]},${node.coordinate[1]}`,
    timestamp: Date.now()
  });
  
  // User-visible notification
  addMessage(channel, 'system', 
    `📍 **${node.name}**\n\n` +
    `${operation}: "${promptText.substring(0, 100)}..."`,
    false
  );
  
  renderMessages(channel);
  
  // Update observer
  const observer = appState.observers.get(channel.id) || createDefaultObserver();
  observer.recentActions.push({
    type: operation,
    node: { name: node.name, coordinate: node.coordinate },
    timestamp: Date.now()
  });
  
  // Keep only last 10 actions
  if (observer.recentActions.length > 10) {
    observer.recentActions.shift();
  }
  
  appState.observers.set(channel.id, observer);
  
  console.log(`🎯 Node activated: ${node.name} (${operation})`);
}
```

---

## LAYER 6: Context-Aware AI (2 hours)

**Goal**: AI sees psychographic context and responds accordingly.

### What it adds:
```javascript
// 1. Build context string from current position + operation + observer
// 2. Include recent node crossings in system prompt
// 3. AI responses acknowledge position
// 4. Parse JSON entities and place on grid
```

### Success criteria:
- ✓ User types message → AI sees position context
- ✓ AI response mentions node or operation
- ✓ Entities placed reflect current operation's theme
- ✓ Observer state included in context

### Code sketch:
```javascript
function buildPsychographicContext(channel) {
  const avatar = channel.userAvatar;
  const worldPos = avatar.group.position;
  const {row, col} = worldToGrid(worldPos.x, worldPos.z);
  const cell = channel.gridCells[row * 9 + col];
  const currentNode = cell?.nodeData;
  
  const observer = appState.observers.get(channel.id) || createDefaultObserver();
  const recentCrossings = observer.recentActions
    .filter(a => a.type === channel.currentOperation)
    .slice(-5);
  
  return `
PSYCHOGRAPHIC STATE:
- Current Node: ${currentNode?.name || 'Unknown'} at [${row},${col}]
- Axis: ${currentNode?.axis || 'Synthetic'} (${currentNode?.polarity || ''})
- Distance from center: ${currentNode?.distance_from_center || 'N/A'}
- Quadrant: ${currentNode?.quadrant || 'N/A'}

ACTIVE OPERATION: ${channel.currentOperation || 'INTEGRATE'}
- Ring Radius: ${OPERATION_RINGS[channel.currentOperation].radius}m
- Nodes crossed in this operation: ${recentCrossings.length}

RECENT CROSSINGS (last 5):
${recentCrossings.map(a => `- ${a.node.name} at ${a.node.coordinate}`).join('\n') || 'None'}

OBSERVER STATE:
- Total entities on grid: ${(appState.gridEntities.get(channel.id) || []).length}
- Recent actions: ${observer.recentActions.length}
- Narrative: ${observer.narrative || 'Exploring...'}
  `.trim();
}

async function sendPsychographicMessage(channel, userText) {
  if (!appState.apiKey) {
    addMessage(channel, 'system', '⚠️ No API key set');
    renderMessages(channel);
    return;
  }
  
  showLoadingAnimation(channel, true);
  
  const context = buildPsychographicContext(channel);
  
  // Get last 10 non-hidden messages for conversation history
  const conversationHistory = channel.messages
    .filter(m => !m.hidden)
    .slice(-10)
    .map(m => ({
      role: m.role,
      content: m.text || m.content
    }));
  
  const messages = [
    {
      role: 'system',
      content: `You are a psychographic navigator helping users traverse a 9×9 coordinate system while performing SHED/INTEGRATE/GROUND operations.

${context}

RESPONSE FORMAT:
1. Acknowledge the user's psychographic position naturally
2. Respond to their question/statement with awareness of current operation
3. Include JSON block with spatial entities that reflect the operation theme

EXAMPLE:
"You're at Creative Balance, in the INTEGRATE loop. Interesting—this position asks you to embrace imperfection while crafting...

\`\`\`json
{
  "entities": [
    {"type": "Solution", "row": 3, "col": 5, "label": "Messy first draft"},
    {"type": "Goal", "row": 4, "col": 5, "label": "Polished later"}
  ]
}
\`\`\`

The key is letting creation precede perfection."

ALWAYS include the JSON block with at least 1-2 entities.`
    },
    ...conversationHistory,
    { role: 'user', content: userText }
  ];
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${appState.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    const data = await response.json();
    const aiText = data.choices[0].message.content;
    
    // Parse and place entities (existing code)
    parseAndPlaceEntities(channel, aiText);
    
    showLoadingAnimation(channel, false);
    addMessage(channel, 'assistant', aiText);
    renderMessages(channel);
    
  } catch (error) {
    showLoadingAnimation(channel, false);
    addMessage(channel, 'system', `❌ Error: ${error.message}`);
    renderMessages(channel);
  }
}
```

---

## LAYER 7: UI Polish (1 hour)

**Goal**: Clean, legible interface.

### What it adds:
```javascript
// 1. HUD showing: current node name, operation, position
// 2. Operation switcher buttons (styled)
// 3. Axis color gradient overlays on grid
// 4. Profile panel (collapsible)
// 5. Settings menu
```

### Success criteria:
- ✓ HUD updates in real-time as avatar moves
- ✓ Buttons have hover states and active states
- ✓ Grid has subtle axis color tints
- ✓ Profile shows statistics
- ✓ Mobile-responsive (test on narrow viewport)

### UI Components:

**HUD (top-left overlay):**
```html
<div class="hud">
  <div class="hud-node">📍 <span id="hudNodeName">Creative Balance</span></div>
  <div class="hud-pos">[<span id="hudRow">3</span>,<span id="hudCol">5</span>]</div>
  <div class="hud-op">🔄 <span id="hudOperation">INTEGRATE</span></div>
  <div class="hud-axis">Axis: <span id="hudAxis">Identity · Inner</span></div>
</div>
```

**Operation Switcher (bottom-center):**
```html
<div class="operation-switcher">
  <button onclick="switchOperation('SHED')" 
          class="op-btn shed" 
          data-op="SHED">
    SHED
    <span class="op-radius">r=20</span>
  </button>
  <button onclick="switchOperation('INTEGRATE')" 
          class="op-btn integrate active" 
          data-op="INTEGRATE">
    INTEGRATE
    <span class="op-radius">r=15</span>
  </button>
  <button onclick="switchOperation('GROUND')" 
          class="op-btn ground" 
          data-op="GROUND">
    GROUND
    <span class="op-radius">r=10</span>
  </button>
</div>
```

---

## LAYER 8: Axis Visualization (1 hour)

**Goal**: Grid cells show axis colors, labels on edges.

### What it adds:
```javascript
// 1. Calculate nearest axis for each cell
// 2. Apply color tint (subtle overlay)
// 3. Draw axis labels on grid edges
// 4. Polarity gradient (inner→outer)
```

### Success criteria:
- ✓ Grid has visible color zones (6 axes)
- ✓ Edge labels: "IDENTITY", "EXPERIENCE", etc.
- ✓ Inner/outer polarity visible (gradient)
- ✓ Colors don't overpower node markers

### Code sketch:
```javascript
const AXIS_COLORS = {
  'Identity': { inner: 0xff6666, outer: 0xff99cc },
  'Experience': { inner: 0xff9944, outer: 0xffcc77 },
  'Language': { inner: 0xffdd44, outer: 0xddff88 },
  'Domain': { inner: 0x44dd44, outer: 0x88ffdd },
  'Purpose': { inner: 0x4444ff, outer: 0x8888ff },
  'Order': { inner: 0x9944ff, outer: 0xdd88ff }
};

function applyAxisColors(channel) {
  nodeDataset.known_nodes.forEach(node => {
    if (!node.axis) return;
    
    const [row, col] = node.coordinate;
    const cell = channel.gridCells[row * 9 + col];
    
    const colorScheme = AXIS_COLORS[node.axis];
    const color = node.polarity === 'Inner' 
      ? colorScheme.inner 
      : colorScheme.outer;
    
    // Subtle tint (20% mix with base color)
    const baseColor = cell.material.color.getHex();
    const mixedColor = lerpColor(baseColor, color, 0.2);
    cell.material.color.setHex(mixedColor);
  });
}

function lerpColor(color1, color2, t) {
  const c1 = new THREE.Color(color1);
  const c2 = new THREE.Color(color2);
  return c1.lerp(c2, t).getHex();
}
```

---

## LAYER 9: Observer Profile (1 hour)

**Goal**: Show user's orbital history and statistics.

### What it adds:
```javascript
// 1. Profile panel (overlay or sidebar)
// 2. Statistics: cycles, nodes crossed, operation breakdown
// 3. Most visited nodes list
// 4. Axis exploration percentage
// 5. Export profile as JSON
```

### Success criteria:
- ✓ Profile panel toggles open/closed
- ✓ Stats update in real-time
- ✓ Most visited nodes sorted correctly
- ✓ Export button downloads JSON

### Code sketch:
```javascript
function renderProfile(channel) {
  const observer = appState.observers.get(channel.id) || createDefaultObserver();
  const entities = appState.gridEntities.get(channel.id) || [];
  
  // Calculate statistics
  const totalCrossings = observer.recentActions.length;
  const operationCounts = {
    SHED: observer.recentActions.filter(a => a.type === 'SHED').length,
    INTEGRATE: observer.recentActions.filter(a => a.type === 'INTEGRATE').length,
    GROUND: observer.recentActions.filter(a => a.type === 'GROUND').length
  };
  
  // Most visited nodes
  const nodeCounts = {};
  observer.recentActions.forEach(a => {
    const key = `${a.node.coordinate[0]},${a.node.coordinate[1]}`;
    nodeCounts[key] = (nodeCounts[key] || 0) + 1;
  });
  const topNodes = Object.entries(nodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [row, col] = key.split(',').map(Number);
      const node = nodeDataset.known_nodes.find(n => 
        n.coordinate[0] === row && n.coordinate[1] === col
      );
      return { name: node?.name || `[${row},${col}]`, count };
    });
  
  // Render panel
  const panel = document.getElementById('profilePanel');
  panel.innerHTML = `
    <h2>Psychographic Profile</h2>
    
    <div class="profile-section">
      <h3>Orbit Statistics</h3>
      <p>Nodes crossed: <strong>${totalCrossings}</strong></p>
      <p>Entities placed: <strong>${entities.length}</strong></p>
      <p>Time in system: <strong>${formatTime(Date.now() - channel.startTime)}</strong></p>
    </div>
    
    <div class="profile-section">
      <h3>Operation Breakdown</h3>
      <div class="op-bar">
        <div class="op-segment shed" style="width: ${operationCounts.SHED / totalCrossings * 100}%">
          SHED ${operationCounts.SHED}
        </div>
        <div class="op-segment integrate" style="width: ${operationCounts.INTEGRATE / totalCrossings * 100}%">
          INTEGRATE ${operationCounts.INTEGRATE}
        </div>
        <div class="op-segment ground" style="width: ${operationCounts.GROUND / totalCrossings * 100}%">
          GROUND ${operationCounts.GROUND}
        </div>
      </div>
    </div>
    
    <div class="profile-section">
      <h3>Most Visited Nodes</h3>
      <ol>
        ${topNodes.map(n => `<li>${n.name} (${n.count} crossings)</li>`).join('')}
      </ol>
    </div>
    
    <button onclick="exportProfile()">📥 Export Profile</button>
  `;
}

function exportProfile() {
  const channel = appState.channels.get(appState.currentChannelId);
  const observer = appState.observers.get(channel.id);
  
  const profileData = {
    timestamp: Date.now(),
    duration: Date.now() - channel.startTime,
    operations: observer.recentActions,
    entities: appState.gridEntities.get(channel.id)
  };
  
  const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `psychographic-profile-${Date.now()}.json`;
  a.click();
}
```

---

## Testing Checklist

After each layer, verify:

- [ ] No console errors
- [ ] Frame rate stable (check DevTools Performance)
- [ ] Mobile viewport works (toggle device toolbar in Chrome)
- [ ] State persists (reload page, check localStorage)
- [ ] Observer updates correctly
- [ ] AI responses make sense
- [ ] No memory leaks (check DevTools Memory)

---

## Deployment

Once all layers work:

1. **Minify**: Combine into single HTML file (all CSS/JS inline)
2. **Test on mobile device**: Real phone, not just emulator
3. **Add to index**: Update index.html to link to new tool
4. **Document**: Write usage guide in README
5. **Share**: Post link + screenshot

---

## Total Estimated Time: 10 hours

- Layer 1-3: Foundation (3 hours)
- Layer 4-6: Core mechanics (4 hours)
- Layer 7-9: Polish (3 hours)

**First milestone** (Layer 1-4): Working orbit with node crossing detection → 4 hours → **BUILD THIS FIRST**

Ready to start Layer 1? 🚀
