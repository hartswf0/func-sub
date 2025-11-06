# Forensic Evidence: FUNC-ORB-TRAINING.HTML Code Reality

## I. The Raw Mechanics: What's Actually in the Code?

### 1. API Calls - ACTUAL CODE

**Question: What is the exact JavaScript function making LLM calls?**

**Answer: NO DIRECT API CALLING FUNCTION FOUND. LLM integration is minimal/optional**

Search results show:
- `sendMessageWithLEGOS()` function (line 3616) handles chat messages
- NO `fetch()` calls to OpenAI API in the visible code
- Command parsing is LOCAL (not LLM-based)

```javascript
// Line 3616-3900+: Message handling (LOCAL, not LLM)
async function sendMessageWithLEGOS(channel, userText) {
  const lowerText = userText.toLowerCase().trim();
  
  // SIMPLE COMMAND ROUTING - No LLM
  if (lowerText === 'addfire' || lowerText === 'add fire') {
    // ... creates fire entity locally
    addMessage(channel, 'system', `🔥 Fire created at (${emptyCell.row}, ${emptyCell.col})!`);
    return;
  }
  
  if (lowerText === 'show observer' || lowerText === '/observer') {
    // ... formats observer state locally
    addMessage(channel, 'system', observerStateText);
    return;
  }
  
  // ... more local command handlers
}
```

**Key Finding:** ORB is primarily a **3D navigation interface** with **local command processing**, not an LLM-driven agent system.

---

### 2. Data Structures - ACTUAL VARIABLES

**Question: What is the data structure for the 9×9 grid?**

**Answer: `channel.gridCells` array of 81 cell objects**

```javascript
// Line 1705-1752: Channel creation
function createChannel(name = null) {
  const channel = {
    id: generateId(),
    name: channelName,
    messages: [],  // Chat transcript
    scene: null,   // Three.js Scene object
    camera: null,  // Three.js PerspectiveCamera
    renderer: null,  // Three.js WebGLRenderer
    controls: null,  // OrbitControls
    
    // THE GRID
    gridCells: [],  // Will contain 81 cell objects
    
    // AVATAR (player position)
    avatar: {
      row: 4,  // Center of 9x9 grid (0-indexed)
      col: 4,
      mesh: null  // Three.js Mesh object
    },
    
    // TRAIN (moving entity)
    train: {
      active: false,
      row: 0,
      col: 0,
      track: 'MAIN',  // 'MAIN' | 'NORTH' | 'SOUTH'
      mesh: null,
      speed: 1
    },
    
    // PSYCHOGRAPH (radar visualization)
    trainingAxisValues: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],  // 6 axes
    
    // Collision/Junction state
    atJunction: false,
    lastCollisionEntity: null,
    
    // Unlockable operations
    unlockedOperations: {
      shed: false,
      integrate: false,
      ground: false
    },
    
    startTime: Date.now()
  };
  
  return channel;
}
```

**Grid Cell Structure:**

```javascript
// Grid cells are created in 3D scene initialization
for (let r = 0; r < GRID_SIZE; r++) {  // GRID_SIZE = 9
  for (let c = 0; c < GRID_SIZE; c++) {
    const cell = {
      row: r,
      col: c,
      mesh: null,        // Three.js Mesh (the floor tile)
      marker: null,      // Three.js Mesh (entity indicator)
      hasEntity: false,  // Boolean
      entityType: null   // 'FIRE' | 'OBSTACLE' | 'GOAL' | etc.
    };
    channel.gridCells.push(cell);
  }
}
```

---

**Question: How does the LLM "see" the grid?**

**Answer: IT DOESN'T. The grid is never sent to an LLM. It's rendered as 3D visual and compressed text summary**

```javascript
// Line 2587-2605: Grid summary is for DISPLAY, not LLM
function buildGridSummary(channel) {
  const entities = appState.gridEntities.get(channel.id) || [];
  
  if (entities.length === 0) return '(empty grid)';
  
  // Group by type
  const byType = {};
  entities.forEach(ent => {
    if (!byType[ent.type]) byType[ent.type] = [];
    byType[ent.type].push(`(${ent.row},${ent.col})`);
  });
  
  // Format as string
  return Object.entries(byType)
    .map(([type, coords]) => `${type}: ${coords.join(', ')}`)
    .join(' | ');
}

// This summary is displayed in the UI, NOT sent to an LLM
```

