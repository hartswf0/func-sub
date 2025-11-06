# Comparative Evidence Table: CB vs ORB (Code Reality)

## Methodology: Code-First Analysis

This comparison is built from **actual code inspection**, not conceptual models. Every claim is traceable to a line number or function name.

---

## Core Question: Are These Similar Systems?

**Answer from Evidence: NO. They are fundamentally different types of software.**

| Dimension | CB.HTML | FUNC-ORB-TRAINING.HTML |
|-----------|---------|------------------------|
| **Primary Function** | LLM-driven conversational agent system | 3D spatial navigation interface |
| **User Interaction** | Text input → LLM generation | Keyboard input → 3D movement |
| **Core Loop** | Turn-based conversation with belief updates | Real-time avatar navigation |
| **LLM Integration** | 3 LLM calls per AI turn (Planner, Drafter, Modeler) | None in core loop |
| **State Management** | `orchestratorState` (beliefs, acts, log) | `appState` (channels, entities, positions) |
| **"Agents"** | Roles ('ALLY', 'KEEPER') with dynamic prompts | Channels (viewports) with static docs |
| **Prompt Architecture** | `buildSystemPrompt()` embeds beliefs as JSON | No prompt construction |
| **Completion Flow** | LLM text → relay → other agent's prompt | N/A - no LLM completions |
| **Observer Role** | Models beliefs via LLM, embeds in prompts | Tracks stats, displays to user |
| **Feedback Loop** | Recursive (beliefs → prompts → completions → beliefs) | Linear (position → lookup → display) |
| **Orchestration** | Sequencer with 7 phases | Event-driven keyboard handlers |

---

## I. API Call Evidence

### CB.HTML: Three Distinct API Functions

```javascript
// 1. Main Agent LLM (line 2551)
async function llmReply(role, systemPrompt, chatHistoryText, temp = 0.8)
// Called by: draft() phase
// Purpose: Generate agent utterances
// Frequency: Once per AI turn

// 2. Modeler LLM (line 2630)
async function callModeler(aboutWhom)
// Called by: model() phase
// Purpose: Infer belief profiles from conversation
// Frequency: After each speaker (2x per full turn cycle)

// 3. Strategic Planner LLM (line 2808)
async function callStrategyPlanner(role, currentMemo, chatHistory, ...)
// Called by: plan() phase
// Purpose: Generate 4-6 strategic options
// Frequency: Once per AI turn (before draft)
```

**Total LLM calls per AI turn: 4**
- 1× Planner
- 1× Drafter
- 2× Modeler (for both ALLY and KEEPER)

### FUNC-ORB: Zero API Functions

```javascript
// SEARCH RESULTS: No fetch() to OpenAI API
// SEARCH RESULTS: No async function calling LLM services
// SEARCH RESULTS: No prompt construction for generative models

// Only local command parsing:
async function sendMessageWithLEGOS(channel, userText) {
  // String matching: 'addfire', 'show observer', etc.
  // No external API calls
}
```

**Total LLM calls per user action: 0**

---

## II. Data Structure Evidence

### CB.HTML: Belief-Centric State

```javascript
const orchestratorState = {
  // PRIMARY DATA: Beliefs (Observer's models + self-models)
  beliefs: {
    observerModelOfAlly: {openness:3, conscientious:3, ..., decisiveness:3},     // 11 dims
    observerModelOfKeeper: {openness:3, conscientious:3, ..., decisiveness:3},   // 11 dims
    allySelf: {openness:4, conscientious:3, ..., decisiveness:3},                // 11 dims
    keeperSelf: {openness:2, conscientious:4, ..., decisiveness:3}               // 11 dims
  },
  
  // Conversation state
  lastActs: {ALLY: 'PROPOSE', KEEPER: 'CHALLENGE'},
  lastIntentFromOther: {ALLY: 'deny_request', KEEPER: 'propose_solution'},
  log: [/* timestamped events */],
  memo: "ALLY seeks autonomy (openness:4.0). KEEPER maintains control (authority:4.0)...",
  
  // Policies control system behavior
  policies: {
    useLLM: true,
    relayMode: true,
    strategicPlanningEnabled: true,
    useModeler: true
  }
}
```

