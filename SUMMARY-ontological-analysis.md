# Summary: Ontological Analysis of CB vs FUNC-ORB

## The Question

**How is `/Users/gaia/FUNC-SUB/func-orb-training.html` a toy while `cb.html` is not?**

**What are the family resemblances, primary differences, and architectural upstream differences between them?**

---

## TL;DR Answer

**CB.HTML** is a **second-order cybernetic system** where:
- An Observer models two conversational agents (ALLY, GATEKEEPER)
- The Observer's models are **embedded into agent prompts**
- Agent completions **relay between agents** as context
- Strategic planning **generates options** before each utterance
- Beliefs **evolve recursively** through conversation
- The system exhibits **emergent dynamics** (loops, drift, adjudication)

**FUNC-ORB-TRAINING.HTML** is a **first-order training ground** where:
- An Observer tracks statistics across three channels (INNER, OUTER, OBSERVER)
- The Observer's stats are **displayed to the user**
- Avatar position **determines radar display** via lookup
- Navigation is **user-driven** without strategic layer
- No recursive modeling or belief updating
- The system is **deterministic** with finite state space

**CB is not a toy because**: The Observer's outputs become inputs to the agents, creating recursive causality. The system is generative and path-dependent.

**ORB is a toy because**: The Observer's outputs go to the user display only. The system is a visualization tool with finite, explorable state space.

---

## Three Core Documents

I've created three detailed analyses:

### 1. **ontological-triage-cb-vs-orb.md**
- Complete flow trace from prompt → completion
- Observer as second-order cybernetics
- ORB as first-order spatial feedback
- Entity categories and scene graphs
- Ontological Triage Unit (OTU) framework

### 2. **prompt-flow-diagram.md**
- Visual diagrams of prompt/completion flow
- CB: Phase-by-phase sequencer walkthrough
- ORB: Position-to-radar deterministic mapping
- Key structural differences highlighted
- "Who closes the loop?" analysis

### 3. **architectural-ancestry.md**
- Upstream sources (dialogue systems, theory of mind, spatial metaphors)
- Why CB cannot be reduced to a toy
- Why ORB is correctly called a toy
- Structural isomorphisms (family resemblances)
- Convergence/divergence design patterns

---

## Agent Assemblage Flow (CB.HTML)

```
USER INPUT (or AUTO-TRIGGER)
    ↓
┌───────────────────────────────────┐
│  SEQUENCER (manages phases)       │
│  Mode: MANUAL | CONFIRM | AUTO    │
└───────────────────────────────────┘
    ↓
PHASE 1: MEMO_REFRESH
    ↓ [Observer updates situational memo]
    ↓
PHASE 2: OBSERVE
    ↓ [Current turn set, UI updated]
    ↓
PHASE 3: MODEL
    ↓ [Modeler LLM updates Observer's belief of speaker]
    ↓ [Beliefs: 11-dimensional profile + myth + archetypes]
    ↓
PHASE 4: PLAN (for AI turns only)
    ↓ [Strategic Planner LLM generates 4-6 options]
    ↓ [Input: memo, conflict, obstacle, last acts, diversity flag]
    ↓ [Output: {text, act} options array]
    ↓ [SELECTOR chooses best option based on scoring]
    ↓
PHASE 5: DRAFT (for AI turns only)
    ↓ [Main Agent LLM generates completion]
    ↓ [Input: System prompt with embedded beliefs]
    ↓    • Base persona
    ↓    • Observer's model of OTHER agent (JSON)
    ↓    • Self-belief (trait profile)
    ↓    • Chosen directive from planner
    ↓    • Last acts, intents, memo
    ↓ [Output: Natural language completion]
    ↓
PHASE 6: SPEAK (for AI turns only)
    ↓ [RELAY MODE: Completion → Other agent's input box]
    ↓ [TTS: Speak completion if voice enabled]
    ↓
PHASE 7: SEND (for all turns)
    ↓ [Log message to transcript]
    ↓ [Update Observer's model of speaker]
    ↓ [Adjudicator checks for release/termination]
    ↓ [Switch turn to other agent]
    ↓ [If AUTO mode: Enqueue next turn]
    ↓
[CYCLE REPEATS until release or termination]
```

**Key Insight**: Each agent's **completion becomes the other agent's prompt context**. This creates a **second-order feedback loop** where:
1. ALLY speaks → Observer models ALLY
2. Observer's model embedded in KEEPER's prompt
3. KEEPER responds based on model of ALLY
4. Observer models KEEPER
5. Observer's model embedded in ALLY's prompt
6. ALLY responds based on model of KEEPER
7. [Recursive loop]

---

## Spatial Feedback Flow (FUNC-ORB)

