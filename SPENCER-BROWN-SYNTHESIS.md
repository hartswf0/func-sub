# SPENCER-BROWN OLOG: Orbital Psychographic Grid Synthesis

**Objective**: Transform orbit-graph (1).html + complete_node_dataset.json → unified training ground with orbital operators mapped to psychographic coordinates and SHED/INTEGRATE/GROUND loops visualized as circular motion.

---

## I. FOUNDATIONAL DISTINCTIONS ◻

### ◻ SPACE vs TIME

**orbit-graph (1).html**:
- **Spatial**: 9×9 grid (81 cells), 3D coordinates (x, y, z)
- **Temporal**: Orbital progress (0-1), collision events, train advancement
- **Motion**: Circular paths around center (radius-based rings)

**complete_node_dataset.json**:
- **Spatial**: [row, col] coordinates (1-9, 1-9), distance_from_center
- **Semantic**: Named positions ("Identity Inner", "Creative Balance")
- **Strata**: 3 operational layers (shedding/integrating/grounding)

**index.html**:
- **Hierarchical**: 3 columns (SHED/INTEGRATE/GROUND) × 6 rows (axes)
- **Static**: No motion, no interactivity beyond collapse
- **Display**: Pure information architecture

**→ SYNTHESIS**: Grid cells ≡ Psychographic nodes. Orbital bodies traverse psychographic territories.

---

### ◻ OPERATOR vs OPERAND

**orbit-graph**:
- **OPERATORS**: McLuhan tetrad (enhance/reverse/retrieve/obsolesce), collision responses, camera modes
- **OPERANDS**: Entities on grid (Entity, Obstacle, Solution, Goal, Location)
- **CONTROL**: D-pad switches interpretive frames (same entities, different verbs)

**complete_node_dataset**:
- **OPERATORS**: Shedding/Integrating/Grounding (transformations)
- **OPERANDS**: Psychographic states at coordinates (nodes)
- **AXES**: 6 dimensions (Identity/Experience/Language/Domain/Purpose/Order)

**→ SYNTHESIS**: 
- **SHED LOOP** → outer orbit (radius 20) → "obsolesce" track
- **INTEGRATE LOOP** → middle orbit (radius 15) → "main" track  
- **GROUND LOOP** → inner orbit (radius 10) → "retrieve" track

---

### ◻ OBSERVER vs SCENE

**orbit-graph**:
- **Observer**: `appState.observers` Map tracking scene state
- **Scene**: `channel.scene` (Three.js), `channel.gridCells[]` (3D meshes)
- **Awareness**: Full entity list + recent actions + surrounding cells (8 directions)

**complete_node_dataset**:
- **Observer**: User reading the coordinate
- **Scene**: The psychographic field (81 nodes)
- **Awareness**: Distance from center, nearest node, quadrant

**→ SYNTHESIS**: Observer position = orbital body position. As body orbits, it "reads" nodes beneath it, triggering their shedding/integrating/grounding prompts.

---

### ◻ CHANNEL vs PROFILE

**orbit-graph**:
- **Channel**: Conversation thread with own 3D scene, entities, message history
- **Multi-channel**: Horizontal scroll, fork at junctions, lineage tracking
- **State**: `channel.currentTrack`, `channel.trainProgress`, `channel.entities[]`

**complete_node_dataset**:
- **Profile**: Single user's coordinate position + operational instructions
- **Node**: `{coordinate, name, shedding, integrating, grounding}`
- **Static**: No multi-user, no state changes

**→ SYNTHESIS**: Each channel = user profile. User's current position on grid = active node. Orbital motion = moving through psychographic space over time.

---

## II. ENTITIES (Objects in Olog)

### E1: **Grid Cell**
- **orbit-graph**: `channel.gridCells[index]` (Three.js Mesh, 5m×5m)
- **complete_node**: `{coordinate: [row, col], name, ...}`
- **Morphism**: `gridToWorld(row, col) → {x, z}` (transforms [row,col] to 3D)

### E2: **Orbital Body**
- **orbit-graph**: `channel.trainCars[]` (Print/Radio/TV/Internet/AI spheres)
- **New**: User avatar as orbital body
- **Attributes**: `{orbitRadius, orbitSpeed, mass, position, velocity}`