**Data flows:**
1. Conversation → Modeler LLM → `beliefs` updated
2. `beliefs` → `buildSystemPrompt()` → stringified as JSON
3. JSON in prompt → LLM sees it → completion influenced
4. Completion → logged → next Modeler input
5. **Recursive loop**

### FUNC-ORB: Position-Centric State

```javascript
const appState = {
  // PRIMARY DATA: Channels (viewports with 3D scenes)
  channels: new Map(),  // channelId -> {scene, camera, avatar, gridCells, messages}
  
  // Entities on grid
  gridEntities: new Map(),  // channelId -> [{type, label, row, col}]
  
  // Observer (DOES NOT FEED BACK)
  observerState: {
    innerBalance: {Instinct:0.3, Seen:0.3, Ideas:0.3, Source:0.3, Heart:0.3, Parts:0.3},
    outerBalance: {Instinct:0.3, Seen:0.3, Ideas:0.3, Source:0.3, Heart:0.3, Parts:0.3},
    stageCounts: {SHED:0, INTEGRATE:0, GROUND:0},
    placementHistory: []
  }
}

// Per-channel state
channel = {
  avatar: {row: 4, col: 4, mesh: ThreeMesh},
  gridCells: [/* 81 cells */],
  trainingAxisValues: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],  // 6 axes
  messages: [/* chat log */]
}
```

**Data flows:**
1. User presses arrow key → `avatar.row` updated
2. `schedulePsychographUpdate()` → lookup node at position
3. `trainingAxisValues` = node.inner (direct assignment)
4. Canvas redraws radar
5. **Linear, no feedback loop**

---

## III. Prompt Construction Evidence

### CB.HTML: Dynamic, Context-Rich Prompts

```javascript
function buildSystemPrompt(role, currentDirective = null){
  const s = orchestratorState;
  
  // Pull from state
  const baseScenarioPrompt = (role === 'ALLY') ? currentAllyBaseSysPrompt : currentKeeperBaseSysPrompt;
  const beliefOfOther = (role === 'ALLY') ? s.beliefs.observerModelOfKeeper : s.beliefs.observerModelOfAlly;
  const mySelf = (role === 'ALLY') ? s.beliefs.allySelf : s.beliefs.keeperSelf;
  
  // Compose multi-part prompt
  return `
BASE_PERSONA:
${baseScenarioPrompt}
PACT: ${CONVERSATION_PACT.trim()}
CONTEXT: ${s.memo}
YOUR_LAST_ACT: ${s.lastActs[role]}
COUNTERPART_INTENT: ${s.lastIntentFromOther[role]}
MODEL_OF_OTHER(JSON): ${JSON.stringify(beliefOfOther)}  // ← BELIEF EMBEDDING
TRAIT_PROFILE: ${formatTraitProfile(mySelf)}            // ← SELF-MODEL
FOCUS_THIS_TURN: ${currentDirective}                    // ← STRATEGIC DIRECTIVE
`;
}
```

**Evidence:**
- Function called: Line 3760 (`const sysPrompt = buildSystemPrompt(role, ctx.chosenOption.text)`)
- Inputs: `orchestratorState`, `role`, `directive`
- Output: Multi-section string with embedded JSON
- Used in: `llmReply()` as `messages[0].content`

