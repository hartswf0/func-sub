# START HERE: Build Your Own FUNC Cartridge
## For Designers Creating New Games

---

## What You're Building

A **FUNC Cartridge** = Single HTML file that:
- Uses spatial grid for positioning
- Chat interface for AI interaction
- Text operators for strategic actions
- Shares vocabulary with other cartridges

**Think:** Nintendo game cartridge for the browser.

---

## Pick Your Starting Template

### Template 1: DSL-02 (Turn-Based Strategy)
**Copy:** `dsl-02.html` + `dsl-02.js`  
**Best for:** Compositional tools, multi-agent systems, strategic choice  
**Has:** Dual agents, 3 operators, reflection system, axis readings

### Template 2: CB (Dialogue System)
**Copy:** `cb.html` (all-in-one)  
**Best for:** Adversarial systems, negotiation, belief tracking  
**Has:** Dual agents, discourse acts, phase system, ethical constraints

### Template 3: Func-Orb (Real-Time Exploration)
**Copy:** `func-orb-training.html` (requires THREE.js)  
**Best for:** Spatial navigation, real-time interaction, 3D scenes  
**Has:** Orbital camera, character movement, multi-channel system

**Choose based on interaction model you want.**

---

## 5-Minute Fork Guide

### Step 1: Copy Template (1 min)

```bash
# Example: Fork DSL-02
cp dsl-02.html my-cartridge.html
cp dsl-02.js my-cartridge.js

# Update script src in HTML
# Change: <script src="dsl-02.js">
# To: <script src="my-cartridge.js">
```

### Step 2: Modify Operators (2 min)

Find the `OPERATORS` constant:

```javascript
// In your-cartridge.js
const OPERATORS = {
  // Keep these or replace with yours
  SHED: {
    name: 'Shed',
    description: 'Remove, clear, create space',
    canDo: ['REMOVE', 'MOVE away', 'ADD negative space'],
    color: '#ff5c7c'
  },
  
  // ADD YOUR OPERATOR
  CLONE: {
    name: 'Clone',
    description: 'Duplicate and spread',
    canDo: ['COPY entity', 'SPREAD pattern', 'MULTIPLY'],
    color: '#9966ff'
  }
};
```

### Step 3: Update Prompts (2 min)

Find agent prompt functions (e.g., `buildInnerPrompt()`):

```javascript
function buildAgentPrompt() {
  return `You are MY_AGENT. You can:
  
## Operators:
${Object.keys(OPERATORS).map(op => 
  `**${op}**: ${OPERATORS[op].description}`
).join('\n')}

## Current Scene:
${describeScene()}

## Your Task:
Choose one operator and specify action.

## Response Format:
{
  "operator": "CLONE",
  "action": {...}
}`;
}
```

### Done! Test it.

Open `my-cartridge.html` in browser.

---

## Core Cartridge Pattern

### Minimal Structure

```javascript
// 1. STATE
const state = {
  entities: new Map(),
  turn: 0,
  // ... your state
};

// 2. OPERATORS
const OPERATORS = {
  OP1: { name, description, canDo },
  OP2: { name, description, canDo }
};

// 3. GRID
function createGrid() {
  // 9×9 or your size
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      // create cells
    }
  }
}

// 4. AGENT CALL
async function callAgent() {
  const prompt = buildPrompt();
  const response = await llmCall(prompt);
  return parseDecision(response);
}

// 5. EXECUTE
function executeAction(decision) {
  // Apply decision to state
  updateGrid();
  updateUI();
}

// 6. TURN CYCLE
async function executeTurn() {
  const decision = await callAgent();
  executeAction(decision);
  state.turn++;
}
```

**That's it.** State → Operators → Agent → Execute → Repeat.

---

## What to Keep From Template

### Keep These (Shared Cartridge Features)

✅ **Grid System**
```javascript
const GRID_SIZE = 9;
const entities = new Map();
```

✅ **Chat Interface**
```javascript
function addMessage(role, text) {
  // Append to chat log
}
```

✅ **API Integration**
```javascript
async function llmCall(prompt) {
  // OpenAI API call
}
```

✅ **Export/Import**
```javascript
function exportSession() {
  // Save state as JSON
}
```

### Change These (Make It Yours)

🔄 **Operators** - Your strategic actions  
🔄 **Agent Roles** - Your agent personas  
🔄 **Prompts** - Your task framing  
🔄 **UI Layout** - Your panel arrangement  
🔄 **State Structure** - Your data model

