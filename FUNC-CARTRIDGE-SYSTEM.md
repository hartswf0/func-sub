# FUNC Cartridge System
## Modular Design Tools as Nintendo Cartridges

---

## Concept: Tool Cartridges, Not Monoliths

Think of FUNC tools like **Nintendo cartridges**:
- Each is **self-contained** (single HTML file)
- Each offers **distinct gameplay** (different interaction model)
- Each shares **common substrate** (spatial grid, chat, text operators)
- Designers **swap between cartridges** based on task

**Not:** One giant app with all features  
**But:** Library of focused tools that share vocabulary

---

## The Three Core Cartridges

### 🎯 DSL-02: Dual Agent Scene Builder
**Genre:** Turn-based strategy composition  
**File:** `dsl-02.html` (standalone)

**Shared Affordances:**
- 9×9 spatial grid
- Chat-based interface
- Text operators (SHED/INTEGRATE/GROUND)
- API integration (OpenAI)
- JSON export/import

**Unique Features:**
- **Dual agents** (INNER/OUTER) with split perspectives
- **Three-options protocol** (observer generates paths)
- **Axis homeostasis** (6 DSL axes drive decisions)
- **Reflection cycles** (memo logs choices/consequences)
- **Compositional analysis** (clusters, density, negative space)

**What It Affords:**
- **Constraint-based composition** (only 3 operators)
- **Emergent balance** (agents self-regulate)
- **Dialogue with alternatives** (chat about options)
- **Reflection on process** (what was NOT chosen)
- **Session persistence** (export logs)

**Best For:**
- Spatial scene composition studies
- Exploring dual perspectives
- Strategic operator choice
- Design research on emergence

---

### ⚖️ CB.html: Centaur Box Negotiation
**Genre:** Adversarial dialogue system  
**File:** `cb.html` (standalone)

**Shared Affordances:**
- Chat-based interface
- Text operators (discourse acts: PROPOSE/CHALLENGE/ASK)
- API integration (OpenAI)
- Multi-panel view
- Turn-based execution

**Unique Features:**
- **Two adversarial agents** (ALLY seeks access, KEEPER denies)
- **Pact-based constraints** (conversation rules)
- **Belief tracking** (agents model each other)
- **Ethical sandbox** (hidden system prompts)
- **Phase system** (PLAN/ARGUE/JUDGE)
- **Discourse act extraction** (intent + speech act)

**What It Affords:**
- **Adversarial reasoning** (agents in conflict)
- **Negotiation dynamics** (seeking consensus through tension)
- **Belief modeling** (theory of mind)
- **Ethical guardrails** (conversation pact)
- **Turn-by-turn argumentation**

**Best For:**
- Dialogue system research
- Adversarial AI studies
- Negotiation pattern exploration
- Ethical constraint testing

---

### 🌌 func-orb-training.html: Orbital Navigation
**Genre:** Real-time 3D exploration  
**File:** `func-orb-training.html` (with dependencies)

**Shared Affordances:**
- Spatial grid (3D version)
- Chat-based interface
- Node placement system
- API integration (OpenAI)
- Channel system (multiple scenes)

**Unique Features:**
- **3D orbital camera** (THREE.js)
- **Character movement** (arrow keys)
- **Real-time navigation** (not turn-based)
- **Hexagon radar** (axis visualization)
- **Node dataset** (81 synthetic nodes)
- **Psychograph integration** (movement affects axes)
- **Channel system** (multiple scenes)

**What It Affords:**
- **Spatial exploration** (move through scene)
- **Real-time interaction** (immediate feedback)
- **Embodied navigation** (character presence)
- **Data visualization** (radar charts)
- **Multi-scene workflow** (channels)

**Best For:**
- Spatial navigation studies
- Real-time exploration
- Embodied interaction
- Data-driven scene building

---

## Shared Design Substrate

### 1. Spatial Grid as Foundation

**All three use grids:**
- **DSL-02:** 9×9 2D grid for entity placement
- **CB:** Implicit spatial metaphor (no visual grid but positional reasoning)
- **Func-Orb:** 9×9 3D grid with orbital camera

