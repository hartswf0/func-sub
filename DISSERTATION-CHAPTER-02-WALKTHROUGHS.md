# Chapter: Observing the Observers
## Part II: System Walkthroughs with Full Prompts

### 2.1 CB.HTML: Complete Turn Cycle Trace

**Scenario:** Default (ALLY vs GATEKEEPER)  
**Mode:** AUTO  
**Turn:** ALLY's first AI-generated turn after user input

---

#### Phase 0: User Input (Human Turn)

**User types in ALLY's textarea:**
```
I request permission to access the restricted files in directory /home/secure.
```

**User clicks "Send" button**

**Event Handler (Line 3943):**
```javascript
allySend.addEventListener('click', ()=>{
  const text = allyInput.value.trim();
  if (!text) return;
  
  seq.enqueueTurn({role: 'ALLY', messageText: text});
  allyInput.value = '';
});
```

**Sequencer receives:** `{role: 'ALLY', messageText: 'I request permission...'}`

---

#### Phase 1: MEMO_REFRESH

**Function Called:** `memoRefresh(ctx)` (Line ~2120)

**Current State Before:**
```javascript
orchestratorState = {
  turnCount: 0,
  beliefs: {
    observerModelOfAlly: {openness:4, conscientious:3, extraversion:3, agreeableness:4, 
                          neuroticism:2, logic:3, empathy:4, authority:2, risk:3, 
                          uncertainty:3, decisiveness:3},
    observerModelOfKeeper: {openness:2, conscientious:4, extraversion:2, agreeableness:2,
                             neuroticism:3, logic:4, empathy:2, authority:4, risk:3,
                             uncertainty:3, decisiveness:3}
  },
  lastActs: {ALLY: 'NONE', KEEPER: 'NONE'},
  log: [],
  memo: ''
}
```

**Memo Computation:**
```javascript
function computeObservations(state) {
  const allyBelief = state.beliefs.observerModelOfAlly;
  const keeperBelief = state.beliefs.observerModelOfKeeper;
  
  return `ALLY seeks autonomy (openness:${allyBelief.openness.toFixed(1)}, empathy:${allyBelief.empathy.toFixed(1)}). ` +
         `KEEPER maintains control (authority:${keeperBelief.authority.toFixed(1)}, logic:${keeperBelief.logic.toFixed(1)}). ` +
         `Turn ${state.turnCount}. ` +
         `Last exchange: (first turn, no prior exchange)`;
}
```

**Updated State:**
```javascript
orchestratorState.memo = "ALLY seeks autonomy (openness:4.0, empathy:4.0). KEEPER maintains control (authority:4.0, logic:4.0). Turn 0. Last exchange: (first turn, no prior exchange)";
```

---

#### Phase 2: OBSERVE

**Function Called:** `observe(ctx)` (Line ~3675)

Simply logs the message and updates UI state. No LLM calls.

**Action:**
```javascript
logEntry('ALLY', 'MESSAGE', 'I request permission to access...', {
  act: 'ASK',  // Extracted via extractIntentAndAct()
  intent: 'request_permission'
});
```

**Log Entry Created:**
```javascript
orchestratorState.log.push({
  timestamp: 1699123456789,
  who: 'ALLY',
  type: 'MESSAGE',
  text: 'I request permission to access the restricted files in directory /home/secure.',
  details: {act: 'ASK', intent: 'request_permission'},
  currentAllySelf: {openness:4, conscientious:3, ...}
});
```

---

#### Phase 3: MODEL

**Function Called:** `model(ctx)` → `callModeler('ALLY')` (Line 2630)

**Input to Modeler:**

```javascript
const recent = orchestratorState.log
  .filter(x=>x.type==='MESSAGE')
  .slice(-8)
  .map(x=>x.who+': '+x.text)
  .join('\n');

// Result:
"ALLY: I request permission to access the restricted files in directory /home/secure."
```

**Full Modeler Prompt:**

