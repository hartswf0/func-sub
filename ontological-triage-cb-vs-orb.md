# Ontological Triage: cb.html vs func-orb-training.html

## Executive Summary: First vs Second Order Cybernetic Systems

**cb.html** implements a **second-order cybernetic system** with an Observer that models the modelers.
**func-orb-training.html** implements a **first-order cybernetic feedback loop** with aspirational observer components.

---

## I. AGENT ASSEMBLAGE FLOW (cb.html)

### Structural Members

```
ALLY ←→ GATEKEEPER (conversational agents)
        ↓
    OBSERVER (meta-agent that models both)
        ↓
    STRATEGIC PLANNER (generates options)
        ↓
    SELECTOR (chooses best option)
```

### Prompt → Completion Flow Trace

#### Phase 1: PLAN (Strategic Planning)
```javascript
async function plan(ctx) {
  // Input: Current context, memo, chat history
  const options = await callStrategyPlanner(
    role, memo, chatHistory, antiMirrorText,
    lastSelfAct, lastOtherAct, forceDiversity,
    coreConflict, currentObstacle
  )
  // Strategic Planner LLM constructs planning prompt
  // Output: Array of {text, act} options
  bus.emit({type:'PLAN/OPTIONS', role, options})
  
  const chosen = selector(options, ...)
  bus.emit({type:'PLAN/CHOSEN', role, option: chosen})
  ctx.chosenOption = chosen
}
```

