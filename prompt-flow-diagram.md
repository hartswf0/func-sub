# Prompt-to-Completion Flow Diagrams

## CB.HTML: Second-Order Cybernetic Prompt Relay

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR STATE                            │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │ allySelf    │  │ keeperSelf  │  │ memo         │            │
│  │ (11-dim)    │  │ (11-dim)    │  │ (narrative)  │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │ modelOfAlly │  │ modelOfKeep │  │ lastActs     │            │
│  │ (Observer)  │  │ (Observer)  │  │ {A, K}       │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        TURN BEGINS                               │
│                     role = 'ALLY'                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: PLAN (Strategic Planner LLM)                          │
│  ┌────────────────────────────────────────────────────┐         │
│  │ Input Prompt:                                       │         │
│  │ • Role: ALLY                                        │         │
│  │ • Memo: [Observer's situation summary]             │         │
│  │ • Chat snippet: [last 4 messages]                  │         │
│  │ • Last acts: ALLY=PROPOSE, KEEPER=CHALLENGE        │         │
│  │ • Core conflict: "Ally seeks autonomy..."          │         │
│  │ • Current obstacle: "Gatekeeper's refusal..."      │         │
│  └────────────────────────────────────────────────────┘         │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │ Completion:                                         │         │
│  │ [                                                   │         │
│  │   {text: "Clarify which rule blocks...", act:ASK}, │         │
│  │   {text: "Propose concrete step...", act:PROPOSE}, │         │
│  │   {text: "Commit to checkpoint...", act:COMMIT}    │         │
│  │ ]                                                   │         │
│  └────────────────────────────────────────────────────┘         │
│                              │                                   │
│                              ▼                                   │
│  SELECTOR chooses: {text: "Propose...", act: PROPOSE}          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: DRAFT (Main Agent LLM)                                │
│  ┌────────────────────────────────────────────────────┐         │
│  │ System Prompt Construction:                        │         │
│  │ ┌────────────────────────────────────────────┐    │         │
│  │ │ BASE_PERSONA: [scenario sys prompt]        │    │         │
│  │ │ PACT: [conversation rules]                 │    │         │
│  │ │ CONTEXT: [memo from Observer]              │    │         │
│  │ │ YOUR_LAST_ACT: PROPOSE                     │    │         │
│  │ │ COUNTERPART_INTENT: challenge_authority    │    │         │
│  │ │ MODEL_OF_OTHER: {                          │    │         │
│  │ │   "authority": 4.2,                        │    │         │
│  │ │   "empathy": 2.1,                          │    │         │
│  │ │   "decisiveness": 4.5,                     │    │         │
│  │ │   ...                                      │    │         │
│  │ │ }                                          │    │         │
│  │ │ TRAIT_PROFILE: {                           │    │         │
│  │ │   "authority": 2.3,                        │    │         │
│  │ │   "empathy": 4.1,                          │    │         │
│  │ │   ...                                      │    │         │
│  │ │ }                                          │    │         │
│  │ │ FOCUS_THIS_TURN: "Propose concrete step..." │    │         │
│  │ └────────────────────────────────────────────┘    │         │
│  │                                                    │         │
│  │ User messages: [windowed chat history]            │         │
│  └────────────────────────────────────────────────────┘         │
│                              │                                   │
│                              ▼                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │ Completion:                                         │         │
│  │ "I propose we implement a trial period where I     │         │
│  │  can demonstrate autonomy under observation, with   │         │
│  │  clear checkpoints every 24 hours."                │         │
│  └────────────────────────────────────────────────────┘         │
│                              │                                   │
│                    stored in ctx.llmResult                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: SPEAK (Relay to Other Agent)                          │
│  ┌────────────────────────────────────────────────────┐         │
│  │ if (relayMode && role === 'ALLY'):                 │         │
│  │   keeperInput.value = sanitize(ctx.llmResult.text) │         │
│  └────────────────────────────────────────────────────┘         │
│                              │                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │ KEEPER's input textarea now contains:              │         │
│  │ "I propose we implement a trial period where I     │         │
│  │  can demonstrate autonomy under observation, with   │         │
│  │  clear checkpoints every 24 hours."                │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: SEND (Update Models & Switch Turn)                    │
│  ┌────────────────────────────────────────────────────┐         │
│  │ 1. Log message to transcript                       │         │
│  │ 2. Call Modeler LLM to update observerModelOfAlly  │         │
│  │ 3. Adjudicator checks for release/termination      │         │
│  │ 4. orchestratorState.turn = 'KEEPER'               │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT TURN BEGINS                              │
│                     role = 'KEEPER'                              │
│  ┌────────────────────────────────────────────────────┐         │
│  │ KEEPER's prompt will now include:                  │         │
│  │ • Updated MODEL_OF_OTHER (ALLY) from Observer      │         │
│  │ • ALLY's message in chat history                   │         │
│  │ • ALLY's completion already in KEEPER's input box  │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                          [cycle repeats]
```

---

## FUNC-ORB-TRAINING.HTML: First-Order Spatial Feedback

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP STATE                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐            │
│  │ channels    │  │ gridEntities│  │ observers    │            │
│  │ (Map)       │  │ (Map)       │  │ (Map)        │            │
│  └─────────────┘  └─────────────┘  └──────────────┘            │
│  ┌─────────────────────────────────────────────────┐            │
│  │ observerState:                                   │            │
│  │ • innerBalance: {axis1: 0.3, ...}               │            │
│  │ • outerBalance: {axis1: 0.3, ...}               │            │
│  │ • stageCounts: {SHED:0, INTEGRATE:0, GROUND:0}  │            │
│  │ • placementHistory: []                          │            │
│  └─────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER MOVES AVATAR                             │
│              avatar.row = 4, avatar.col = 6                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│           schedulePsychographUpdate(channel)                     │
│  ┌────────────────────────────────────────────────────┐         │
│  │ 1. Find node at position (4, 6)                    │         │
│  │ 2. node = PSYCHOGRAPH_DATASET.known_nodes[index]   │         │
│  │ 3. Extract node.inner and node.outer               │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              updateHexagonRadar(channel, inner, outer)           │
│  ┌────────────────────────────────────────────────────┐         │
│  │ channel.trainingAxisValues = inner  // or outer    │         │
│  │ // [0.5, 0.7, 0.3, 0.8, 0.4, 0.6]                  │         │
│  │                                                     │         │
│  │ Redraw canvas radar with new values                │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER SEES UPDATED RADAR                       │
│                   (Hexagon shape changes)                        │
│                                                                  │
│                   NO PROMPT CONSTRUCTION                         │
│                   NO LLM COMPLETION                              │
│                   NO BELIEF MODELING                             │
│                   NO AGENT-TO-AGENT RELAY                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              USER TYPES CHAT COMMAND                             │
│                  "show observer"                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              sendMessageWithLEGOS(channel, text)                 │
│  ┌────────────────────────────────────────────────────┐         │
│  │ if (text === 'show observer'):                     │         │
│  │   response = formatObserverState(appState)         │         │
│  │   // Just formats existing stats, no LLM call      │         │
│  │   addMessage(channel, 'system', response)          │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               DISPLAY OBSERVER STATS IN CHAT                     │
│                                                                  │
│  INNER balance:   {axis1: 0.3, axis2: 0.4, ...}                 │
│  OUTER balance:   {axis1: 0.5, axis2: 0.2, ...}                 │
│  Stage counts:    SHED=3, INTEGRATE=1, GROUND=0                 │
│                                                                  │
│         (Static display, no feedback to agent behavior)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Structural Differences

### CB.HTML (Second-Order)

1. **Prompt = Agent Mind State**
   - System prompt contains: base persona + observer models + self-model + directive
   - Each turn reconstructs entire cognitive context

2. **Completion = Agent Utterance**
   - Generated from rich context
   - Immediately becomes input to OTHER agent
   - Updates Observer's models

3. **Observer in the Loop**
   - Observer's models **enter** agent prompts
   - Models **shape** agent behavior
   - Agent behavior **updates** models
   - **Recursive closure**

4. **Context Window Relay**
   - ALLY completion → KEEPER input textarea
   - Creates **chained prompting** architecture
   - Each agent's output becomes other's prompt context

### FUNC-ORB (First-Order)

1. **Position = Agent State**
   - Simple spatial coordinates
   - No belief representation

2. **Radar Update = Display Feedback**
   - Deterministic lookup from position
   - No interpretation or uncertainty
   - No generative component

3. **Observer on the Side**
   - Observer tracks statistics
   - Stats displayed to USER
   - Stats **do not enter** agent decision logic
   - **No closure**

4. **No Prompt Architecture**
   - System prompts are static templates for UI
   - No LLM-generated completions from context
   - No agent-to-agent message passing
   - Commands parsed locally

---

## The Critical Distinction

### CB.HTML: Observer's Model → Agent's Prompt

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   OBSERVER   │────────▶│  ALLY PROMPT │────────▶│ ALLY SPEAKS  │
│  models      │  embed  │   contains   │  LLM    │  completion  │
│  KEEPER      │  model  │   model of   │  call   │              │
│              │         │   KEEPER     │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
                                                           │
                                                           │ relay
                                                           ▼
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   OBSERVER   │◀────────│ KEEPER PROMPT│◀────────│ KEEPER INPUT │
│  models      │  embed  │   contains   │  sees   │   box        │
│  ALLY        │  model  │   model of   │  ALLY's │              │
│              │         │   ALLY       │  message│              │
└──────────────┘         └──────────────┘         └──────────────┘
```

**The Observer's output becomes an Agent's input context.**

### FUNC-ORB: Observer's Stats → User's Display

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   OBSERVER   │────────▶│  RADAR CANVAS│────────▶│  USER SEES   │
│  tracks      │  update │   displays   │ render  │   hexagon    │
│  balance     │  pixels │   axis values│         │              │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
                                                           │
                                                           │ no feedback
                                                           ▼
┌──────────────┐                                   ┌──────────────┐
│   AVATAR     │                                   │  POSITION    │
│  decision    │◀──────────────────────────────────│  unchanged   │
│  logic       │          (user input only)        │              │
│              │                                   │              │
└──────────────┘                                   └──────────────┘
```

**The Observer's output goes to the USER, not back into the system.**

---

## Ontological Status

### CB.HTML: Generative Agent Assemblage
- Agents generate behavior from context
- Context includes models of other agents
- Behavior updates models
- Models update context
- **System is self-modifying**

### FUNC-ORB: Interactive Training Visualization
- Agents (channels) navigate space
- Space updates display
- Display informs user
- User navigates space
- **System is user-driven**

The difference: **Who closes the loop?**
- CB.HTML: The Observer closes the loop (second-order)
- FUNC-ORB: The User closes the loop (first-order with external operator)