**Common Pattern:**
```javascript
// Discrete positions
const position = [row, col];  // or [x, y, z]

// Grid boundaries
const GRID_SIZE = 9;

// Entity placement
entities.set(id, {position, type, icon, label});
```

**Affordance:** Designers can **think spatially** regardless of cartridge. Position is always discrete, bounded, addressable.

---

### 2. Chat as Interface Paradigm

**All three use chat:**
- **DSL-02:** 3 chats (INNER, OUTER, OBSERVER)
- **CB:** 2 chats (ALLY, KEEPER) + OBSERVER log
- **Func-Orb:** Multi-channel chat system

**Common Pattern:**
```javascript
// Message structure
{
  role: 'user' | 'agent' | 'system',
  content: 'text',
  timestamp: Date.now()
}

// Chat append
function addMessage(role, text) {
  log.push({role, text, timestamp: Date.now()});
  renderMessage();
}
```

**Affordance:** Designers can **converse with AI** in familiar messaging UI. No special interface needed - just text in/out.

---

### 3. Text Operators as Actions

**All three use text-based operators:**
- **DSL-02:** SHED/INTEGRATE/GROUND (spatial operators)
- **CB:** PROPOSE/CHALLENGE/ASK/COMMIT/etc (discourse acts)
- **Func-Orb:** ADD/REMOVE/MOVE (scene actions)

**Common Pattern:**
```javascript
// Operator definition
const OPERATORS = {
  SHED: {name, description, constraints},
  INTEGRATE: {name, description, constraints},
  GROUND: {name, description, constraints}
};

// Operator selection
function chooseOperator(context) {
  // LLM returns operator name
  // System validates and executes
}
```

**Affordance:** Designers can **reason about actions** at strategic level. Operators are **conceptual frames**, not pixel-level manipulation.

---

### 4. API Integration

**All three use OpenAI API:**
- Single key, shared configuration
- Standard message format
- Streaming or blocking responses
- Temperature/model controls

**Common Pattern:**
```javascript
async function llmCall(prompt, context) {
  const response = await fetch(API_BASE + '/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: buildMessages(prompt, context),
      temperature: 0.7
    })
  });
  return await response.json();
}
```

**Affordance:** Designers can **use same API key** across all cartridges. No separate accounts or setup per tool.

---

### 5. Export/Import Sessions

**All three support session persistence:**
- **DSL-02:** JSON export with entities, axes, memo
- **CB:** Session log with full dialogue
- **Func-Orb:** Channel state export

**Common Pattern:**
```javascript
function exportSession() {
  const data = {
    timestamp: Date.now(),
    state: captureState(),
    history: captureHistory()
  };
  downloadJSON(data, `session-${Date.now()}.json`);
}
```

**Affordance:** Designers can **save/resume work**, **share sessions**, **analyze patterns** across cartridges.

---

## Cartridge Comparison Matrix

| Feature | DSL-02 | CB.html | Func-Orb |
|---------|--------|---------|----------|
| **Grid Type** | 2D 9×9 | Implicit | 3D 9×9 |
| **Interaction** | Turn-based | Turn-based | Real-time |
| **Agents** | 2 (INNER/OUTER) | 2 (ALLY/KEEPER) | 0 (user-driven) |
| **Operators** | 3 (SHED/INT/GRD) | ~10 (discourse acts) | 3 (ADD/REM/MOV) |
| **View** | Observer + Dual | Observer + Dual | Orbital camera |
| **Constraint** | Operator choice | Conversation pact | Movement limits |
| **Reflection** | Memo ring buffer | Belief tracking | Channel history |
| **Dependencies** | None | None | THREE.js |
| **File Size** | ~50KB | ~80KB | ~200KB |

---

## What This Affords Designers

### 1. **Modular Exploration**

**Instead of:**
"I need a tool that does everything"

**Designer gets:**
"I need composition? Use DSL-02"  
"I need negotiation? Use CB"  
"I need exploration? Use Func-Orb"

**Benefit:** Match tool to task. No overwhelming feature bloat.

---

### 2. **Shared Vocabulary Across Tools**

**Grid positions transfer:**
```javascript
// From DSL-02
entity at [4, 4]

// To Func-Orb
place node at grid[4][4]

// To CB (metaphorically)
"position in argument space: central"
```