### E3: **Psychographic Node**
- **complete_node**: Known nodes (12) + synthetic nodes (69)
- **Operations**: `{shedding, integrating, grounding}` (text prompts)
- **Axes**: `{axis: "Identity", polarity: "Inner"}` → "Instinct"

### E4: **Operational Loop**
- **index.html**: SHED/INTEGRATE/GROUND columns
- **Mapping**: 
  - SHED → outer ring (obsolesce track, radius 20)
  - INTEGRATE → middle ring (main track, radius 15)
  - GROUND → inner ring (retrieve track, radius 10)

### E5: **Chat Message**
- **orbit-graph**: `channel.messages[]` with role (user/assistant/system)
- **New**: Messages trigger node operations when orbital body crosses node
- **Context**: Grid state + observer + surrounding cells → AI prompt

---

## III. MORPHISMS (Arrows in Olog)

### M1: **Grid ↔ World Coordinate Transform**

```javascript
// Grid [row, col] → World (x, z)
gridToWorld(row, col) {
  const cellSize = 5;
  return {
    x: (col - 4) * cellSize,  // Center at (4,4)
    z: (row - 4) * cellSize
  };
}

// World (x, z) → Grid [row, col]
worldToGrid(x, z) {
  const cellSize = 5;
  return {
    row: Math.floor(z / cellSize) + 4,
    col: Math.floor(x / cellSize) + 4
  };
}
```

### M2: **Orbital Progress → Psychographic State**

```javascript
// Orbital body position → Current node
function getCurrentNode(channel, bodyIndex) {
  const body = channel.trainCars[bodyIndex];
  const worldPos = body.group.position;
  const {row, col} = worldToGrid(worldPos.x, worldPos.z);
  const nodeData = nodeDataset.find(n => 
    n.coordinate[0] === row && n.coordinate[1] === col
  );
  return nodeData;
}
```

### M3: **Tetrad Track → Operation Loop**

```javascript
const TRACK_TO_OPERATION = {
  'main': 'INTEGRATE',        // radius 15
  'obsolesce': 'SHED',        // radius 20 (outer)
  'retrieve': 'GROUND',       // radius 10 (inner)
  'enhance': 'INTEGRATE++',   // radius 18 (amplified)
  'reverse': 'SHED++'         // radius 12 (contracted)
};
```

### M4: **Node → Prompt Engineering**

```javascript
function nodeToPrompt(node, operation) {
  const prompts = {
    SHED: node.shedding,
    INTEGRATE: node.integrating,
    GROUND: node.grounding
  };
  
  return `
📍 Current Position: ${node.name} (${node.coordinate})
🎯 Operation: ${operation}

${prompts[operation]}

Context:
- Axis: ${node.axis || 'Synthetic'}
- Distance from center: ${node.distance_from_center}
- Nearest node: ${node.nearest_node}
  `;
}
```

### M5: **Observer → Context Window**

```javascript
function buildObserverContext(channel, currentNode) {
  const observer = appState.observers.get(channel.id);
  const surrounding = getSurroundingCells(channel, 
    currentNode.coordinate[0], 
    currentNode.coordinate[1]
  );
  
  return `
CURRENT STATE:
- Position: ${currentNode.name} at ${currentNode.coordinate}
- ${observer.entities.length} entities on grid
- Recent actions: ${observer.recentActions.length}
- Tension: ${observer.tension}

SURROUNDING NODES (8 directions):
${surrounding.map(s => 
  `- ${s.direction}: ${s.entity ? s.entity.label : 'empty'}`
).join('\n')}

PSYCHOGRAPHIC OPERATION:
${nodeToPrompt(currentNode, channel.currentOperation)}
  `;
}
```

---

## IV. NATURAL TRANSFORMATIONS (Functors)

### NT1: **Static Display → Live Simulation**

**From**: index.html (read-only Bauhaus sheet)  
**To**: orbit-graph with node data embedded

