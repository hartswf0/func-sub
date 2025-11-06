# Prompt-GUI Boundary Zones: Where Code Meets Text

## The Core Question

**How does user text become quantitative values? How do we inject data into prompts? How do we style LLM output in the GUI?**

---

## Key Boundary Zone 1: Text → Numeric Belief Profile

### The Transformation

```javascript
// INPUT: Natural language conversation
"ALLY: I propose we implement a trial period with checkpoints.
 KEEPER: Your proposal lacks specific criteria."

// PROCESS: callModeler() → LLM inference
const prompt = `Analyze this conversation and rate the speaker on 11 dimensions (1-5)...`;
const response = await fetch('/chat/completions', {body: JSON.stringify({messages: [...]})});

// OUTPUT: Structured numeric profile
{
  dims: {
    openness: 4,
    conscientious: 3,
    authority: 2,
    empathy: 4,
    // ... 11 total
  }
}
```

**The Boundary Code (line 2630-2690):**

```javascript
// TEXT → NUMBERS via LLM as inference engine
const recent = orchestratorState.log.slice(-8).map(x=>x.who+': '+x.text).join('\n');
const res = await fetch(apiBase+"/chat/completions", {
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{role:'user', content: buildModelerPrompt(aboutWhom, recent)}],
    response_format: {type: "json_object"}  // ← Forces structured output
  })
});
const payload = JSON.parse(await res.json().choices[0].message.content);
```

**Why This Matters:** You can't compute "authoritativeness" from text with regex. But you can **ask an LLM to quantify it**, then use those numbers in code.

---

## Key Boundary Zone 2: Numeric Profile → JSON String in Prompt

### The Embedding

```javascript
// INPUT: Belief object (code structure)
const beliefOfOther = {openness:4, conscientious:3, authority:2, empathy:4, ...};

// PROCESS: Serialize to JSON string
const beliefJSON = JSON.stringify(beliefOfOther);
// → '{"openness":4,"conscientious":3,"authority":2,...}'

// OUTPUT: String interpolated into prompt
const systemPrompt = `
BASE_PERSONA: You are a gatekeeper...

MODEL_OF_OTHER(JSON): ${beliefJSON}

FOCUS_THIS_TURN: ${directive}
`;
```

**The Boundary Code (line 2508-2551):**

```javascript
function buildSystemPrompt(role, currentDirective){
  const beliefOfOther = (role === 'ALLY') ? 
    orchestratorState.beliefs.observerModelOfKeeper : 
    orchestratorState.beliefs.observerModelOfAlly;
  
  return `
MODEL_OF_OTHER(JSON): ${JSON.stringify(beliefOfOther)}
TRAIT_PROFILE:
${Object.entries(mySelf).map(([k,v])=>`- ${k}: ${v.toFixed(1)}`).join('\n')}
FOCUS_THIS_TURN: ${currentDirective}
`;
}
```

**Why JSON?** The LLM can parse structured data. Alternative approaches (natural language, CSV) are ambiguous.

---

## Key Boundary Zone 3: LLM Completion → Styled DOM

### The Styling

```javascript
// INPUT: Plain text from LLM
"Your proposal lacks specific criteria. Define exactly what constitutes success."

// PROCESS: Create styled DOM elements
const box = document.createElement('div');
box.className = 'msg-box keeper';  // ← CSS class determines style

const bubble = document.createElement('div');
bubble.className = 'bubble';
bubble.textContent = llmText;

box.appendChild(bubble);
chatEl.appendChild(box);
```

**CSS Styling (embedded in HTML):**

```css
.msg-box.keeper .bubble {
  background: linear-gradient(135deg, #3f2a2a 0%, #2f1a1a 100%);
  border-left: 3px solid #ff5c7c;  /* Red for KEEPER */
  color: #fff;
}

.msg-box.ally .bubble {
  background: linear-gradient(135deg, #2a3f5f 0%, #1a2f4f 100%);
  border-left: 3px solid #569fff;  /* Blue for ALLY */
}
```

**The Boundary Code (line ~1650-1700):**

```javascript
function logAndRenderChatMessage(who, text, meta){
  const box = document.createElement('div');
  box.className = 'msg-box ' + (who === 'ALLY' ? 'ally' : 'keeper');  // ← Agent → CSS class
  
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;  // ← LLM text → DOM text node
  
  box.append(tag, bubble);
  chatEl.appendChild(box);  // ← Inject into chat UI
}
```

**How LLM sees vs User sees:**

| LLM Sees (in next prompt) | User Sees (in GUI) |
|---------------------------|---------------------|
| Plain text: "Your proposal lacks..." | Styled bubble with gradient background |
| In `messages` array as `{role:'assistant', content:'...'}` | Red left border, KEEPER emoji, right-aligned |
| No formatting, just characters | Animated typewriter effect (optional) |

---

## Key Boundary Zone 4: Belief Object → Canvas Radar

### The Visualization

```javascript
// INPUT: 11-dimensional numeric profile
{openness:4, conscientious:3, extraversion:3, agreeableness:4, neuroticism:2, 
 logic:3, empathy:4, authority:2, risk:3, uncertainty:3, decisiveness:3}

// PROCESS: Map to polar coordinates
const toPoint = (val, i) => {
  const radius = ((val - 1) / 4) * R;  // [1,5] → [0,R]
  const angle = (i / 11) * Math.PI * 2;  // Distribute evenly around circle
  return [CX + Math.cos(angle) * radius, CY + Math.sin(angle) * radius];
};

// OUTPUT: Canvas polygon
ctx.beginPath();
axes.forEach((axis, i) => {
  const [x, y] = toPoint(profile[axis], i);
  i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
});
ctx.closePath();
ctx.fill();
ctx.stroke();
```