---

### 3. Agent Definition - ACTUAL CODE

**Question: How are "agents" defined in ORB?**

**Answer: Agents are CHANNELS (UI viewports), not conversational agents**

```javascript
// Line 1282-1288: Global app state
const appState = {
  channels: new Map(),  // Multiple channels (scenes)
  currentChannelId: null,
  gridEntities: new Map(),  // channelId -> array of entities
  apiKey: localStorage.getItem('railway_api_key') || '',
  observers: new Map()  // channelId -> observer state
};
```

**Three "agents" are actually three CHANNELS:**

```javascript
// Line 1855-1943: Centaur scene creation
function createCentaurScenes() {
  // INNER channel (subjective)
  const innerScene = createChannel('INNER');
  innerScene.role = 'INNER';
  innerScene.sceneType = 'CENTAUR_INNER';
  innerScene.systemPrompt = `You are the INNER apparatus - the subjective, first-person pole.
You track experiences, emotions, and personal meaning-making...`;
  
  // OUTER channel (objective)
  const outerScene = createChannel('OUTER');
  outerScene.role = 'OUTER';
  outerScene.sceneType = 'CENTAUR_OUTER';
  outerScene.systemPrompt = `You are the OUTER apparatus - the objective, third-person pole.
You track systems, structures, and observable patterns...`;
  
  // OBSERVER channel (meta)
  const observerScene = createChannel('OBSERVER');
  observerScene.role = 'OBSERVER';
  observerScene.sceneType = 'META_OBSERVER';
  observerScene.systemPrompt = `You are the OBSERVER apparatus - the meta-layer watching both INNER and OUTER...`;
  
  // Shared observer state
  appState.observerState = {
    innerBalance: {Instinct: 0.3, Seen: 0.3, Ideas: 0.3, Source: 0.3, Heart: 0.3, Parts: 0.3},
    outerBalance: {Instinct: 0.3, Seen: 0.3, Ideas: 0.3, Source: 0.3, Heart: 0.3, Parts: 0.3},
    stageCounts: {SHED: 0, INTEGRATE: 0, GROUND: 0},
    placementHistory: [],
    imbalances: []
  };
  
  return {innerScene, outerScene, observerScene};
}
```

**Key Finding:** `systemPrompt` fields exist but are **not sent to LLMs**. They're **UI documentation** explaining what each channel represents.

---

## II. The Flow & Control: How Does Information Move?

### 4. Orchestration Logic - ACTUAL CODE

**Question: What is the control flow?**

**Answer: EVENT-DRIVEN keyboard input → local handlers → 3D updates**

```javascript
// Line 2965-3065: Keyboard event handler
document.addEventListener('keydown', (e) => {
  const channel = appState.channels.get(appState.currentChannelId);
  if (!channel || !channel.avatar) return;
  
  const avatar = channel.avatar;
  let newRow = avatar.row;
  let newCol = avatar.col;
  
  // ARROW KEYS: Move avatar
  if (e.key === 'ArrowUp') newRow--;
  else if (e.key === 'ArrowDown') newRow++;
  else if (e.key === 'ArrowLeft') newCol--;
  else if (e.key === 'ArrowRight') newCol++;
  
  // SPACE: Interact with entity
  else if (e.key === ' ') {
    const entities = appState.gridEntities.get(channel.id) || [];
    const nearbyEntity = entities.find(ent =>
      Math.abs(ent.row - avatar.row) <= 1 && 
      Math.abs(ent.col - avatar.col) <= 1
    );
    if (nearbyEntity) {
      addMessage(channel, 'system',
        `🤝 **Interacting with ${nearbyEntity.label}**\n` +
        `Type: ${nearbyEntity.type}\n` +
        `Position: (${nearbyEntity.row}, ${nearbyEntity.col})`
      );
    }
    return;
  }
  
  // Validate bounds
  if (newRow < 0 || newRow >= 9 || newCol < 0 || newCol >= 9) return;
  
  // Update avatar position
  avatar.row = newRow;
  avatar.col = newCol;
  
  // Update 3D mesh position
  if (avatar.mesh) {
    avatar.mesh.position.x = (newCol - 4) * CELL_SIZE;
    avatar.mesh.position.z = (newRow - 4) * CELL_SIZE;
  }
  
  // Check for collisions or junctions
  checkJunction(channel);
  handleCollision(channel);
  
  // Update psychograph based on position
  schedulePsychographUpdate(channel);
});
```