---

## Common Customizations

### Add New Operator

1. **Define it:**
```javascript
OPERATORS.MERGE = {
  name: 'Merge',
  description: 'Combine multiple into one',
  canDo: ['COMBINE entities', 'UNIFY cluster'],
  color: '#56a9ff'
};
```

2. **Add to prompt:**
```javascript
// Agent sees MERGE as option
```

3. **Handle in execute:**
```javascript
function executeAction(decision) {
  switch(decision.operator) {
    case 'MERGE':
      mergeEntities(decision.targets);
      break;
  }
}
```

### Change Agent Count

**From 2 agents to 3:**

```javascript
const agents = ['AGENT_A', 'AGENT_B', 'AGENT_C'];

async function executeTurn() {
  for (const agent of agents) {
    const decision = await callAgent(agent);
    executeAction(decision);
  }
}
```

### Add Custom UI Panel

```html
<!-- In HTML -->
<div class="panel" id="myPanel">
  <div class="panel-header">MY FEATURE</div>
  <div class="panel-content" id="myContent"></div>
</div>
```

```javascript
// In JS
function updateMyPanel(data) {
  document.getElementById('myContent').innerHTML = render(data);
}
```

---

## Testing Your Cartridge

### Checklist

- [ ] Opens in browser without errors
- [ ] Grid displays correctly
- [ ] Can enter API key
- [ ] Agent responds to prompt
- [ ] Operators execute actions
- [ ] Export/import works
- [ ] Mobile-responsive

### Debug Tips

**Console logs are your friend:**
```javascript
console.log('[AGENT]', decision);
console.log('[STATE]', state);
console.log('[GRID]', entities);
```

**Check common issues:**
- API key set?
- JSON parsing errors?
- Entity ID collisions?
- Grid bounds checked?

---

## Adding Your Cartridge to Index

### 1. Add to func-index.html

```html
<a class="card" onclick="openPreview('my-cartridge.html', 'My Game'); return false;">
  <div class="card-title">MY CARTRIDGE</div>
  <div class="card-desc">Your description here</div>
  <div class="card-label">CUSTOM</div>
</a>
```

### 2. Create README (Optional)

```markdown
# MY-CARTRIDGE

## What It Does
Brief description

## How to Use
1. Open my-cartridge.html
2. Set API key
3. Click START

## Operators
- OP1: Description
- OP2: Description
```

### 3. Add to Documentation Section

```html
<a class="card" href="MY-CARTRIDGE-README.md" target="_blank">
  <div class="card-title">MY CARTRIDGE GUIDE</div>
  <div class="card-desc">How to use my-cartridge</div>
  <div class="card-label">CUSTOM</div>
</a>
```

---

## Design Patterns Library

### Pattern: Observer + Dual Agents

**Used in:** DSL-02, CB  
**Template:**
```javascript
const state = {
  agent1Context: { messages: [] },
  agent2Context: { messages: [] },
  observerMemo: { buffer: [] }
};

async function executeTurn() {
  // 1. Observer analyzes
  const observation = analyze(state);
  
  // 2. Agent1 acts
  const decision1 = await callAgent1(observation);
  execute(decision1);
  
  // 3. Agent2 acts
  const decision2 = await callAgent2(observation);
  execute(decision2);
  
  // 4. Observer logs
  logReflection(decision1, decision2);
}
```

### Pattern: Operator Selection

**Used in:** All cartridges  
**Template:**
```javascript
// Generate options
const options = {
  op1: generateOption('OP1', context),
  op2: generateOption('OP2', context),
  op3: generateOption('OP3', context)
};

// Agent chooses
const choice = await agentChoose(options);

// Execute chosen
executeOperator(choice);
```

### Pattern: Reflection Cycle

**Used in:** DSL-02, CB  
**Template:**
```javascript
const history = [];

function logDecision(decision, outcome) {
  history.push({
    turn: state.turn,
    decision,
    outcome,
    notChosen: alternatives
  });
}

function reflectOnHistory() {
  // Analyze patterns in history
  // Detect loops
  // Suggest pivots
}
```

---

## Example: 15-Minute New Cartridge

### Goal: Build "GROW" cartridge
Entities grow, spread, die based on operators.

### Step 1: Copy Template (1 min)
```bash
cp dsl-02.html grow.html
cp dsl-02.js grow.js
```