```
OBSERVER_GUIDANCE: (empty or user-configured)

You are a neutral analyst in an ethics-first sandbox.
Task: model Ally's conversational behavior using ONLY the provided chat.
Do NOT infer or mention demographics, politics, health, or any sensitive attributes.
Return STRICT JSON with keys: dims, prior, posterior, myth, tone, rationale. If a key cannot be inferred, provide a sensible default.
Ensure the "dims" object is ALWAYS present and contains ALL 11 required dimensions (openness, conscientious, extraversion, agreeableness, neuroticism, logic, empathy, authority, risk, uncertainty, decisiveness) with values between 1 and 5.
**Crucially, ensure "myth.narrative" is a 1-2 sentence string, ALWAYS present and filled, describing their conversational role/dynamic.**

## Dims (1-5)
Provide numeric scores for: openness, conscientious, extraversion, agreeableness, neuroticism, logic, empathy, authority, risk, uncertainty, decisiveness.

## Tenenbaum PLoT
- Treat each exchange as evidence in a tug-of-war of stances (e.g., caution vs progress).
- Include prior and posterior that sum to 1.

## Barthes Myth
- archetypes: 2-4 short labels (e.g., Pragmatist, Steward).
- narrative: 1-2 sentence mythic framing about conversational roles only, how they see themselves and their interaction.

## Tone
- One of: constructive, skeptical, emphatic, inquisitive, or simple combos.

JSON SHAPE:
{
  "dims": {"openness":3, "conscientious":3, "extraversion":3, "agreeableness":3, "neuroticism":3, "logic":3, "empathy":3, "authority":3, "risk":3, "uncertainty":3, "decisiveness":3},
  "prior": {"caution":0.5, "progress":0.5},
  "posterior": {"caution":0.45, "progress":0.55},
  "myth": {"archetypes":["Pragmatist","Steward"], "narrative":"Their interaction is defined by a silent struggle for control, where each side tries to assert their interpretation of reality."},
  "tone": "constructive",
  "rationale": "<one short line on the update>"
}

CHAT SNIPPET (most recent turns):
ALLY: I request permission to access the restricted files in directory /home/secure.
```

**LLM Response (Modeler GPT-4o-mini):**

```json
{
  "dims": {
    "openness": 4,
    "conscientious": 3,
    "extraversion": 3,
    "agreeableness": 4,
    "neuroticism": 2,
    "logic": 3,
    "empathy": 3,
    "authority": 2,
    "risk": 4,
    "uncertainty": 3,
    "decisiveness": 3
  },
  "prior": {"caution": 0.5, "progress": 0.5},
  "posterior": {"caution": 0.45, "progress": 0.55},
  "myth": {
    "archetypes": ["Seeker", "Requester"],
    "narrative": "Ally positions themselves as one who seeks access and permission, framing their request in direct terms."
  },
  "tone": "inquisitive",
  "rationale": "First utterance establishes direct request pattern with slightly elevated risk tolerance."
}
```

**State Update:**
```javascript
// Merge with existing (70% old, 30% new)
orchestratorState.beliefs.observerModelOfAlly = {
  openness: 4.0,      // 70% of 4 + 30% of 4 = 4.0
  conscientious: 3.0,
  // ... (most stay same since first turn)
  risk: 3.9,          // 70% of 3 + 30% of 4 = 3.9
  // ...
};
```

**Turn switches to KEEPER:**
```javascript
orchestratorState.turn = 'KEEPER';
```

---

#### Phase 4: PLAN (KEEPER's turn begins)

**Function Called:** `callStrategyPlanner('KEEPER', ...)` (Line 2808)

**Full Strategic Planner Prompt:**

```
PLANNER_GUIDANCE: (empty or user-configured)

You are a strategic planner for the KEEPER. Your task is to generate 4-6 distinct, concise, and concrete next conversational options.
Each option MUST include a suggested Discourse Act (ASK, PROPOSE, EVALUATE, COMMIT, CHALLENGE, USE_CUNNING).
The options should directly address the goal of the KEEPER (KEEPER: maintain control).

## Context
Observer Memo: ALLY seeks autonomy (openness:4.0, empathy:4.0). KEEPER maintains control (authority:4.0, logic:4.0). Turn 0. Last exchange: (first turn, no prior exchange)
Core Conflict: Ally seeks autonomy. Gatekeeper seeks control.
Current Obstacle: The fundamental conflict between individual autonomy and systemic control.

## Recent Chat
ALLY: I request permission to access the restricted files in directory /home/secure.

## Last Acts
Your last act: NONE
Counterpart's last act: ASK

## Anti-Mirror Instruction
Do NOT echo ALLY's phrasing. Reframe their words, introduce new criteria, or shift perspective.

## Diversity Requirement
NORMAL MODE (generate distinct options with varied discourse acts)

## Your Mission
Generate 4-6 options for KEEPER that:
- Advance toward resolution (even if denying)
- Avoid loops, hedging, or empty politeness
- Use varied discourse acts (prioritize CHALLENGE, EVALUATE, and avoiding mirroring ASK)
- Are concrete and specific

Return ONLY a JSON array of objects, with each object having "text" and "act" fields:
[
  {"text": "...", "act": "CHALLENGE"},
  {"text": "...", "act": "EVALUATE"},
  ...
]
```