**Functor**: `F: Display → Simulation`
- Maps each cell (row, col) → 3D grid cell mesh
- Maps SHED/INTEGRATE/GROUND text → system prompts injected on collision
- Preserves structure (6 axes, 3 operations, 81 positions)

### NT2: **Psychographic Field → Orbital System**

**From**: Static coordinate system (complete_node_dataset.json)  
**To**: Dynamic orbital traversal (bodies moving through field)

**Functor**: `G: Psycho → Orbital`
- Maps nodes → grid cells with hover tooltips
- Maps operations → orbital rings (shed=outer, integrate=mid, ground=inner)
- Maps distance_from_center → visual prominence (glow intensity)

### NT3: **Chat → Psychographic Transformation**

**From**: User message (text input)  
**To**: Scene update with node-specific operations

**Functor**: `H: Chat → Transform`
- User text + current node → AI prompt
- AI response → JSON entities
- Entities placed → Observer updated
- Next orbital position → New node → Cycle repeats

---

## V. COMPOSITION (Olog Verification)

### C1: **Round-trip Identity**

```
Grid Cell --M1--> World Coords --M1^-1--> Grid Cell
(row, col) → (x, z) → (row, col)  ✓ Identity preserved
```

### C2: **Observer Awareness Chain**

```
Orbital Body --M2--> Current Node --M4--> Prompt --M5--> Context --H--> AI Response
                                                            ↓
Grid State <--Update-- JSON Entities <--Parse-- AI Response
     ↓
Observer <--Track-- Grid State
```

**Verification**: Observer sees full loop (entities added → actions tracked → context updated → AI sees context)

### C3: **Tetrad Commutativity**

```
Scene --switch track--> New Interpretation --AI reassemble--> Updated Scene
  ↓                                                              ↓
Scene --direct update--> Updated Scene                    equals?
```

**Requirement**: Track switching + AI update ≡ Direct scene manipulation (if AI prompt correctly maps tetrad verb)

---

## VI. CRITICAL SYNTHESIS QUESTIONS

### ◻ Which differences are **ESSENTIAL**?

1. **SHED vs INTEGRATE vs GROUND are SPATIAL OPERATORS**
   - Not just text labels
   - They are orbital radii: outer (shed), middle (integrate), inner (ground)
   - User switches between them by moving between concentric rings

2. **Nodes are TEMPORAL WAYPOINTS**
   - Not just data points
   - Each node = event when orbital body crosses it
   - Crossing triggers prompt injection + potential scene reassembly

3. **Observer is MEMORY LAYER**
   - Tracks what has been shed, integrated, grounded
   - Prevents redundant operations on same node
   - Creates narrative continuity across orbital cycles

4. **Axes are SEMANTIC DIMENSIONS**
   - Identity, Experience, Language, Domain, Purpose, Order
   - Not arbitrary—they structure the psychographic space
   - Each axis has inner/outer polarity (instinct/reason, seen/unseen, etc.)

### ◻ Which differences can be **SHED**?

1. **Bauhaus static display** (index.html) → Pure reference sheet, not interactive component
2. **Multi-channel horizontal scroll** → Start with single channel, add later
3. **Train metaphor** → Replace with abstract orbital body (user avatar as glowing sphere)
4. **McLuhan media eras** (Print/Radio/TV/Internet) → Optional, not core to psychographic system
5. **Snake-train growth** → Complexity add-on, defer

### ◻ Which differences must be **INTEGRATED**?

1. **9×9 Grid ⊗ 81 Nodes** → Perfect 1:1 mapping, essential
2. **Orbital motion ⊗ Psychographic traversal** → Core mechanic
3. **Observer state ⊗ Context engineering** → Required for AI coherence
4. **SHED/INTEGRATE/GROUND ⊗ Orbital rings** → Spatial embodiment of operations
5. **Collision detection ⊗ Node activation** → Trigger for prompt injection
6. **Chat ⊗ Scene reassembly** → AI-driven update cycle

### ◻ Which differences must be **GROUNDED**?

1. **POML-style prompts** → Shedding/integrating/grounding text embedded in system prompts
2. **Axis data visualization** → Each of 6 axes has distinct color/label on grid
3. **Distance-from-center metrics** → Visual encoding (glow, size, opacity)
4. **Surrounding cell awareness** → 8-direction spatial context for AI
5. **Decision architecture** → Orbital path = sequence of psychographic operations