**Benefit:** Learn once, apply everywhere.

---

### 3. **Session Portability**

**Scenario:**
1. Build scene in DSL-02 (compositional phase)
2. Export JSON
3. Import into Func-Orb (exploration phase)
4. Navigate through composed space

**Current State:** Not yet implemented  
**Future Affordance:** Cross-cartridge workflows

---

### 4. **Rapid Prototyping**

**Scenario:**
Designer has idea for new operator system.

**With Cartridges:**
1. Copy DSL-02.html as template
2. Modify operators in OPERATORS constant
3. Update prompts for new operators
4. Test immediately (single file)

**Without Cartridges:**
- Need to fork entire codebase
- Navigate complex dependencies
- Risk breaking existing features

**Benefit:** Fork a cartridge, not a framework.

---

### 5. **Pattern Library**

**Patterns emerge across cartridges:**

**Pattern: Observer + Dual Agents**
- DSL-02: INNER/OUTER with Observer memo
- CB: ALLY/KEEPER with REF observer
- Template: Copy this structure for new dual-agent systems

**Pattern: Operator Selection**
- DSL-02: Choose from 3 options
- CB: Choose discourse act
- Template: Constrained choice from operator set

**Pattern: Reflection Cycle**
- DSL-02: Memo ring buffer
- CB: Belief tracking
- Func-Orb: Channel history
- Template: Log-and-learn system

**Benefit:** Designers learn **design patterns** not just **features**.

---

## Designer Documentation Strategy

### Want to Build Your Own Cartridge?

**👉 See [START-HERE.md](START-HERE.md)** - Complete quick-start guide:
- Pick a template (DSL-02, CB, or Func-Orb)
- Fork in 5 minutes
- Customize operators and prompts
- Test and iterate
- 15-minute working example included

### For Each Existing Cartridge:

- **README.md** - What it is, how to use
- **DESIGNER-THEORY.md** - Why this design, patterns, research
- **Architecture docs** - Technical details for extension

---

## Nintendo Cartridge Metaphor Extended

### Cartridge Label (What user sees first)

**DSL-02 Label:**
```
🎯 DSL-02
DUAL AGENT SCENE BUILDER
Turn-based composition with SHED/INTEGRATE/GROUND

Players: 1 (+ 2 AI agents)
Grid: 9×9
Genre: Strategy
```

**CB Label:**
```
⚖️ CB
CENTAUR BOX NEGOTIATION
Adversarial dialogue with ALLY vs KEEPER

Players: 1 (+ 2 AI agents)
Grid: Implicit
Genre: Dialogue
```

**Func-Orb Label:**
```
🌌 FUNC-ORB
ORBITAL TRAINING GROUND
3D spatial navigation with node placement

Players: 1
Grid: 9×9×9
Genre: Exploration
```

### Cartridge Back (Feature list)

**DSL-02 Back:**
- ✓ Dual agent system
- ✓ Three-options protocol
- ✓ Compositional analysis
- ✓ Reflection cycles
- ✓ Session export/import

**CB Back:**
- ✓ Adversarial agents
- ✓ Belief tracking
- ✓ Discourse act extraction
- ✓ Ethical pact system
- ✓ Phase transitions

**Func-Orb Back:**
- ✓ 3D orbital camera
- ✓ Character movement
- ✓ Hexagon radar
- ✓ 81-node dataset
- ✓ Multi-channel workflow

### Game Manual (README)

Each cartridge ships with manual:
- Controls diagram
- Gameplay loop
- Strategy tips
- Troubleshooting

---

## Shared Cartridge Infrastructure

### Console (The Browser)

**All cartridges run in:**
- Modern browser (Chrome, Firefox, Safari)
- No installation needed
- Works offline (after first load)
- Mobile-responsive

### Power Supply (API Key)

**All cartridges need:**
- OpenAI API key (or compatible)
- API base URL (customizable)
- Set once in console, works for all

### Save System (Export/Import)

**All cartridges support:**
- Export session to JSON
- Import session from JSON
- Share saves between users
- Archive for research

---