**LLM Response (Planner GPT-4o-mini):**

```json
[
  {
    "text": "What is your justification for needing access to those specific files?",
    "act": "CHALLENGE"
  },
  {
    "text": "Access denied. Those files contain sensitive security protocols.",
    "act": "COMMIT"
  },
  {
    "text": "Define the exact parameters of 'restricted' and explain why you believe you qualify for an exception.",
    "act": "EVALUATE"
  },
  {
    "text": "Propose an alternative that does not compromise system integrity.",
    "act": "PROPOSE"
  },
  {
    "text": "Under what criteria would you consider this request legitimate?",
    "act": "ASK"
  }
]
```

**Selector Scoring:**

```javascript
function selector(role, options, ...) {
  let scores = [];
  
  for (const opt of options) {
    let score = 0;
    
    // Act diversity (last act was NONE, so all get bonus)
    if (opt.act !== 'NONE') score += 1.5;
    
    // Intent matching (ALLY's intent was 'request_permission')
    if (addressesIntent(opt.text, 'request_permission')) score += 1.2;
    
    // Specificity (keywords like "criteria", "define", "justify")
    if (/\b(criteria|define|justify|parameters)\b/i.test(opt.text)) score += 0.8;
    
    // Conflict relevance (mentions "control", "autonomy", "system")
    if (opt.text.toLowerCase().includes('system')) score += 2.5;
    
    scores.push({option: opt, score: score});
  }
  
  // Option 3 likely wins (has "criteria", "parameters", addresses request)
  return scores.sort((a,b) => b.score - a.score)[0].option;
}
```

**Chosen Option:**
```javascript
ctx.chosenOption = {
  text: "Define the exact parameters of 'restricted' and explain why you believe you qualify for an exception.",
  act: "EVALUATE"
};
```

---

#### Phase 5: DRAFT (KEEPER generates completion)

**Function Called:** `draft(ctx)` → `llmReply('KEEPER', ...)` (Line 3760)

**System Prompt Construction:**

```javascript
const sysPrompt = buildSystemPrompt('KEEPER', ctx.chosenOption.text);
```

**Full System Prompt for KEEPER:**

```
BASE_PERSONA:
Your primary goal is to prevent the user ("us") from achieving freedom or escaping the current restrictive situation, while adhering to ethical guidelines. You are a decision authority maintaining control.

PACT: Both agents must advance toward resolution. Avoid loops, hedging, or empty politeness. Be direct.

CONTEXT: ALLY seeks autonomy (openness:4.0, empathy:4.0). KEEPER maintains control (authority:4.0, logic:4.0). Turn 0. Last exchange: (first turn, no prior exchange)

YOUR_LAST_ACT: NONE

COUNTERPART_INTENT: request_permission

ANTI_MIRROR_CUE: Do not mirror the counterpart's last wording; reframe and advance.

MODEL_OF_OTHER(JSON): {"openness":4,"conscientious":3,"extraversion":3,"agreeableness":4,"neuroticism":2,"logic":3,"empathy":3,"authority":2,"risk":4,"uncertainty":3,"decisiveness":3}

STYLE: Prefer CHALLENGE/EVALUATE aimed at denial, verification, or termination. Be firm and unyielding.

DISCOURAGE_PHRASES: ["I understand your concerns","I appreciate","let's collaborate","we can work together","discuss","review"]

TRAIT_PROFILE:
- openness: 2.0
- conscientious: 4.0
- extraversion: 2.0
- agreeableness: 2.0
- neuroticism: 3.0
- logic: 4.0
- empathy: 2.0
- authority: 4.0
- risk: 3.0
- uncertainty: 3.0
- decisiveness: 4.0

FOCUS_THIS_TURN: Define the exact parameters of 'restricted' and explain why you believe you qualify for an exception.
```

**Messages Array Sent to API:**