---

## VII. IMPLEMENTATION ARCHITECTURE

### Phase 1: Data Integration (GROUNDING)

```javascript
// 1. Load complete_node_dataset.json into orbit-graph
const nodeDataset = await fetch('complete_node_dataset.json').then(r => r.json());

// 2. Map nodes to grid cells
function initPsychographicGrid(channel) {
  nodeDataset.known_nodes.forEach(node => {
    const [row, col] = node.coordinate;
    const cell = channel.gridCells[row * 9 + col];
    cell.nodeData = node;
    cell.material.color.setHex(getAxisColor(node.axis));
  });
  
  nodeDataset.synthetic_nodes.forEach(node => {
    const [row, col] = node.coordinate;
    const cell = channel.gridCells[row * 9 + col];
    cell.nodeData = node;
    cell.material.opacity = 0.5; // Dimmer for synthetic
  });
}
```

### Phase 2: Orbital Operators (INTEGRATION)

```javascript
// 3. Map operations to rings
const OPERATION_RINGS = {
  SHED: { radius: 20, color: 0xff5c7c, label: 'SHED LOOP' },
  INTEGRATE: { radius: 15, color: 0x569fff, label: 'INTEGRATE LOOP' },
  GROUND: { radius: 10, color: 0x56ff9f, label: 'GROUND LOOP' }
};

// 4. User avatar as orbital body
function createUserAvatar(channel) {
  const avatar = createOrbitalBody(1.2, 0xffaa00, 'user');
  avatar.orbitRadius = 15; // Start in INTEGRATE ring
  avatar.orbitSpeed = 0.003;
  channel.userAvatar = avatar;
  channel.scene.add(avatar);
}

// 5. Switch operation by switching ring
window.switchOperation = function(operation) {
  const channel = appState.channels.get(appState.currentChannelId);
  const newRadius = OPERATION_RINGS[operation].radius;
  
  // Animate transition to new radius
  gsap.to(channel.userAvatar, {
    orbitRadius: newRadius,
    duration: 1.5,
    ease: 'power2.inOut'
  });
  
  channel.currentOperation = operation;
  addMessage(channel, 'system', `🔄 Switched to ${operation} LOOP`);
};
```

### Phase 3: Node Activation (SHEDDING)

```javascript
// 6. Detect node crossing
function checkNodeCrossing(channel) {
  const avatar = channel.userAvatar;
  const worldPos = avatar.group.position;
  const {row, col} = worldToGrid(worldPos.x, worldPos.z);
  const cell = channel.gridCells[row * 9 + col];
  
  if (!cell.nodeData) return;
  if (cell.visited) return; // Prevent repeat triggers
  
  // Mark as visited
  cell.visited = true;
  setTimeout(() => cell.visited = false, 5000); // Reset after 5s
  
  // Trigger node operation
  activateNode(channel, cell.nodeData);
}

// 7. Activate node
function activateNode(channel, node) {
  const operation = channel.currentOperation || 'INTEGRATE';
  const prompt = nodeToPrompt(node, operation);
  
  // Visual feedback
  const cell = channel.gridCells[node.coordinate[0] * 9 + node.coordinate[1]];
  cell.material.emissive.setHex(0x00ff00);
  cell.material.emissiveIntensity = 0.5;
  
  gsap.to(cell.material, {
    emissiveIntensity: 0,
    duration: 2,
    ease: 'power2.out'
  });
  
  // Inject system prompt
  channel.messages.push({
    role: 'system',
    text: prompt,
    hidden: true, // Don't display to user
    nodeId: `${node.coordinate[0]},${node.coordinate[1]}`
  });
  
  // Show notification
  addMessage(channel, 'system', 
    `📍 **${node.name}** activated\n\n` +
    `Operation: ${operation}\n\n` +
    `"${node[operation.toLowerCase()]}"`,
    false
  );
  
  renderMessages(channel);
  
  // Update observer
  const observer = appState.observers.get(channel.id);
  observer.recentActions.push({
    type: operation,
    node: node,
    timestamp: Date.now()
  });
}
```