**Prompt changes dynamically** based on:
- Beliefs (updated by Modeler)
- Memo (updated by Observer)
- Directive (chosen by Selector from Planner's options)

### FUNC-ORB: No Prompt Construction

```javascript
// SEARCH RESULTS: No function named buildPrompt, constructPrompt, or similar
// SEARCH RESULTS: No calls to JSON.stringify() for embedding in prompts
// SEARCH RESULTS: No template literals constructing system messages

// The "systemPrompt" fields in channels are NEVER SENT TO AN LLM:
innerScene.systemPrompt = `You are the INNER apparatus...`;  // Static doc string
```

**Evidence:**
- `systemPrompt` is a channel property (line 1819)
- Never passed to `fetch()` or any async function
- Only displayed when user types `/inner` command
- **It's documentation, not a functional prompt**

---

## IV. Completion Flow Evidence

### CB.HTML: Text Relay + Belief Embedding

**Two pathways for one agent's output to enter another's context:**

#### Pathway 1: Relay Mode (Visible)
```javascript
// Line 3783-3787
if (orchestratorState.policies.relayMode && role === 'ALLY' && keeperInput) {
    keeperInput.value = currentText;  // ALLY's completion → KEEPER's textarea
}
```

**Evidence:**
- Function: `speakAI(ctx)` (line 3776)
- Effect: User can SEE the text, can EDIT before sending
- Flow: ALLY completion → `keeperInput.value` → user optionally edits → KEEPER's next turn

#### Pathway 2: Belief Embedding (Hidden)
```javascript
// Line 2511-2513
const beliefOfOther = (role === 'ALLY') ? 
    orchestratorState.beliefs.observerModelOfKeeper : 
    orchestratorState.beliefs.observerModelOfAlly;

// Line 2533
MODEL_OF_OTHER(JSON): ${JSON.stringify(beliefOfOther)}
```

**Evidence:**
- ALLY speaks → Modeler updates `observerModelOfAlly`
- KEEPER's next prompt embeds `observerModelOfAlly` as JSON
- KEEPER never "sees" this directly (it's in system prompt)
- But KEEPER's completion is influenced by it

**Empirical test:**
1. Run CB with modeler disabled → ALLY and KEEPER ignore each other's "personality"
2. Run CB with modeler enabled → ALLY and KEEPER adapt to perceived traits

### FUNC-ORB: No Completion Flow

```javascript
// User types "addfire"
if (lowerText === 'addfire') {
  const fire = {type: 'FIRE', label: 'Fire', row: emptyCell.row, col: emptyCell.col};
  entities.push(fire);
  addMessage(channel, 'system', `🔥 Fire created at (${emptyCell.row}, ${emptyCell.col})!`);
}
```

**Evidence:**
- Input: User text
- Process: String matching
- Output: Templated response
- **No LLM involved, no generative text, no context passing**

---

## V. Observer Role Evidence

### CB.HTML: Active Modeler

```javascript
// Line 3686-3689: Observer phase
async function model(ctx) {
    await updateBeliefsAndEmit(orchestratorState, ctx.role);  // Calls Modeler LLM
    updateUIState(orchestratorState);  // Re-render radar
}

// Line 2630-2690: Modeler LLM call
async function callModeler(aboutWhom){
  const recent = orchestratorState.log.filter(x=>x.type==='MESSAGE').slice(-8).map(x=>x.who+': '+x.text).join('\n');
  const prompt = buildModelerPrompt(label, recent||'(empty)');
  
  // LLM analyzes conversation, returns belief profile
  const res = await fetch(base+"/chat/completions", {...});
  const payload = await res.json();  // {dims, prior, posterior, myth, tone, rationale}
  
  return payload;
}
```

**Evidence:**
- Observer is a **process** (Modeler LLM), not a display panel
- Observer's output (beliefs) **enters agent prompts**
- Observer runs **after every message**
- Observer's models **shape future behavior**

**Empirical validation:**
- Log `observerModelOfAlly` before and after ALLY speaks → values change
- Log KEEPER's system prompt before next turn → JSON shows updated model
- Disable observer → agents don't adapt to each other

### FUNC-ORB: Passive Tracker

```javascript
// Line 1910-1927: Observer state structure
appState.observerState = {
  innerBalance: {Instinct: 0.3, Seen: 0.3, Ideas: 0.3, Source: 0.3, Heart: 0.3, Parts: 0.3},
  outerBalance: {Instinct: 0.3, Seen: 0.3, Ideas: 0.3, Source: 0.3, Heart: 0.3, Parts: 0.3},
  stageCounts: {SHED: 0, INTEGRATE: 0, GROUND: 0},
  placementHistory: [],
  imbalances: []
};

// Line ~3700+: Observer display command
if (lowerText === 'show observer' || lowerText === '/observer') {
  const observerText = `
INNER balance: ${JSON.stringify(appState.observerState.innerBalance)}
OUTER balance: ${JSON.stringify(appState.observerState.outerBalance)}
Stage counts: ${JSON.stringify(appState.observerState.stageCounts)}
`;
  addMessage(channel, 'system', observerText);
}
```

**Evidence:**
- Observer is a **data structure**, not a process
- Observer's output (stats) **displays to user**
- Observer's stats **do not enter any decision logic**
- Observer is **append-only** (no feedback)

**Empirical validation:**
- Manually set `observerState.innerBalance.Instinct = 5.0` → no behavior change
- Avatar still moves same way, radar still updates from position lookup
- Observer stats are **decorative**, not functional

---

## VI. Feedback Loop Evidence

### CB.HTML: Recursive Causality

```
User Input
    ↓
ALLY drafts reply (via LLM using old beliefs)
    ↓
ALLY's text logged
    ↓
Observer models ALLY (via Modeler LLM)
    ↓
observerModelOfAlly updated with new dims/myth
    ↓
Turn switches to KEEPER
    ↓
KEEPER's system prompt embeds observerModelOfAlly (JSON)
    ↓
KEEPER drafts reply (influenced by model of ALLY)
    ↓
KEEPER's text logged
    ↓
Observer models KEEPER
    ↓
observerModelOfKeeper updated
    ↓
Turn switches to ALLY
    ↓
ALLY's system prompt embeds observerModelOfKeeper
    ↓
[CYCLE REPEATS - beliefs continuously evolve]
```

**Trace Variable Flow (Actual Names):**
```javascript
orchestratorState.log.push({who: 'ALLY', text: '...'})  // Line 3815
    ↓
callModeler('ALLY')  // Line 3688
    ↓
orchestratorState.beliefs.observerModelOfAlly = payload.dims  // Line ~2750
    ↓
buildSystemPrompt('KEEPER', ...)  // Line 3760
    ↓
beliefOfOther = orchestratorState.beliefs.observerModelOfAlly  // Line 2511
    ↓
systemPrompt includes JSON.stringify(beliefOfOther)  // Line 2533
    ↓
llmReply('KEEPER', systemPrompt, ...)  // Line 3761
    ↓
KEEPER's completion influenced by ALLY's model
```

**Empirical test:**
1. Set breakpoint in `buildSystemPrompt()` after line 2511
2. Inspect `beliefOfOther` object
3. Compare to previous turn's value → should see drift
4. Log `systemPrompt` to console → see JSON embedded

### FUNC-ORB: Linear Lookup

```
User Presses Arrow Key
    ↓
avatar.row = newRow, avatar.col = newCol  // Line ~3040
    ↓
schedulePsychographUpdate(channel)  // Line ~3050
    ↓
const node = findNodeAtPosition(row, col)  // Line ~external file
    ↓
channel.trainingAxisValues = node.inner  // Direct assignment
    ↓
updateHexagonRadar(channel)  // Redraw canvas
    ↓
[USER SEES NEW RADAR SHAPE]
    ↓
[NO FEEDBACK - next move is independent of this]
```

**Trace Variable Flow (Actual Names):**
```javascript
e.key === 'ArrowRight' → newCol++  // Line 2972
    ↓
avatar.col = newCol  // Line 3039
    ↓
PSYCHOGRAPH_DATASET.find(n => n.coordinates.row === avatar.row && n.coordinates.col === avatar.col)  // External
    ↓
channel.trainingAxisValues[0] = node.inner[0]  // Array assignment
channel.trainingAxisValues[1] = node.inner[1]
// ... (all 6 axes)
    ↓
Canvas radar polygon redrawn
    ↓
[END - no recursion, no state evolution]
```

**Empirical test:**
1. Set `channel.trainingAxisValues = [5,5,5,5,5,5]` manually
2. Move avatar one cell
3. Values reset to dataset lookup (no memory of previous state)
4. Radar shape determined ONLY by current position, not history

---

## VII. Orchestration Evidence

### CB.HTML: Phased Sequencer

```javascript
// Line 3562-3602: Queue processing
async _processQueue() {
  while (this.queue.length) {
    const {turnInput, resolve} = this.queue.shift();
    const ctx = this._startTurn(turnInput);
    
    // FIXED PHASE SEQUENCE
    await this._phase('MEMO_REFRESH', async () => { await memoRefresh(ctx); });
    await this._phase('OBSERVE',      async () => { await observe(ctx); });
    await this._phase('MODEL',        async () => { await model(ctx); });
    
    if (!ctx.isHumanTurn) {
      await this._phase('PLAN',  async () => { await plan(ctx); });
      await this._phase('DRAFT', async () => { await draft(ctx); });
      await this._phase('SPEAK', async () => { await speakAI(ctx); });
    }
    
    await this._phase('SEND', async () => { await sendTurn(ctx); });
  }
}
```

**Evidence:**
- Central orchestrator class (Sequencer)
- Turn-based execution (one agent at a time)
- Phases run sequentially (MEMO → OBSERVE → MODEL → PLAN → DRAFT → SPEAK → SEND)
- `ctx` object carries data between phases
- `enqueueTurn()` serializes turns

**Logging instrumentation points:**
- Log `ctx` at start of each phase → see data flow
- Log `orchestratorState` before/after each phase → see state mutations
- Time each phase → identify bottlenecks

### FUNC-ORB: Event-Driven Handlers

```javascript
// Line 2965-3065: Keyboard handler
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') newRow--;
  // ... handle movement
  
  avatar.row = newRow;
  avatar.col = newCol;
  avatar.mesh.position.x = (newCol - 4) * CELL_SIZE;
  avatar.mesh.position.z = (newRow - 4) * CELL_SIZE;
  
  checkJunction(channel);
  handleCollision(channel);
  schedulePsychographUpdate(channel);
});
```

**Evidence:**
- No central orchestrator
- Direct event handlers (keydown, click, etc.)
- Immediate updates (no turn queue)
- Parallel channels (multiple 3D scenes can exist)
- No turn switching logic

**Logging instrumentation points:**
- Log every `keydown` event with `{key, avatar.row, avatar.col}`
- Log `channel.trainingAxisValues` before/after update
- Track FPS and render times

---

## VIII. Variable/Function Name Ontology

### CB.HTML: Conversational Domain

| Name | Type | Purpose | Evidence |
|------|------|---------|----------|
| `orchestratorState` | Object | Global state container | Line 2095 |
| `buildSystemPrompt` | Function | Constructs LLM prompt | Line 2508 |
| `llmReply` | Function | Calls OpenAI API | Line 2551 |
| `callModeler` | Function | Infers beliefs from conversation | Line 2630 |
| `callStrategyPlanner` | Function | Generates strategic options | Line 2808 |
| `selector` | Function | Chooses best option | Line 2900+ |
| `extractIntentAndAct` | Function | Parses discourse acts from text | Line 1802 |
| `jaccardTrigram` | Function | Measures text similarity | Line 1825 |
| `beliefs` | Object | Observer's models + self-models | Line 2098 |
| `lastActs` | Object | Recent discourse acts | Line 2109 |
| `memo` | String | Observer's situation summary | Line 2113 |
| `loopGuard` | Object | Prevents conversation loops | Line 2116 |
| `adjudication` | Object | Tracks release/termination | Line 2120 |

**Naming pattern:** Conversational/cognitive metaphors (beliefs, acts, memo, deliberation)

### FUNC-ORB: Spatial Domain

| Name | Type | Purpose | Evidence |
|------|------|---------|----------|
| `appState` | Object | Global state container | Line 1282 |
| `createChannel` | Function | Creates 3D viewport | Line 1705 |
| `avatar` | Object | Player position + mesh | Line 1715 |
| `gridCells` | Array | 9×9 cell objects | Line 1718 |
| `gridEntities` | Map | Entities on grid | Line 1287 |
| `trainingAxisValues` | Array | 6-axis radar values | Line 1727 |
| `schedulePsychographUpdate` | Function | Updates radar from position | External |
| `handleCollision` | Function | Checks for entity at position | Line ~2800 |
| `handleJunction` | Function | Displays track choice UI | Line ~2850 |
| `placeEntityOnGrid` | Function | Adds entity to grid | Line ~2750 |
| `updateHexagonRadar` | Function | Redraws canvas radar | External |

**Naming pattern:** Spatial/physical metaphors (avatar, grid, position, collision)

---

## IX. Summary: Why These Are Not Comparable

### CB.HTML is an **LLM-Agent Conversation System**:
- **Core mechanism:** LLM API calls with dynamic prompts
- **State:** Belief models (11-dimensional profiles)
- **Flow:** Turn-based with recursive belief updating
- **Observer:** Active (models agents, embeds in prompts)
- **Output:** Generative natural language
- **Purpose:** Simulate adversarial negotiation with adaptive agents

### FUNC-ORB is a **3D Spatial Navigation Interface**:
- **Core mechanism:** Keyboard input → position update → visual render
- **State:** Avatar coordinates + entity positions
- **Flow:** Real-time event-driven
- **Observer:** Passive (tracks stats, displays to user)
- **Output:** Deterministic radar updates
- **Purpose:** Explore conceptual space through spatial metaphor

---

## X. Empirical Validation Plan

### Tests for CB.HTML:

1. **Belief Evolution Test:**
   - Log `orchestratorState.beliefs.observerModelOfAlly` every turn
   - Assert: Values drift over conversation
   - Assert: Drift correlates with ALLY's discourse acts

2. **Prompt Embedding Test:**
   - Log full system prompt before each `llmReply()` call
   - Assert: Prompt contains `MODEL_OF_OTHER(JSON):`
   - Assert: JSON matches current belief state

3. **Relay Test:**
   - Enable relay mode
   - ALLY generates completion
   - Assert: `keeperInput.value === ALLY's completion`

4. **Loop Detection Test:**
   - Force ALLY to repeat same text 3 times
   - Assert: `loopGuard.forcePlannerDiversity === true`
   - Assert: Planner temperature increases

### Tests for FUNC-ORB:

1. **Position Determinism Test:**
   - Set avatar to (3, 5)
   - Read `channel.trainingAxisValues`
   - Move avatar away and back to (3, 5)
   - Assert: `trainingAxisValues` identical to first read

2. **No-LLM Test:**
   - Mock `fetch()` to throw error
   - User types "addfire"
   - Assert: Fire entity created (no API call needed)

3. **Observer Isolation Test:**
   - Set `appState.observerState.innerBalance.Instinct = 5.0`
   - Move avatar
   - Assert: Movement behavior unchanged
   - Assert: `trainingAxisValues` determined by position, not observer state

---

## Conclusion: Evidence-Based Ontology

**CB and ORB share SURFACE resemblances**:
- Both have "agents" (but different meanings)
- Both have "observers" (but different roles)
- Both visualize multi-dimensional data (but different mechanisms)

**CB and ORB have FUNDAMENTAL differences**:
- CB: **Generative** (LLM creates text) vs ORB: **Deterministic** (lookup returns data)
- CB: **Recursive** (beliefs → prompts → beliefs) vs ORB: **Linear** (position → display)
- CB: **Conversational** (turn-based language) vs ORB: **Spatial** (real-time navigation)
- CB: **Active observer** (models feed back) vs ORB: **Passive observer** (stats displayed)

**They are NOT the same type of system.** Comparing them is like comparing a chess AI (evaluates positions, generates moves) to a chess board UI (displays state, accepts clicks).

Both are valid software, but one is generative/cognitive, the other is representational/spatial.