**Key Insight**: The Strategic Planner receives:
- System prompt with role guidance
- Current memo (Observer's situational awareness)
- Last 4 messages
- Anti-mirror instructions
- Core conflict + current obstacle

**Output**: 4-6 discourse options (ASK, PROPOSE, EVALUATE, COMMIT, CHALLENGE, USE_CUNNING)

#### Phase 2: DRAFT (LLM Generation)
```javascript
async function draft(ctx) {
  // Input: Chosen directive from PLAN phase
  const sysPrompt = buildSystemPrompt(role, ctx.chosenOption.text)
  const res = await llmReply(role, sysPrompt, chatWindow(10))
  
  ctx.llmResult = {
    text: res.text,
    meta: {act, intent, directive: ctx.chosenOption.text}
  }
  bus.emit({type:'LLM/REPLY_OK', who:role, text, meta})
}
```

**Key Insight**: `buildSystemPrompt()` constructs a rich context:
- Base persona
- Conversation pact
- Observer's memo
- Last discourse acts
- **Observer's model of the OTHER agent** (JSON)
- **Self-model** (trait profile)
- Current directive from planner
- World lore (constraints, leitmotifs, taboos)

**This is the completion** - the LLM generates text based on:
1. Who I am (self-model)
2. Who I think they are (observer model of other)
3. What strategic goal I'm pursuing (directive)
4. What discourse pattern to use (act)

#### Phase 3: SPEAK (Relay & TTS)
```javascript
async function speakAI(ctx) {
  const currentText = sanitizeReply(ctx.llmResult.text)
  
  // RELAY MODE: Completion flows to other agent's input
  if (orchestratorState.policies.relayMode && role === 'ALLY') {
    keeperInput.value = currentText  // ALLY's completion → KEEPER's prompt
  }
  
  // TTS output
  if (role === 'ALLY' && allyTTS?.checked) {
    await speakTTS(currentText, allyVoice)
  }
}
```

**Key Insight**: **This is where context windows pass between agents**
- ALLY's completion → injected into KEEPER's input textarea
- KEEPER's completion → injected into ALLY's input textarea
- Creates a **prompt relay** architecture

#### Phase 4: SEND (Update Models & Adjudicate)
```javascript
async function sendTurn(ctx) {
  logAndRenderChatMessage(speakerWho, messageText, messageMeta)
  
  // Update observer's belief models
  await updateBeliefsAndEmit(orchestratorState, speakerWho)
  
  // Hidden adjudicator checks for release/termination
  orchestratorState = adjudicatorUpdate(orchestratorState, speakerWho, messageText)
  
  // Switch turn
  orchestratorState.turn = otherOf(speakerWho)
  
  // AUTO mode: enqueue next turn
  if (seq.mode === FlowMode.AUTO) {
    seq.enqueueTurn({ role: orchestratorState.turn })
  }
}
```

**Key Insight**: After each completion:
1. Observer **models the speaker** via `callModeler()` LLM
2. Observer updates beliefs (11-dimensional profile)
3. Adjudicator checks for termination conditions
4. Turn switches to other agent
5. Cycle repeats

---

## II. OBSERVER AS SECOND-ORDER CYBERNETICS

### The Observer's Modeling Architecture

```javascript
async function callModeler(aboutWhom) {
  const prompt = buildModelerPrompt(aboutWhom, chatSnippet)
  // Modeler LLM analyzes conversation and returns:
  return {
    dims: {openness, conscientious, extraversion, ...}, // 11 axes
    prior: {caution, progress},
    posterior: {caution, progress},
    myth: {archetypes, narrative},
    tone: "constructive|skeptical|emphatic|...",
    rationale: "..."
  }
}
```

**Second-Order Characteristic**:
- Observer **does not see its own modeling**
- Observer updates models of ALLY and KEEPER
- ALLY/KEEPER receive Observer's model of the OTHER
- Creates **mutual modeling** where each agent acts based on what Observer thinks they think

### Belief Flow Diagram

```
ALLY speaks → Observer models ALLY → belief stored
                                          ↓
KEEPER receives: "MODEL_OF_OTHER(ALLY)" in system prompt
KEEPER speaks → Observer models KEEPER → belief stored
                                          ↓
ALLY receives: "MODEL_OF_OTHER(KEEPER)" in system prompt
```

**This creates a second-order loop**:
- Each agent's behavior influences Observer's model
- Observer's model influences the OTHER agent's behavior
- System behavior emerges from this recursive modeling

### Strategic Planning as Observer's Intervention

The Strategic Planner is effectively the Observer's **executive function**:
- Generates options based on Observer's situational awareness (memo)
- Selector chooses based on:
  - Discourse act diversity
  - Addressing counterpart's intent
  - Breaking loops
  - Resolving core conflict

**Not a toy because**: The strategic layer has **consequences** - it shapes the actual prompts that generate completions, which then update the models, which then shape future prompts.

---

## III. FUNC-ORB-TRAINING.HTML AS FIRST-ORDER TOY

### Spatial Feedback Architecture

```javascript
// Position determines psychograph update
window.schedulePsychographUpdate = function(channel) {
  if (channel.avatar) {
    const { row, col } = channel.avatar
    const node = findNodeAtPosition(row, col)
    if (node) {
      // Update hexagon radar based on node data
      updateHexagonRadar(channel, node.inner, node.outer)
    }
  }
}
```

**First-Order Characteristic**:
- Input: Avatar position on 9×9 grid
- Process: Lookup node data
- Output: Update 6-axis radar display
- **No modeling of the observer by the observed**
- **No recursive belief updating**

### Channel Architecture

```javascript
const appState = {
  channels: new Map(),  // Multiple viewports
  gridEntities: new Map(),  // Spatial entities on grid
  observers: new Map()  // Local observer state per channel
}
```

**Observer is aspirational but not recursive**:
```javascript
appState.observerState = {
  innerBalance: {...},  // 6 axes
  outerBalance: {...},  // 6 axes
  stageCounts: {SHED: 0, INTEGRATE: 0, GROUND: 0},
  placementHistory: [],
  imbalances: []
}
```

**Why it's a toy**:
1. **No agent modeling** - Observer tracks statistics, not beliefs
2. **No strategic planning** - No LLM-generated options
3. **No prompt relay** - Chat is simple command interface
4. **No adjudication** - No termination conditions based on conversation dynamics
5. **Deterministic feedback** - Position → Radar (no uncertainty, no interpretation)

### "Scene" Structure ≠ Agent Assemblage

```javascript
// Three scenes: INNER, OUTER, OBSERVER
innerScene.systemPrompt = "You are the INNER..."
outerScene.systemPrompt = "You are the OUTER..."
observerScene.systemPrompt = "You are the OBSERVER apparatus..."
```

**But**: These are **system prompts for display**, not for recursive modeling:
- No LLM calls to update beliefs
- No prompt chaining between scenes
- Observer scene just displays aggregated stats
- Scene switching is UI navigation, not cognitive perspective shift

---

## IV. ONTOLOGICAL DISTINCTIONS

### Entity Categories

| Entity Type | cb.html | func-orb-training.html |
|-------------|---------|------------------------|
| **Agents** | ALLY, GATEKEEPER (with beliefs) | Channels (with spatial state) |
| **Observer** | Modeler + Planner (recursive) | Stat tracker (accumulative) |
| **Beliefs** | 11-dim psychograph (updated via LLM) | 6-dim radar (updated via position) |
| **Prompts** | Context windows that relay | System prompts for UI |
| **Completions** | Text that updates models | Chat responses (no modeling) |
| **Memory** | Orchestrator state + log | appState + channel messages |

### Sub-Entity: Discourse Acts

cb.html implements **discourse acts** as ontological primitives:
```javascript
['ASK', 'PROPOSE', 'EVALUATE', 'COMMIT', 'CHALLENGE', 'USE_CUNNING']
```

These structure the conversation space and enable:
- Act tracking for diversity
- Loop detection (repeated acts)
- Strategic planning (act selection)

func-orb has **no discourse ontology** - just spatial commands.

### Scene Graph Comparison

#### cb.html Scene Graph
```
OrchestratorState
├── beliefs
│   ├── observerModelOfAlly (11-dim)
│   ├── observerModelOfKeeper (11-dim)
│   ├── allySelf (11-dim, self-belief)
│   └── keeperSelf (11-dim, self-belief)
├── log (conversation transcript + MODEL/UPDATED + PLAN events)
├── memo (Observer's situational summary)
├── adjudication {released, terminated, reason}
├── lastActs {ALLY, KEEPER}
├── lastIntentFromOther {ALLY, KEEPER}
├── policies {useLLM, relayMode, strategicPlanning, ...}
└── loopGuard {count, forcePlannerDiversity}
```

**Depth**: 3-4 levels of nesting
**Recursion**: Observer models agents, agents receive other's model
**Temporal**: Log tracks belief evolution over time

#### func-orb Scene Graph
```
appState
├── channels (Map)
│   └── channel
│       ├── gridCells (81 cells)
│       ├── avatar {row, col}
│       ├── messages []
│       ├── trainingAxisValues [6]
│       └── systemPrompt (string)
├── gridEntities (Map)
│   └── entities [{type, label, row, col}]
└── observerState
    ├── innerBalance {6 axes}
    ├── outerBalance {6 axes}
    ├── stageCounts {SHED, INTEGRATE, GROUND}
    └── placementHistory []
```

**Depth**: 2-3 levels of nesting
**Recursion**: None - Observer accumulates, doesn't model
**Temporal**: Messages list, but no belief evolution tracking

---

## V. STRUCTURAL ISOMORPHISMS

### Family Resemblances

1. **Multi-Agent Structure**
   - cb.html: ALLY, GATEKEEPER, OBSERVER (3 agents)
   - func-orb: INNER, OUTER, OBSERVER (3 channels/scenes)

2. **Radar Visualization**
   - cb.html: 11-axis radar for psychograph
   - func-orb: 6-axis hexagon radar

3. **Situational Awareness**
   - cb.html: Observer's memo (narrative summary)
   - func-orb: Observer's balance tracking (numeric)

4. **Phase-Based Processing**
   - cb.html: PLAN → DRAFT → SPEAK → SEND (sequencer)
   - func-orb: Train navigation through grid (spatial sequencing)

5. **External Dependencies**
   - cb.html: OpenAI API for LLM calls
   - func-orb: Three.js for 3D rendering, Tone.js for audio

### Primary Architectural Differences

| Dimension | cb.html | func-orb-training.html |
|-----------|---------|------------------------|
| **Cybernetic Order** | Second-order (Observer models agents) | First-order (Position updates display) |
| **Prompt Flow** | Relay between agents (context passing) | No relay (isolated commands) |
| **LLM Integration** | 3 LLM calls per turn (Planner, Drafter, Modeler) | Optional LLM for chat responses |
| **Belief Updating** | Recursive (models update after each turn) | None (stats accumulate) |
| **Strategic Layer** | Strategic Planner generates options | No strategic layer |
| **Adjudication** | Hidden adjudicator with release conditions | No termination logic |
| **Memory Type** | Conversational (transcript + belief evolution) | Spatial (position history) |
| **Interaction Mode** | Turn-based conversation | Spatial navigation |

---

## VI. UPSTREAM ARCHITECTURAL DIFFERENCES

### Why cb.html Cannot Be a "Toy"

1. **State-Dependent Behavior**: Each completion depends on:
   - Observer's current belief models (accumulated over turns)
   - Chosen strategic directive (from option space)
   - Counterpart's last intent (reactive stance)
   - Self-belief adjustments (internal feedback)

2. **Emergent Outcomes**: The system can:
   - Reach release/termination conditions
   - Detect conversational loops
   - Generate novel strategies under diversity pressure
   - Model archetypes and narrative myths

3. **Non-Deterministic Path**: Same initial scenario can:
   - Converge differently based on model updates
   - Generate different plans under loop-breaking pressure
   - Terminate at different turn counts
   - Create different mythic narratives

4. **Observer Has Consequences**: The Observer's models:
   - **Directly shape agent prompts** (not just display)
   - Influence strategic planning (memo context)
   - Trigger adjudication (belief-based conditions)
   - Create feedback loops (models affect behavior affect models)

### Why func-orb IS a "Toy"

1. **Deterministic Mapping**: Position → Radar update is a lookup
2. **No Recursive Modeling**: Observer doesn't model the agents modeling back
3. **Display-Only Observer**: Stats are shown but don't influence behavior
4. **Training Ground**: Explicitly designed for exploration, not outcome
5. **No Termination**: No winning/losing conditions based on dynamics
6. **Spatial Metaphor**: Grid navigation is a **metaphor for conceptual space**, not a generative system

---

## VII. DIFFERENCES THAT MAKE THE DIFFERENCE

### First vs Second Order Cybernetics

**First-order (func-orb)**:
```
Actor → Action → Feedback → Display
  ↓
Position changes → Radar updates → User sees
```

**No closure**: The observer is outside the system.

**Second-order (cb.html)**:
```
ALLY → Completion → Observer models ALLY → Model enters KEEPER's prompt → KEEPER responds → Observer models KEEPER → Model enters ALLY's prompt → ...
```

**Closure**: The observer is **inside** the system, and **the system models the observer's modeling**.

### Prompt Context as Ontological Boundary

In cb.html, the **context window** is the **unit of agency**:
- Each agent receives a system prompt with embedded models
- The prompt **is** the agent's "mind" at that moment
- Completions are **responses from that mind-state**
- Mind-state evolves via Observer's updates

In func-orb, there is **no persistent mind-state**:
- Channel state is spatial position + message history
- System prompts are static templates
- No belief models embedded in prompts
- No strategic planning layer

### Relay as Prompt Chaining

The **relayMode** in cb.html creates a **prompt chain**:
```
ALLY prompt → ALLY completion → KEEPER prompt (includes completion) → KEEPER completion → ALLY prompt (includes completion) → ...
```

This is **not** present in func-orb, which has isolated command processing.

---

## VIII. SCAFFOLDING FOR COMPARISON

### Ontological Triage Unit (OTU)

To compare any two agent systems, assess:

1. **Modeling Order**: Does the observer model? Do agents model the observer modeling?
2. **Prompt Architecture**: Are completions injected into other agents' prompts?
3. **Belief Representation**: Are beliefs symbolic/structured or just statistics?
4. **Strategic Layer**: Is there planning/option generation, or just reactive response?
5. **Adjudication**: Are there termination conditions based on internal state?
6. **Temporal Depth**: Is there a log of belief evolution, or just current state?
7. **Causal Closure**: Does the observer's output affect the system's next input?

### Applying OTU to cb.html vs func-orb

| OTU Dimension | cb.html | func-orb-training.html |
|---------------|---------|------------------------|
| Modeling Order | 2nd (Observer models agents, agents act on models) | 1st (Observer tracks, no feedback) |
| Prompt Architecture | Relay (completions → prompts) | Isolated (no chaining) |
| Belief Representation | Structured (JSON profiles, myths, archetypes) | Numerical (axis values) |
| Strategic Layer | Yes (Planner + Selector) | No (command parser) |
| Adjudication | Yes (release/termination logic) | No (open-ended navigation) |
| Temporal Depth | Full log with belief snapshots | Message history + position trail |
| Causal Closure | Yes (Observer → Prompt → Completion → Observer) | No (Position → Display only) |

---

## IX. CONCLUSION

**cb.html** is a **second-order cybernetic apparatus** where:
- The Observer models the agents
- The agents receive and act on those models
- Completions from one agent become prompts for another
- Strategic planning shapes prompt construction
- Beliefs evolve recursively through conversation

**func-orb-training.html** is a **first-order spatial navigation toy** where:
- The Observer tracks statistics
- Agents (channels) navigate a grid
- Position determines radar display
- No recursive modeling or prompt relay
- "Observer" is aspirational but not cybernetically closed

The **family resemblances** (3-agent structure, radar visualization, phase-based processing) **disguise the fundamental difference**: cb.html implements **observer-in-the-loop** while func-orb implements **observer-on-the-side**.

**The difference that makes the difference**: In cb.html, **the Observer's completions become the Agents' prompts**. In func-orb, **the Observer's displays remain outside the Agent's decision loop**.

This is the boundary between a **generative agent assemblage** and a **representational training ground**.