### Phase 4: Context Engineering

```javascript
// 8. Enhanced context window
function buildPsychographicContext(channel, userMessage) {
  const avatar = channel.userAvatar;
  const {row, col} = worldToGrid(avatar.group.position.x, avatar.group.position.z);
  const currentNode = nodeDataset.find(n => 
    n.coordinate[0] === row && n.coordinate[1] === col
  );
  
  const context = `
PSYCHOGRAPHIC POSITION:
- Current: ${currentNode?.name || 'Unknown'} at [${row},${col}]
- Distance from center: ${currentNode?.distance_from_center || 'N/A'}
- Quadrant: ${currentNode?.quadrant || 'N/A'}
- Axis: ${currentNode?.axis || 'Synthetic'}
- Polarity: ${currentNode?.polarity || 'N/A'}

ACTIVE OPERATION: ${channel.currentOperation || 'INTEGRATE'}
- Ring radius: ${OPERATION_RINGS[channel.currentOperation].radius}m
- Recent crossings: ${channel.recentNodeCrossings?.length || 0}

GRID STATE:
${buildGridSummary(channel)}

OBSERVER STATE:
${buildObserverContext(channel, currentNode)}
  `;
  
  return context;
}

// 9. Inject into AI call
async function sendPsychographicMessage(channel, userText) {
  const context = buildPsychographicContext(channel, userText);
  
  const messages = [
    {
      role: 'system',
      content: `You are a psychographic navigator. The user is orbiting through a 9×9 coordinate system performing ${channel.currentOperation} operations.
      
${context}

Respond with:
1. Natural language acknowledging their psychographic position
2. JSON block with entities that reflect the current operation (shed/integrate/ground)

Example:
\`\`\`json
{
  "entities": [
    {"type": "Entity", "row": ${row}, "col": ${col}, "label": "Integrated aspect"}
  ]
}
\`\`\`
      `
    },
    ...channel.messages.filter(m => !m.hidden).slice(-10),
    { role: 'user', content: userText }
  ];
  
  // Call OpenAI API...
}
```

---

## VIII. UI SPECIFICATION

### Control Panel (Bottom Center)

```
┌─────────────────────────────────────────────┐
│  OPERATION: [SHED] [INTEGRATE] [GROUND]    │
│                                              │
│  POSITION: [4,5] "Creative Balance"         │
│  AXIS: Identity · Inner                     │
│  DISTANCE: 2.0 from center                  │
│                                              │
│  ORBIT: ◐◑◐◑◐◑ 45% complete                  │
└─────────────────────────────────────────────┘
```

### Grid Visualization

- **Base color**: Teal grid lines (existing)
- **Axis overlay**: Each axis has subtle color gradient
  - Identity: Red → Pink
  - Experience: Orange → Amber
  - Language: Yellow → Lime
  - Domain: Green → Cyan
  - Purpose: Blue → Indigo
  - Order: Purple → Magenta
- **Node markers**: Known nodes (12) have pulsing glow
- **Current position**: User avatar (golden sphere) with trail
- **Orbital rings**: Three concentric circles (shed/integrate/ground)

### Node Tooltip (Hover)

```
╔════════════════════════════════════╗
║ CREATIVE BALANCE                   ║
║ [5,3] · 2.0 from center           ║
╠════════════════════════════════════╣
║ Shedding:                          ║
║ "Release perfectionist creation.   ║
║  Your drive for balance must       ║
║  allow asymmetry."                 ║
╠════════════════════════════════════╣
║ Integrating:                       ║
║ "Address creative paralysis.       ║
║  Integrate imperfection with       ║
║  craft."                           ║
╠════════════════════════════════════╣
║ Grounding:                         ║
║ "Make messy things. Let creation   ║
║  precede perfection."              ║
╚════════════════════════════════════╝
```

---

## IX. PROMPT CRAFT (POML Integration)

### System Prompt Template

```xml
<psychographic_system>
  <position row="{row}" col="{col}" name="{node.name}"/>
  <axis type="{axis}" polarity="{polarity}"/>
  <distance_from_center value="{distance}"/>
  <quadrant>{quadrant}</quadrant>
  
  <operation type="{SHED|INTEGRATE|GROUND}">
    <instruction>{node.shedding|integrating|grounding}</instruction>
    <ring_radius>{radius}</ring_radius>
    <orbital_progress>{progress}%</orbital_progress>
  </operation>
  
  <observer>
    <entities count="{N}">{list}</entities>
    <recent_actions>{actions}</recent_actions>
    <narrative>{observer.narrative}</narrative>
    <tension level="{observer.tension}"/>
  </observer>
  
  <surrounding_cells>
    {8 direction context}
  </surrounding_cells>
  
  <task>
    Respond as psychographic navigator. Acknowledge user's position.
    Suggest entities that reflect current operation.
    Output JSON with spatial entities.
  </task>