**Why Canvas?** Real-time redrawing as beliefs drift. Can overlay self-model (dashed) + observer-model (solid).

---

## Key Boundary Zone 5: Strategic Options → Scored Selection

### The Quantification

```javascript
// INPUT: Array of natural language options from LLM
[
  {text: "Clarify which rule blocks progress...", act: "ASK"},
  {text: "Propose concrete step with deadline...", act: "PROPOSE"},
  {text: "Evaluate last progress on obstacle...", act: "EVALUATE"}
]

// PROCESS: Score each option (text → numbers)
for (const opt of options) {
  let score = 0;
  if (opt.act !== lastSelfAct) score += 1.5;  // Diversity bonus
  if (/\b(deadline|criterion|verify)\b/i.test(opt.text)) score += 0.8;  // Specificity bonus
  if (opt.text.toLowerCase().includes(coreConflict)) score += 2.5;  // Relevance bonus
}

// OUTPUT: Single chosen option
return optionWithHighestScore;
```

**Multiple text→number techniques:**
- Categorical comparison (act !== lastAct)
- Regex matching (specificity keywords)
- Substring search (conflict relevance)
- Trigram similarity (Jaccard coefficient for repetition detection)

---

## The Complete Loop Diagram

```
┌──────────────┐
│  USER TYPES  │  Text: "I propose trial period"
└──────┬───────┘
       │ (1) DOM event
       ↓
┌──────────────┐
│ SEQUENCER    │  Phases: MEMO → OBSERVE → MODEL → PLAN → DRAFT → SPEAK → SEND
└──────┬───────┘
       │ (2) MODEL phase
       ↓
┌──────────────┐
│  MODELER LLM │  Text → {dims: {openness:4, authority:2, ...}}
└──────┬───────┘
       │ (3) Store beliefs
       ↓
┌──────────────┐
│ orchestrator │  beliefs.observerModelOfAlly = {...}
│    State     │
└──────┬───────┘
       │ (4) DRAFT phase
       ↓
┌──────────────┐
│ buildSystem  │  Object → JSON string: '{"openness":4,...}'
│   Prompt     │  Interpolate: MODEL_OF_OTHER(JSON): ${json}
└──────┬───────┘
       │ (5) API call
       ↓
┌──────────────┐
│  AGENT LLM   │  Prompt with JSON → "Your proposal lacks criteria..."
└──────┬───────┘
       │ (6) SEND phase
       ↓
┌──────────────┐
│ logAndRender │  Text → DOM: <div class="bubble">...</div>
│  ChatMessage │  CSS: .keeper .bubble {background: red gradient}
└──────┬───────┘
       │ (7) Visual output
       ↓
┌──────────────┐
│  USER SEES   │  Styled bubble with red border in chat
└──────────────┘
```

**Key Insight:** Each boundary has a specific transformation:
- **Text → Numbers:** Via LLM inference or regex scoring
- **Numbers → JSON:** Via `JSON.stringify()`
- **JSON → Prompt:** Via template literal interpolation
- **LLM → DOM:** Via `createElement()` + CSS classes
- **Numbers → Visual:** Via Canvas/trigonometry

---

## How To Ensure LLM Fits GUI

### 1. Constrain Output Format

```javascript
// Force JSON structure
response_format: {type: "json_object"}

// Validate and clamp values
payload.dims[key] = Math.max(1, Math.min(5, Number(payload.dims[key])));
```

### 2. Limit Token Length

```javascript
max_tokens: 90  // Keeps responses concise for chat bubbles
```

### 3. Extract Metadata

```javascript
// Parse discourse act from completion
const {intent, act} = extractIntentAndAct(textRaw);
// Render as pill: <span class="act-${act.toLowerCase()}">${act}</span>
```

### 4. Style Based on Role

```javascript
box.className = 'msg-box ' + (who === 'ALLY' ? 'ally' : 'keeper');
// CSS handles colors, borders, alignment
```

### 5. Embed Structured Data

```javascript
// Don't rely on LLM parsing natural language descriptions
// Give it parseable JSON with clear numeric values
MODEL_OF_OTHER(JSON): {"authority":4,"empathy":2}
// Not: "The other agent seems quite authoritative but lacks empathy"
```

---

## Testing These Boundaries

**Test 1:** Belief embedding
```javascript
const prompt = buildSystemPrompt('KEEPER', 'test');
console.log(prompt.match(/MODEL_OF_OTHER\(JSON\): (\{[^}]+\})/));
// Should see: {"openness":4,"authority":2,...}
```

**Test 2:** Styling varies by agent
```javascript
logAndRenderChatMessage('ALLY', 'test message');
// Check DOM: Should have class 'msg-box ally' and blue border
```

**Test 3:** Beliefs update after each turn
```javascript
const before = {...orchestratorState.beliefs.observerModelOfAlly};
// [Let conversation run one turn]
const after = {...orchestratorState.beliefs.observerModelOfAlly};
// Calculate drift: should be > 0
```

These boundaries are where **the magic happens** - where unstructured text becomes structured data, where code becomes prompt, where completion becomes visual interface.