**No central orchestrator. Flow is:**
1. User presses key
2. Avatar position updated
3. 3D mesh updated
4. Collision/junction checked
5. Psychograph updated

---

### 5. State Management - ACTUAL CODE

**Question: Where is state stored?**

**Answer: `appState` global object + per-channel state**

```javascript
// Line 1282-1288
const appState = {
  channels: new Map(),        // channelId -> channel object
  currentChannelId: null,
  gridEntities: new Map(),    // channelId -> array of entities
  apiKey: localStorage.getItem('railway_api_key') || '',
  observers: new Map(),       // channelId -> observer state (unused)
  observerState: {            // Shared across INNER/OUTER/OBSERVER channels
    innerBalance: {...},
    outerBalance: {...},
    stageCounts: {...},
    placementHistory: [],
    imbalances: []
  }
};
```

**Per-channel state** is in the channel object (shown earlier).

**How is user input preserved?**

```javascript
// Line 1754-1766: Messages are appended to channel
function addMessage(channel, role, text, isHTML = false) {
  const message = {
    id: generateId(),
    role: role,        // 'user' | 'system' | 'assistant'
    text: text,
    isHTML: isHTML,
    timestamp: Date.now()
  };
  
  channel.messages.push(message);
  return message;
}

// Messages are NEVER sent to an LLM
// They're just displayed in the chat UI
```

---

## III. The Specifics: Show Me the Actual Text

### 6. Prompt/Completion Pairs - REAL EXAMPLES

**Question: What's the INNER channel's prompt template?**

**Answer: There is NO prompt template sent to LLMs. The `systemPrompt` is UI documentation only.**

```javascript
// Line 1819-1854: INNER scene system prompt (NOT sent to API)
innerScene.systemPrompt = `You are the INNER apparatus - the subjective, first-person pole.

You track experiences, emotions, and personal meaning-making. Your radar shows:
- Instinct (gut, impulse)
- Seen (perception, what appears)
- Ideas (concepts, abstractions)
- Source (origin, causality)
- Heart (emotion, care)
- Parts (components, analysis)

CURRENT STATE:
${JSON.stringify(appState.observerState.innerBalance, null, 2)}

Your purpose:
- Witness and articulate lived experience
- Track emotional valence and subjective meaning
- Notice what INNER values that OUTER might miss

You can place entities on your grid using SHED/INTEGRATE/GROUND operations.

Commands you understand:
- /inner (show this prompt)
- show balance (display axis values)
- place [entity] at [row] [col]

Your context window contains: Your current grid, your axis balance, and your placement history.`;
```

**NO LLM CALL USES THIS.** It's just displayed when user types `/inner`.

---

**Question: Show me an actual completion from the system.**

**Answer: There are NO LLM completions. All responses are LOCAL string formatting:**

```javascript
// Line 3621-3636: "addfire" command (100% local)
if (lowerText === 'addfire' || lowerText === 'add fire') {
  const emptyCell = findRandomEmptyCell(channel);
  if (!emptyCell) {
    addMessage(channel, 'system', '⚠️ Grid full! No space for fire.');
    renderMessages(channel);
    return;
  }
  const entities = appState.gridEntities.get(channel.id) || [];
  const fire = {type: 'FIRE', label: 'Fire', row: emptyCell.row, col: emptyCell.col};
  entities.push(fire);
  appState.gridEntities.set(channel.id, entities);
  
  addMessage(channel, 'system', `🔥 Fire created at (${emptyCell.row}, ${emptyCell.col})!`);
  renderMessages(channel);
  return;
}
```

**System "completion":**
```
🔥 Fire created at (3, 7)!
```

This is a **template string**, not an LLM-generated completion.

---

## IV. World Model: The Grid

### 7. Data Structure Forensics

**Question: How is the 9×9 grid represented?**

**Answer: TWO representations:**