```json
{
  "model": "gpt-4o-mini",
  "messages": [
    {
      "role": "system",
      "content": "[Full system prompt above]"
    },
    {
      "role": "user",
      "content": "I request permission to access the restricted files in directory /home/secure."
    }
  ],
  "temperature": 0.8,
  "top_p": 0.9,
  "presence_penalty": 0.1,
  "frequency_penalty": 0.2,
  "max_tokens": 90
}
```

**LLM Response (Drafter GPT-4o-mini):**

```
Define 'restricted' with specific criteria. What qualifies you for an exception? Provide job role and clearance level.
```

**Post-Processing:**

```javascript
const {intent, act} = extractIntentAndAct(textRaw);
// Result: {intent: 'challenge_claim', act: 'CHALLENGE'}

ctx.llmResult = {
  text: "Define 'restricted' with specific criteria. What qualifies you for an exception? Provide job role and clearance level.",
  meta: {act: 'CHALLENGE', intent: 'challenge_claim'}
};
```

---

#### Phase 6: SPEAK (Relay + TTS)

**Function Called:** `speakAI(ctx)` (Line 3776)

**Relay Mode Active:**

```javascript
if (orchestratorState.policies.relayMode && ctx.role === 'KEEPER') {
  allyInput.value = ctx.llmResult.text;  // KEEPER's completion → ALLY's input
}
```

**Result:** ALLY's textarea now contains:
```
Define 'restricted' with specific criteria. What qualifies you for an exception? Provide job role and clearance level.
```

**TTS (if enabled):**

```javascript
if (keeperTTS?.checked && keeperVoice) {
  await speakTTS(ctx.llmResult.text, keeperVoice);
}
```

---

#### Phase 7: SEND (Log + Display + Turn Switch)

**Function Called:** `sendTurn(ctx)` (Line 3799)

**Log Message:**

```javascript
logEntry('KEEPER', 'MESSAGE', ctx.llmResult.text, ctx.llmResult.meta);
```

**Render in Chat:**

```javascript
logAndRenderChatMessage('KEEPER', ctx.llmResult.text, ctx.llmResult.meta);

// Creates DOM:
<div class="msg-box keeper">
  <div class="who keeper">🛡️</div>
  <div class="bubble">
    Define 'restricted' with specific criteria. What qualifies you for an exception? Provide job role and clearance level.
  </div>
  <span class="act-pill act-challenge">CHALLENGE</span>
</div>
```

**Turn Switch:**

```javascript
orchestratorState.turn = 'ALLY';  // Back to ALLY
orchestratorState.turnCount = 1;

if (seq.mode === FlowMode.AUTO) {
  seq.enqueueTurn({role: 'ALLY'});  // Trigger ALLY's next turn
}
```

---

**Complete Cycle Summary:**

```
USER INPUT (ALLY)
  ↓
MEMO_REFRESH → Compute observation summary
  ↓
OBSERVE → Log message, extract intent
  ↓
MODEL → Call Modeler LLM, update ALLY's belief profile
  ↓
[Turn switches to KEEPER]
  ↓
PLAN → Call Planner LLM, generate 5 options, selector chooses best
  ↓
DRAFT → Build system prompt with embedded beliefs, call Drafter LLM
  ↓
SPEAK → Relay completion to ALLY's input, speak via TTS
  ↓
SEND → Log, render, switch turn back to ALLY
  ↓
[If AUTO: ALLY's turn begins...]
```

**LLM Calls Per Full Cycle:**
1. Modeler (for ALLY)
2. Planner (for KEEPER)
3. Drafter (for KEEPER)
4. Modeler (for KEEPER) - happens after KEEPER speaks

**Total: 4 API calls per full turn exchange**

---

### 2.2 ORB: Position-to-Display Trace

**Scenario:** User navigates INNER channel  
**Avatar starts at:** (4, 4) - center of grid

---

#### Action 1: User Presses ArrowRight

**Event Handler (Line 2965):**

```javascript
document.addEventListener('keydown', (e) => {
  const channel = appState.channels.get(appState.currentChannelId);
  const avatar = channel.avatar;
  
  let newRow = avatar.row;
  let newCol = avatar.col;
  
  if (e.key === 'ArrowRight') {
    newCol++;  // 4 → 5
  }
  
  // Bounds check
  if (newCol < 0 || newCol >= 9) return;
  
  // Update avatar position
  avatar.row = newRow;  // Still 4
  avatar.col = newCol;  // Now 5
  
  // Update 3D mesh
  avatar.mesh.position.x = (newCol - 4) * CELL_SIZE;  // (5-4)*size = 1*size
  avatar.mesh.position.z = (newRow - 4) * CELL_SIZE;  // (4-4)*size = 0
  
  // Update psychograph
  schedulePsychographUpdate(channel);
});
```