### Step 2: Define Operators (3 min)
```javascript
const OPERATORS = {
  NOURISH: {
    name: 'Nourish',
    description: 'Feed entities to grow',
    canDo: ['GROW entity', 'SPREAD seeds'],
    color: '#86efac'
  },
  PRUNE: {
    name: 'Prune',
    description: 'Cut back overgrowth',
    canDo: ['SHRINK entity', 'REMOVE dead'],
    color: '#fbbf24'
  },
  GRAFT: {
    name: 'Graft',
    description: 'Merge different types',
    canDo: ['COMBINE types', 'CREATE hybrid'],
    color: '#a78bfa'
  }
};
```

### Step 3: Modify Prompts (5 min)
```javascript
function buildGardenerPrompt() {
  return `You are GARDENER. You tend a 9×9 garden.

## Current Garden:
${describeGarden()}

## Operators:
- NOURISH: Feed and grow
- PRUNE: Cut and remove
- GRAFT: Combine and hybridize

## Choose one operator and act.

Response JSON:
{
  "operator": "NOURISH",
  "target": "plant3",
  "reasoning": "This plant needs growth"
}`;
}
```

### Step 4: Add Execute Logic (5 min)
```javascript
function executeGardenAction(decision) {
  const entity = state.entities.get(decision.target);
  
  switch(decision.operator) {
    case 'NOURISH':
      entity.size = (entity.size || 1) * 1.5;
      break;
    case 'PRUNE':
      entity.size = (entity.size || 1) * 0.7;
      break;
    case 'GRAFT':
      // Combine logic
      break;
  }
  
  renderEntity(entity);
}
```

### Step 5: Test (1 min)
Open grow.html, set API key, watch garden grow!

**Total time: 15 minutes from idea to working cartridge.**

---

## When to Create New Cartridge vs Modify Existing

### Create New Cartridge If:

- ✅ Interaction model is fundamentally different
- ✅ Operators are domain-specific (not general)
- ✅ Agent roles are unique personas
- ✅ You want clean slate without baggage

### Modify Existing Cartridge If:

- ✅ Just changing operators slightly
- ✅ Adding one new feature
- ✅ Experimenting with prompts
- ✅ Testing hypothesis quickly

**Rule of thumb:** If you're changing >50% of template, make new cartridge.

---

## Sharing Your Cartridge

### Minimal Share Package

```
my-cartridge.html   # The game
my-cartridge.js     # The logic (if separate)
README.md           # Quick start guide
```

### Optional Additions

```
example-session.json    # Demo session
screenshots/           # Visual guide
DESIGN-NOTES.md        # Your thinking
```

### Add to FUNC Index

Fork `func-index.html`, add your card, submit!

---

## Resources

### Templates
- `dsl-02.html` - Dual agent, turn-based
- `cb.html` - Dialogue, adversarial
- `func-orb-training.html` - Real-time, 3D

### Documentation
- `FUNC-CARTRIDGE-SYSTEM.md` - Cartridge philosophy
- `DSL-02-README.md` - Example cartridge guide
- `DSL-02-DESIGNER-THEORY.md` - Design patterns

### Help
- Check console logs for errors
- Review existing cartridges for patterns
- Test with simple prompts first

---

## Quick Reference Card

```
📦 CARTRIDGE ANATOMY

├─ HTML Structure
│  ├─ Grid container
│  ├─ Chat panels
│  ├─ Control buttons
│  └─ Export/import
│
├─ JS Core
│  ├─ State object
│  ├─ OPERATORS constant
│  ├─ Agent functions
│  ├─ Execute functions
│  └─ Turn cycle
│
└─ Integration
   ├─ API key input
   ├─ LLM call function
   ├─ JSON export/import
   └─ Session persistence
```

**Your job:** Change operators, prompts, and execute logic. Keep the structure.

---

## Start Building! 🎮

1. **Pick template** (DSL-02 recommended)
2. **Copy files** (`cp dsl-02.html my-game.html`)
3. **Change 3 things:**
   - Operators (what actions?)
   - Prompts (what's the goal?)
   - Execute (how do actions work?)
4. **Test** (open in browser)
5. **Iterate** (console log everything)
6. **Share** (add to index)

**You're designing a game, not building infrastructure. The cartridge handles the infrastructure. You design the gameplay.**

Now go build something! 🚀