1. **3D Visual** (Three.js Scene):
```javascript
// Grid cells are Three.js Mesh objects positioned in 3D space
const cellMesh = new THREE.Mesh(
  new THREE.BoxGeometry(CELL_SIZE - 0.1, 0.1, CELL_SIZE - 0.1),
  new THREE.MeshStandardMaterial({color: 0x1a1a1a})
);
cellMesh.position.x = (col - 4) * CELL_SIZE;
cellMesh.position.z = (row - 4) * CELL_SIZE;
channel.scene.add(cellMesh);
```

2. **Data Array** (`channel.gridCells`):
```javascript
channel.gridCells[row * 9 + col] = {
  row: row,
  col: col,
  mesh: cellMesh,
  marker: null,
  hasEntity: false,
  entityType: null
};
```

**Entities** are stored separately:
```javascript
appState.gridEntities.set(channel.id, [
  {type: 'FIRE', label: 'Fire', row: 3, col: 7},
  {type: 'OBSTACLE', label: 'Wall', row: 5, col: 2},
  // ...
]);
```

---

**Question: How does LLM action update the grid?**

**Answer: IT DOESN'T. There are NO LLM actions. User actions update the grid directly:**

```javascript
// Line 2965+: User presses arrow key → grid updates immediately
avatar.row = newRow;
avatar.col = newCol;

// Avatar mesh moves in 3D space
avatar.mesh.position.x = (newCol - 4) * CELL_SIZE;
avatar.mesh.position.z = (newRow - 4) * CELL_SIZE;

// Psychograph updates based on new position
schedulePsychographUpdate(channel);
```

**The psychograph update is DETERMINISTIC:**

```javascript
// External file: integrate-psychograph-updates.js (not shown in grep)
// But from context, it's a lookup:
window.schedulePsychographUpdate = function(channel) {
  const {row, col} = channel.avatar;
  const node = findNodeAtPosition(row, col);  // Lookup in PSYCHOGRAPH_DATASET
  if (node) {
    channel.trainingAxisValues = node.inner;  // Direct assignment
    updateHexagonRadar(channel);  // Redraw canvas
  }
};
```

**NO parsing, NO LLM interpretation, NO generative component.**

---

## V. Ontology from Evidence

### 8. Architectural Difference: CB vs ORB

**Question: Does ORB's LLM change the environment between turns?**

**Answer: THERE IS NO LLM IN ORB'S CORE LOOP. Environment changes are USER-DRIVEN.**

```javascript
// CB.HTML: LLM generates text → Observer models beliefs → Beliefs enter next prompt
async function draft(ctx) {
  const sysPrompt = buildSystemPrompt(role, ctx.chosenOption.text);
  const res = await llmReply(role, sysPrompt, chatWindow(10));
  ctx.llmResult = {text: res.text, meta: {...}};
}

// Beliefs are UPDATED by LLM inference:
async function model(ctx) {
  await updateBeliefsAndEmit(orchestratorState, ctx.role);
}

// ORB: User moves → Position changes → Radar updates (NO LLM)
document.addEventListener('keydown', (e) => {
  avatar.row = newRow;
  avatar.col = newCol;
  schedulePsychographUpdate(channel);  // Just a lookup
});
```

---

**Question: Show me code that updates world state and re-renders prompts.**

**Answer: IN ORB, THERE IS NO PROMPT RE-RENDERING. World state updates are 3D visual only.**

```javascript
// When user moves to a junction:
function handleJunction(channel, entity) {
  channel.atJunction = true;
  
  const junctionMsg = {
    id: generateId(),
    role: 'system',
    text: `🚦 JUNCTION: Reached ${entity.type} "${entity.label}". Choose your path:`,
    hasTetradChoices: true  // Display track options UI
  };
  
  channel.messages.push(junctionMsg);
  renderMessages(channel);  // Just updates DOM, no LLM involved
}
```

**The "world" is the 3D scene + grid cells + entity positions. Changes are immediate and visual, not mediated by LLMs.**

---

## VI. Bottom-Up Naming: Evidence from Variable/Function Names

### Key JavaScript Functions and Their Purpose:

| Function Name | Purpose | Evidence of Role |
|---------------|---------|------------------|
| `createChannel(name)` | Creates a viewport with 3D scene | Returns channel with scene, camera, avatar |
| `addMessage(channel, role, text)` | Appends to chat log | Pushes to `channel.messages[]` |
| `sendMessageWithLEGOS(channel, text)` | Parses user commands | Local string matching, no API |
| `buildGridSummary(channel)` | Formats entity list | Returns string for display |
| `schedulePsychographUpdate(channel)` | Updates radar from position | Looks up node data, assigns to `trainingAxisValues` |
| `handleCollision(channel)` | Checks for entity at avatar position | Local array search |
| `handleJunction(channel, entity)` | Displays track choice UI | Updates `channel.atJunction` flag |
| `placeEntityOnGrid(channel, entity)` | Adds entity to grid | Pushes to `gridEntities`, creates 3D marker |
| `removeEntityFromGrid(channel, entity)` | Deletes entity | Filters array, removes 3D marker |

**NO functions named:**
- `callLLM`, `generateCompletion`, `buildPrompt`, `parseResponse`, `updateBeliefs`, `modelAgent`

**This is NOT an LLM-driven system. It's a 3D SPATIAL NAVIGATION TOOL with chat UI for commands.**

---

## VII. Comments and README Evidence

### What Does the Code Say Its Purpose Is?

**From HTML title and welcome messages:**

```html
<title>Orbital Navigation - Training Ground</title>
```

```javascript
// Line 2311-2320: Welcome message
addMessage(firstChannel, 'system', `
<div style="...">
  <div style="font-size: 18px; font-weight: bold;">🎯 Training Ground</div>
  <div style="font-size: 13px; color: #888;">Navigate the 9×9 grid. Explore conceptual space.</div>
</div>
`);
```

**From scene prompts (which are documentation, not LLM prompts):**

- INNER: "Witness and articulate lived experience"
- OUTER: "Track systems, structures, and observable patterns"
- OBSERVER: "The meta-layer watching both INNER and OUTER"

**Interpretation:** This is a **pedagogical tool** for exploring a conceptual space represented as a 3D grid. The "agents" are **perspectives** (INNER/OUTER/OBSERVER), not autonomous conversational agents.

---

## VIII. Summary: What ORB Actually Is

### Evidence-Based Findings:

1. **NOT an LLM-agent system** - No API calls to OpenAI in core loop
2. **3D navigation interface** - Three.js renders 9×9 grid, user controls avatar with arrow keys
3. **Local command parser** - `sendMessageWithLEGOS()` routes text commands to local handlers
4. **Deterministic feedback** - Position → lookup in PSYCHOGRAPH_DATASET → radar update
5. **Multi-viewport UI** - Three channels (INNER, OUTER, OBSERVER) are separate 3D scenes
6. **Aspirational observer** - `observerState` tracks statistics but doesn't feed back into behavior
7. **Training ground metaphor** - Designed for exploration and learning, not generative conversation

### What's MISSING (compared to CB):

- No `buildSystemPrompt()` equivalent
- No belief modeling via LLM
- No strategic planning layer
- No prompt relay mechanism
- No recursive modeling
- No adjudication logic
- No turn-based orchestration

---

## IX. Critical Absence: The LLM Integration Gap

### Where WOULD LLM calls be if they existed?

Hypothetically, ORB could have:

```javascript
// HYPOTHETICAL (NOT IN CODE):
async function generateSceneResponse(channel, userInput) {
  const gridContext = buildGridSummary(channel);
  const systemPrompt = channel.systemPrompt + `\n\nCurrent grid: ${gridContext}`;
  
  const messages = [
    {role: 'system', content: systemPrompt},
    ...channel.messages.slice(-10).map(m => ({role: m.role, content: m.text}))
  ];
  
  const res = await fetch(apiBase + '/chat/completions', {
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + appState.apiKey},
    body: JSON.stringify({model: 'gpt-4o-mini', messages})
  });
  
  const completion = await res.json();
  return completion.choices[0].message.content;
}
```

**But this doesn't exist.** ORB is a **non-generative training interface**.

---

## X. Next Step: Comparative Table

Now that we have forensic evidence from both systems, we can build a comparison table based on ACTUAL CODE, not concepts.

Should I create:
1. **Comparative evidence table** (CB actual vs ORB actual)
2. **Test harness** (unit tests for CB functions)
3. **Instrumentation script** (console logging for live debugging)