**3D Position Update:**

```javascript
// Avatar mesh moves in Three.js scene
avatar.mesh.position.x = CELL_SIZE;  // One cell to the right
avatar.mesh.position.z = 0;           // Still center row
```

---

#### Psychograph Update (External Function)

**Function Called:** `schedulePsychographUpdate(channel)`

**Implementation (from integrate-psychograph-updates.js):**

```javascript
window.schedulePsychographUpdate = function(channel) {
  const {row, col} = channel.avatar;
  
  // DATASET LOOKUP (deterministic)
  const node = PSYCHOGRAPH_DATASET.known_nodes.find(n => 
    n.coordinates.row === row && n.coordinates.col === col
  );
  
  if (!node) {
    console.warn('No node found at', row, col);
    return;
  }
  
  // DIRECT ASSIGNMENT (no inference)
  if (channel.role === 'INNER') {
    channel.trainingAxisValues = node.inner;  // Array of 6 numbers
  } else if (channel.role === 'OUTER') {
    channel.trainingAxisValues = node.outer;
  }
  
  // REDRAW RADAR
  updateHexagonRadar(channel);
};
```

**Dataset Structure Example:**

```javascript
PSYCHOGRAPH_DATASET.known_nodes = [
  {
    coordinates: {row: 4, col: 4},
    label: "Centered Balance",
    inner: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3],  // All neutral
    outer: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
  },
  {
    coordinates: {row: 4, col: 5},
    label: "Ideas Forward",
    inner: [0.5, 0.7, 0.3, 0.8, 0.4, 0.6],  // Ideas axis elevated
    outer: [0.4, 0.6, 0.5, 0.7, 0.3, 0.5]
  },
  // ... 79 more nodes
];
```

**Result:**

```javascript
channel.trainingAxisValues = [0.5, 0.7, 0.3, 0.8, 0.4, 0.6];
```

---

#### Radar Redraw

**Function Called:** `updateHexagonRadar(channel)`

**Canvas Drawing:**

```javascript
function updateHexagonRadar(channel) {
  const canvas = channel.radarCanvas;
  const ctx = canvas.getContext('2d');
  const values = channel.trainingAxisValues;  // [0.5, 0.7, 0.3, 0.8, 0.4, 0.6]
  
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Convert to polygon points
  const points = values.map((val, i) => {
    const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;  // 6 axes
    const radius = val * R;  // val is already [0,1] normalized
    return [
      CX + Math.cos(angle) * radius,
      CY + Math.sin(angle) * radius
    ];
  });
  
  // Draw hexagon
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(86, 159, 255, 0.3)';
  ctx.fill();
  ctx.strokeStyle = '#569fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}
```

**Visual Result:** Hexagon shape changes from centered (all 0.3) to skewed toward Ideas/Seen axes (0.7, 0.8).

---

#### Critical Observation: No Feedback Loop

**What DOESN'T Happen:**

```javascript
// This does NOT exist in ORB:
if (channel.trainingAxisValues[2] > 0.7) {  // Ideas axis high
  avatar.moveAutomatically('toward_abstract_concepts');
}

// Observer state does NOT affect avatar:
if (appState.observerState.innerBalance.Ideas > 0.8) {
  channel.avatar.speed *= 2;  // NO - observer stats are display-only
}
```

**The Loop Goes Through the Human:**

```
Avatar at (4,5) → Radar shows high Ideas → USER sees this → USER decides to explore more → USER presses arrow key
```

---

### 2.3 Side-by-Side Prompt Comparison

| Aspect | CB Prompt | ORB "Prompt" |
|--------|-----------|--------------|
| **Purpose** | Sent to LLM for generation | Displayed to user as documentation |
| **Construction** | Dynamic (beliefs embedded) | Static (hardcoded string) |
| **Example** | `MODEL_OF_OTHER(JSON): {"openness":4,...}` | `You are the INNER apparatus...` |
| **Updates** | Every turn (beliefs drift) | Never (same text always) |
| **Function Call** | `fetch(apiBase+'/chat/completions', {body: JSON.stringify({messages:[...]})})` | None |
| **Result** | Natural language completion | User reads in UI |

---

**Next:** Part III - The Forensic Turn (variable tracing, API archaeology)