```
USER INPUT (keyboard/mouse)
    ↓
AVATAR MOVES ON GRID
    ↓ [Position: row, col updated]
    ↓
schedulePsychographUpdate(channel)
    ↓ [Find node at position]
    ↓ [node = PSYCHOGRAPH_DATASET.known_nodes[index]]
    ↓
updateHexagonRadar(channel, node.inner, node.outer)
    ↓ [channel.trainingAxisValues = node.inner or node.outer]
    ↓ [Deterministic assignment, no inference]
    ↓
CANVAS RADAR REDRAWN
    ↓ [Hexagon shape changes based on 6 axis values]
    ↓
USER SEES UPDATED DISPLAY
    ↓ [No feedback to avatar behavior]
    ↓ [No LLM calls]
    ↓ [No belief modeling]
    ↓
[USER NAVIGATES TO NEXT POSITION]
```

**Key Insight**: Position determines display. Display informs user. User navigates. **No recursive loop within the system** — the loop goes through the human operator.

---

## The Critical Distinction

### CB: Observer in the Loop

```
┌─────────┐   models   ┌──────────┐   embedded   ┌───────────┐
│ OBSERVER│──────────→ │  BELIEFS │ ────────────→│ALLY PROMPT│
└─────────┘            └──────────┘              └───────────┘
     ↑                                                   │
     │                                                   │ LLM
     │                                                   ↓
     │                                            ┌───────────┐
     │                                            │   ALLY    │
     │                                            │COMPLETION │
     │                                            └───────────┘
     │                                                   │
     │                                                   │ relay
     │                                                   ↓
     │                                            ┌───────────┐
     │                                            │  KEEPER   │
     │                                            │   INPUT   │
     │                                            └───────────┘
     │                                                   │
     │                                                   │ LLM
     │  updates                                          ↓
     │  models                                    ┌───────────┐
     └────────────────────────────────────────── │  KEEPER   │
                                                 │COMPLETION │
                                                 └───────────┘
```

**Recursion**: Observer → Beliefs → Prompts → Completions → Observer

### ORB: Observer on the Side

```
┌─────────┐   tracks   ┌──────────┐   displays  ┌───────────┐
│ OBSERVER│──────────→ │  STATS   │────────────→│   USER    │
└─────────┘            └──────────┘             └───────────┘
     ↑                                                  │
     │                                                  │
     │                                                  │ navigates
     │                                                  ↓
     │                                           ┌───────────┐
     │                                           │  AVATAR   │
     │                                           │ POSITION  │
     │                                           └───────────┘
     │                                                  │
     │                                                  │ lookup
     │                                                  ↓
     │                                           ┌───────────┐
     │  updates                                  │   RADAR   │
     │  stats                                    │  UPDATE   │
     └───────────────────────────────────────── └───────────┘
```

**No recursion**: Observer → Stats → Display → User → Position → Observer (loop exits to human)

---

## Family Resemblances (Structural Isomorphisms)

Both systems share surface-level patterns:

| Pattern | CB Implementation | ORB Implementation |
|---------|-------------------|-------------------|
| **Three agents** | ALLY, GATEKEEPER, OBSERVER | INNER, OUTER, OBSERVER channels |
| **Radar visualization** | 11-axis psychograph | 6-axis hexagon |
| **Phase-based flow** | PLAN→DRAFT→SPEAK→SEND | Navigate→Collision→Decision |
| **Observer component** | Models beliefs recursively | Tracks stats descriptively |
| **Situational awareness** | Narrative memo | Balance statistics |
| **Multi-viewport UI** | 3 chat panels | 3 scrollable columns |

**Why these resemblances?**
- Dialectic structure (thesis/antithesis/synthesis)
- Dimensional reduction for visualization
- Legible process sequencing
- Meta-level observation need

---

## Primary Differences (Ontological)

| Dimension | CB.HTML | FUNC-ORB |
|-----------|---------|----------|
| **Cybernetic order** | Second-order (Observer models agents) | First-order (Position updates display) |
| **Prompt architecture** | Context relay between agents | Static templates for UI |
| **LLM integration** | 3 calls/turn (Planner, Drafter, Modeler) | Optional chat responses |
| **Belief representation** | Structured (JSON + myths + archetypes) | Numerical (axis arrays) |
| **Strategic layer** | Planner generates options, Selector chooses | No planning layer |
| **Memory type** | Conversational (transcript + belief snapshots) | Spatial (position history) |
| **State space** | Unbounded (conversation divergence) | Finite (81 positions × 3 operations) |
| **Dynamics** | Emergent (loops, drift, adjudication) | Deterministic (lookup) |
| **Closure** | Observer in system loop | Observer outside (user closes loop) |

---

## Architectural Upstream Differences