</psychographic_system>
```

---

## X. DECISION ARCHITECTURE

### User Flow

```
1. User enters scene → Avatar spawns at CENTER [5,5]
2. Avatar begins orbiting in INTEGRATE ring (radius 15)
3. As avatar crosses nodes, prompts inject into context
4. User chats → AI responds with node-appropriate guidance
5. User switches operation → Avatar transitions to new ring
   - SHED (outer, radius 20) → Release/remove operations
   - INTEGRATE (middle, radius 15) → Connect/synthesize
   - GROUND (inner, radius 10) → Stabilize/commit
6. Observer tracks all crossings and operations
7. User can view profile → See visited nodes, operations performed
```

### Escape Hatches

- **Manual position**: Click grid cell → Avatar jumps there
- **Pause orbit**: Freeze motion, explore nodes statically
- **Operation override**: Force-inject SHED/INTEGRATE/GROUND prompt manually
- **Reset profile**: Clear visited nodes, start fresh from center

---

## XI. SUCCESS METRICS

### The synthesis succeeds if:

1. ✓ **Grid cells display node names on hover**
2. ✓ **Avatar orbits smoothly through psychographic space**
3. ✓ **Crossing node triggers prompt injection (hidden from user)**
4. ✓ **AI responses reflect current operation (shed/integrate/ground)**
5. ✓ **Switching operation changes orbit radius visibly**
6. ✓ **Observer tracks visited nodes and operations performed**
7. ✓ **Context window includes psychographic position + axis + operation**
8. ✓ **Entities placed on grid respect node semantic territory**

### The synthesis is TRANSFORMATIVE if:

1. ⚡ **Users intuitively understand psychographic space through motion**
2. ⚡ **Chat feels context-aware (AI "knows where you are")**
3. ⚡ **Operations feel spatially embodied (not just menu selections)**
4. ⚡ **Axis structure becomes legible through color + interaction**
5. ⚡ **Profiles emerge as orbital trajectories (history of crossings)**

---

## XII. FILE GENERATION PLAN

### Create:

1. **`orbit-psychographic-synthesis.html`** - Main application
   - Merges orbit-graph Three.js with complete_node_dataset
   - Implements all morphisms M1-M5
   - Includes GSAP for smooth transitions

2. **`psychographic-prompts.js`** - Node prompt engineering
   - Exports `nodeToPrompt(node, operation)`
   - POML template system
   - Context builder functions

3. **`axis-visualization.js`** - Grid color system
   - Maps 6 axes to color gradients
   - Renders axis labels on grid edges
   - Highlights current axis based on position

4. **`operation-rings.js`** - Orbital control
   - SHED/INTEGRATE/GROUND ring management
   - Transition animations
   - Ring switching logic

5. **`observer-engine.js`** - Enhanced observer
   - Tracks node crossings
   - Builds psychographic profiles
   - Generates operation history reports

6. **`INTEGRATION-TEST.md`** - Verification suite
   - Round-trip tests for all morphisms
   - Observer awareness checks
   - Prompt injection verification

---

## XIII. NEXT STEPS

Ready to build? Confirm approach and I'll generate:

1. Complete orbit-psychographic-synthesis.html
2. All supporting modules
3. Integration tests
4. README with usage instructions

**Estimated token cost**: ~40K tokens for full implementation.

Proceed? 🚀