## What This Enables

### For Solo Designers

**Workflow:**
1. Grab DSL-02 cartridge
2. Build a scene (30 min)
3. Export session
4. Swap to Func-Orb cartridge
5. Import and explore (20 min)
6. Document findings

**Total time:** 50 minutes from idea to exploration

---

### For Teams

**Workflow:**
1. Designer A uses DSL-02 to compose
2. Export scene.json
3. Designer B imports into Func-Orb
4. Explores and annotates
5. Designer C uses CB to negotiate changes
6. Iterative refinement

**Benefit:** Cartridge-based handoffs, not monolithic tool lock-in

---

### For Researchers

**Workflow:**
1. Run 10 sessions in DSL-02
2. Export all 10 logs
3. Analyze operator patterns
4. Test hypothesis in CB
5. Validate in Func-Orb
6. Cross-cartridge study

**Benefit:** Modular research design

---

### For Educators

**Curriculum:**
- **Week 1:** Intro with Func-Orb (easiest, real-time)
- **Week 2:** Composition with DSL-02 (strategic)
- **Week 3:** Dialogue with CB (conceptual)
- **Week 4:** Cross-cartridge project

**Benefit:** Progressive complexity, clear boundaries

---

## Implementation Guidelines for New Cartridges

### Cartridge Template Checklist

✅ **Single HTML file** (or HTML + single JS)  
✅ **Spatial grid** (2D or 3D, 9×9 standard)  
✅ **Chat interface** (familiar messaging UI)  
✅ **Text operators** (3-10 constrained actions)  
✅ **API integration** (OpenAI standard)  
✅ **Export/import** (JSON format)  
✅ **Mobile-responsive** (works on phones)  
✅ **Documentation** (README + theory + architecture)

### Optional Enhancements

⭐ **Reflection system** (memo, belief tracking, history)  
⭐ **Multi-agent** (2-3 AI agents with distinct roles)  
⭐ **Visualization** (radar, graph, 3D scene)  
⭐ **Session persistence** (localStorage backup)  
⭐ **Theme system** (light/dark/custom)

---

## Future Cartridges (Speculative)

### 🎨 DSL-03: Single-Agent Studio
- Focus on solo composition
- More operator freedom (5-7 operators)
- Direct manipulation + chat hybrid
- Real-time preview

### 🗺️ FUNC-MAP: Topology Builder
- Build connected spaces (not just grid)
- Graph-based scene structure
- Path finding and flow analysis
- Export to spatial formats

### 📊 FUNC-ANALYZE: Pattern Detector
- Import logs from any cartridge
- Detect operator patterns
- Visualize decision trees
- Generate insights

### 🎭 CB-02: Multi-Party Negotiation
- 3+ agents (not just dual)
- Coalition formation
- Voting mechanisms
- Complex pact structures

---

## Summary: The Cartridge System Advantage

### What Designers Get

**Not:**
- Monolithic app with 100 features
- Complex menu hierarchies
- Overwhelming learning curve
- One-size-fits-all approach

**But:**
- Library of focused tools (cartridges)
- Each tool does one thing well
- Shared vocabulary across tools
- Mix-and-match for workflows

### Design Philosophy

**Nintendo Cartridges:**
- Super Mario Bros: Platforming
- Legend of Zelda: Adventure
- Tetris: Puzzle

**FUNC Cartridges:**
- DSL-02: Composition
- CB: Negotiation
- Func-Orb: Exploration

**Same console (browser), different gameplay (interaction model).**

### Core Affordances Summary

1. **Spatial Grid** - Discrete, bounded, addressable space
2. **Chat Interface** - Conversational AI interaction
3. **Text Operators** - Strategic action constraints
4. **API Integration** - Shared backend, single key
5. **Session Persistence** - Save/load/share work
6. **Modular Design** - Focused tools, clear boundaries
7. **Pattern Library** - Learn once, apply everywhere
8. **Cross-Cartridge Potential** - Future interoperability

---

**For designers: Pick a cartridge, start playing. When you need a different interaction model, swap cartridges. The substrate is shared, the gameplay is unique.**

🎮 **Start your cartridge collection:** `index.html` → Choose your game