### CB's Foundations
1. **Dialogue Systems**: Turn-taking, context management, prompt engineering
2. **Theory of Mind**: Agents maintain beliefs about other agents' beliefs
3. **Probabilistic Inference**: Bayesian belief updating (Tenenbaum's PLoT)
4. **Semiotics**: Barthesian myths, archetypes, narrative framing
5. **Discourse Analysis**: Speech acts, pragmatic intents

**Design Decision**: Model agents as **conversational minds with beliefs**

### ORB's Foundations
1. **3D Visualization**: Three.js, spatial rendering, camera controls
2. **Conceptual Space Theory**: Concepts as regions in dimensional space
3. **Psychograph Profiling**: Multi-axis radar charts
4. **Game-Based Learning**: Training ground, exploration, scaffolding
5. **Knowledge Graphs**: Node/edge structures, coordinate-based access

**Design Decision**: Model concepts as **positions in navigable space**

---

## Why CB Is Not a Toy

### 1. Non-Trivial State Space
- 44 continuous belief dimensions (4 agents × 11 axes)
- Arbitrary-depth history (log with nested events)
- Path-dependent outcomes (same scenario → different endings)
- **Effectively infinite state space**

### 2. Emergent Dynamics
- **Belief drift**: Models change → prompts change → behavior changes
- **Loop detection**: System recognizes repetition → forces diversity
- **Strategic adaptation**: Selector learns from directive history
- **Adjudication emergence**: Release/termination from conversation dynamics

### 3. Observer Has Agency
- Generates memo (shapes planning context)
- Updates beliefs (alters prompt embeddings)
- Plans strategically (creates option space)
- Adjudicates (determines outcomes)

**The Observer is an active participant**, not a passive display.

### 4. Generative, Not Scripted
- Completions generated from context, not templated
- Strategic options created per turn, not pre-enumerated
- Outcomes depend on conversation path, not initial conditions
- Myths/narratives emergent from interaction, not assigned

---

## Why ORB Is Correctly a Toy

### 1. Deterministic Mapping
- Position (row, col) → Radar values (lookup)
- No inference, interpretation, or uncertainty
- All 81 positions have known nodes

### 2. Finite State Space
- 81 positions × 3 operations = ~243 configurations
- Complete map is explorable
- No emergent complexity

### 3. Observer Without Consequences
- Stats tracked but don't affect avatar behavior
- Display informs user, not system
- No feedback into decision logic

### 4. Pedagogical Purpose
- Designed as **training ground** (explicit name)
- Teaches conceptual navigation metaphor
- Supports learning, not generative outcomes

**ORB is a high-quality educational tool**, but it's toy-sized in state complexity and has no recursive modeling.

---

## The Ontological Triage Unit (OTU)

To assess any agent system's status, evaluate:

1. **Modeling Order**: Does observer model? Do agents model the observer modeling?
2. **Prompt Architecture**: Are completions injected into other agents' prompts?
3. **Belief Representation**: Symbolic/structured or just statistics?
4. **Strategic Layer**: Planning/option generation or reactive response?
5. **Adjudication**: Termination based on internal state or external conditions?
6. **Temporal Depth**: Log of belief evolution or just current state?
7. **Causal Closure**: Does observer's output affect system's next input?

**Applying OTU**:

| Criterion | CB | ORB |
|-----------|----|----|
| Modeling order | ✓ 2nd order | ✗ 1st order |
| Prompt relay | ✓ Yes | ✗ No |
| Belief structure | ✓ Rich | ✗ Thin |
| Strategic layer | ✓ Yes | ✗ No |
| Adjudication | ✓ Internal | ✗ None |
| Temporal depth | ✓ Full log | ✗ Message list |
| Causal closure | ✓ Yes | ✗ No (via user) |

---

## Conclusion

**The difference that makes the difference**:

> **In CB, the Observer's models become the Agents' prompts.**  
> **In ORB, the Observer's stats become the User's display.**

This distinction separates:
- **Second-order from first-order cybernetics**
- **Recursive modeling from simple feedback**
- **Generative assemblage from interactive visualization**
- **Systems that think about thinking from systems that show what they track**

**CB.HTML** is a **second-order cybernetic apparatus** with recursive agent modeling, emergent dynamics, and strategic planning. It exhibits path-dependent outcomes and non-trivial complexity.

**FUNC-ORB-TRAINING.HTML** is a **first-order spatial explorer** with deterministic feedback, finite state space, and pedagogical focus. It's a training ground that teaches through navigation.

**Both are valuable, but only CB is a cybernetic agent assemblage in the full sense.**

ORB's "Observer" has aspirational architecture that **looks like** CB's Observer (hence the family resemblance), but it **functions differently** — it tracks rather than models, displays rather than embeds, describes rather than generates.

**The boundary between toy and tool is the boundary between display and decision**.

---

## Files Created

1. **ontological-triage-cb-vs-orb.md** — Comprehensive ontological analysis
2. **prompt-flow-diagram.md** — Visual flow diagrams with ASCII art
3. **architectural-ancestry.md** — Upstream sources and design patterns
4. **SUMMARY-ontological-analysis.md** — This summary document

All files are in `/Users/gaia/FUNC-SUB/`.
