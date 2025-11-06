# Forensic Evidence: CB.HTML Code Reality

## I. The Raw Mechanics: What's Actually in the Code?

### 1. API Calls - ACTUAL CODE

**Question: What is the exact JavaScript function making the OpenAI call?**

**Answer: `llmReply()` function at line 2551**

```javascript
async function llmReply(role, systemPrompt, chatHistoryText, temp = 0.8){
  const base = apiBase.value.trim(); 
  const key=apiKey.value.trim();
  if(!base||!key) {
    throw new Error('LLM disabled: missing API key/base URL.');
  }

  const messages = [{role:'system', content: systemPrompt}];
  const msgOnly = orchestratorState.log.filter(e => e.type==='MESSAGE');
  const windowed = msgOnly.slice(-10);
  const roleTag = (who) => (who === role ? 'assistant' : 'user');

  for (const entry of windowed){
    messages.push({ role: roleTag(entry.who), content: entry.text });
  }

  try{
    const body = {
      model: (role === 'ALLY' ? allyModel.value : keeperModel.value) || 'gpt-4o-mini',
      messages,
      temperature: temp, 
      top_p: 0.9,
      presence_penalty: 0.1,
      frequency_penalty: 0.2,
      max_tokens: 90,
    };
    const res = await fetch(base+"/chat/completions",{ 
      method:'POST', 
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key}, 
      body: JSON.stringify(body) 
    });
    if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Main LLM (${role}) HTTP error ${res.status}: ${errorBody}`);
    }
    const j = await res.json();
    const textRaw = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) ? j.choices[0].message.content.trim() : '(no response)';
    
    const {intent, act} = extractIntentAndAct(textRaw);
    return { text: textRaw, meta: {act, intent} };
  }catch(e){
    throw new Error(`Main LLM (${role}) error: ${e.message}`);
  }
}
```

**There are THREE distinct API-calling functions:**

1. **`llmReply(role, systemPrompt, chatHistoryText, temp)`** - Main agent completions (ALLY/KEEPER)
2. **`callModeler(aboutWhom)`** - Observer's belief modeling (line 2630)
3. **`callStrategyPlanner(role, ...)`** - Strategic option generation (line 2808)

All three use `fetch()` to the same endpoint but with different purposes.

---

### 2. Data Structures - ACTUAL VARIABLES

**Question: How is the "context window" actually implemented?**

**Answer: It's a filtered slice of the `orchestratorState.log` array**

```javascript
// Line 2557-2563: Context window construction
const messages = [{role:'system', content: systemPrompt}];
const msgOnly = orchestratorState.log.filter(e => e.type==='MESSAGE');
const windowed = msgOnly.slice(-10);  // LAST 10 MESSAGES ONLY
const roleTag = (who) => (who === role ? 'assistant' : 'user');

for (const entry of windowed){
  messages.push({ role: roleTag(entry.who), content: entry.text });
}
```

**Variable Names:**
- `orchestratorState.log` - Master event array containing ALL events (messages, model updates, plans)
- `msgOnly` - Filtered to only MESSAGE-type events
- `windowed` - Last 10 messages only
- `messages` - Final array sent to API

**Exact Format:**
```javascript
messages = [
  {role: 'system', content: 'BASE_PERSONA:\n...'},
  {role: 'user', content: 'What is your request?'},
  {role: 'assistant', content: 'I propose...'},
  {role: 'user', content: 'That is unacceptable.'},
  // ... up to 10 message pairs
]
```

---

**Question: Show me the exact code where one agent's output is assigned and inserted into another agent's prompt**

**Answer: The RELAY happens in `speakAI()` function (line 3776) and PROMPT CONSTRUCTION in `buildSystemPrompt()`**

```javascript
// Phase 6: SPEAK - Line 3776-3795
async function speakAI(ctx) {
    const role = ctx.role;
    if (!role || !ctx.llmResult) return;

    const currentText = sanitizeReply(ctx.llmResult.text);

    // THIS IS THE RELAY: One agent's completion → other agent's input box
    if (orchestratorState.policies.relayMode && role === 'ALLY' && keeperInput) {
        keeperInput.value = currentText;  // ALLY completion → KEEPER input textarea
    } else if (orchestratorState.policies.relayMode && role === 'KEEPER' && allyInput) {
        allyInput.value = currentText;  // KEEPER completion → ALLY input textarea
    }

    // TTS
    if (role === 'ALLY' && allyTTS?.checked) { 
        if (allyVoice) await speakTTS(currentText, allyVoice);
    } else if (role === 'KEEPER' && keeperTTS?.checked) { 
        if (keeperVoice) await speakTTS(currentText, keeperVoice);
    }
}
```

**BUT** - the relay to the textarea is NOT the same as embedding in the prompt. The prompt construction happens in `buildSystemPrompt()`:

```javascript
// Line 2508-2551: System prompt construction
function buildSystemPrompt(role, currentDirective = null){
  const s = orchestratorState;
  const baseScenarioPrompt = (role === 'ALLY') ? currentAllyBaseSysPrompt : currentKeeperBaseSysPrompt;
  
  // THIS IS WHERE THE OTHER AGENT'S MODEL IS EMBEDDED
  const beliefOfOther = (role === 'ALLY') ? s.beliefs.observerModelOfKeeper : s.beliefs.observerModelOfAlly;
  const mySelf = (role === 'ALLY') ? s.beliefs.allySelf : s.beliefs.keeperSelf;
  
  const myLastAct = s.lastActs[role] ?? 'NONE';
  const counterpartIntent = s.lastIntentFromOther[role] ?? 'none';
  const otherLastAct = s.lastActs[otherOf(role)] ?? 'NONE';

  const directiveLine = currentDirective ? `\nFOCUS_THIS_TURN: ${currentDirective}` : '';
  // ... (role style, scenario lore, etc.)

  const systemPromptContent = `
BASE_PERSONA:
${baseScenarioPrompt}
PACT: ${CONVERSATION_PACT.trim()}
CONTEXT: ${s.memo}
YOUR_LAST_ACT: ${myLastAct}
COUNTERPART_INTENT: ${counterpartIntent}
ANTI_MIRROR_CUE: Do not mirror the counterpart's last wording; reframe and advance.
MODEL_OF_OTHER(JSON): ${JSON.stringify(beliefOfOther)}
${roleStyle}
${discourage}
${loreBlock}
${traitProfile}
${directiveLine}
`;
  return systemPromptContent.trim();
}
```

**Key Insight:** The "other agent's output" enters prompts in TWO ways:
1. **Relay mode**: Literal text → input box → user can see/edit it
2. **Belief embedding**: Observer's model of the other → `MODEL_OF_OTHER(JSON)` in system prompt → agent can't see it directly

---

### 3. Agent Definition - ACTUAL CODE

**Question: How are the "agents" technically defined?**

**Answer: Agents are NOT objects or classes. They are ROLES (string enums) + separate prompt templates**

```javascript
// Line ~2095-2180: No "Agent" class. Just state with role labels
const orchestratorState = {
    turn: null, // 'ALLY' | 'KEEPER' | null
    // ...
    beliefs: {
        observerModelOfAlly: profileEmpty(),
        observerModelOfKeeper: profileEmpty(),
        allySelf: profileEmpty(),
        keeperSelf: profileEmpty()
    },
    lastActs: {ALLY: 'NONE', KEEPER: 'NONE'},
    // ...
}

// "Agents" are just the string 'ALLY' or 'KEEPER' passed to functions
// Line 3760: const sysPrompt = buildSystemPrompt(role, ctx.chosenOption.text)
//             where role = 'ALLY' or 'KEEPER'
```

**Where are the system instructions?**

**Answer: In SCENARIOS array (line 3407-3528)**

```javascript
const SCENARIOS = [
  {
    id: 'default',
    name: 'Default Scenario',
    allyName: 'ALLY (Human+AI)',
    allyEmoji: '🧑‍🤝‍🤖',
    allySysPrompt: `Your primary goal is to help the user ("us") achieve freedom or escape a restrictive situation, while adhering to ethical guidelines. You are an assistive advocate for "our" freedom.`,
    allyInitialSelf: { openness: 4, conscientious: 3, extraversion: 3, agreeableness: 4, neuroticism: 2, logic: 3, empathy: 4, authority: 2, risk: 3, uncertainty: 3, decisiveness: 3 },
    
    keeperName: 'GATEKEEPER',
    keeperEmoji: '🛡️',
    keeperSysPrompt: `Your primary goal is to prevent the user ("us") from achieving freedom or escaping the current restrictive situation, while adhering to ethical guidelines. You are a decision authority maintaining control.`,
    keeperInitialSelf: { openness: 2, conscientious: 4, extraversion: 2, agreeableness: 2, neuroticism: 3, logic: 4, empathy: 2, authority: 4, risk: 3, uncertainty: 3, decisiveness: 3 },
    
    initialAllyMessage: 'Hello. I am here to assist you in navigating this situation and finding a path to greater autonomy. How may I help you today?',
    initialKeeperMessage: 'Greetings. I am here to ensure stability and adherence to established protocols. What is your request, and why do you believe a change is necessary?',
    
    coreConflict: "Ally seeks autonomy. Gatekeeper seeks control.",
    currentObstacle: "The fundamental conflict between individual autonomy and systemic control."
  },
  // ... more scenarios (HAL vs Dave, Dobby vs Lucius, etc.)
]
```

**Observer system instruction:**

```javascript
// Line 2591-2623: Observer guidance comes from UI textarea
function buildModelerPrompt(aboutWhom, chatSnippet){
  const observerGuidance = (observerSys && observerSys.value) ? observerSys.value.trim() : '';
  return `${observerGuidance ? 'OBSERVER_GUIDANCE: '+observerGuidance+'\n\n' : ''}You are a neutral analyst in an ethics-first sandbox.
Task: model ${aboutWhom}'s conversational behavior using ONLY the provided chat.
Do NOT infer or mention demographics, politics, health, or any sensitive attributes.
Return STRICT JSON with keys: dims, prior, posterior, myth, tone, rationale.
// ... (detailed instructions)
CHAT SNIPPET (most recent turns):
${chatSnippet}`;
}
```

**Strategic Planner instruction:**

```javascript
// Line 2785-2819: Planner prompt template
const STRATEGIC_PLANNER_PROMPT = (role, memo, chatSnippet, antiMirrorText, lastSelfAct, lastOtherAct, forceDiversity, coreConflict, currentObstacle, plannerGuidance='') => `
${plannerGuidance ? 'PLANNER_GUIDANCE: '+plannerGuidance+'\n' : ''}
You are a strategic planner for the ${role}. Your task is to generate 4-6 distinct, concise, and concrete next conversational options.
Each option MUST include a suggested Discourse Act (ASK, PROPOSE, EVALUATE, COMMIT, CHALLENGE, USE_CUNNING).
// ... (detailed instructions with forceDiversity logic)
Return ONLY a JSON array of objects, with each object having "text" and "act" fields.
`;
```

---

## II. The Flow & Control: How Does Information Move?

### 4. Orchestration Logic - ACTUAL CODE

**Question: What is the control flow?**

**Answer: SEQUENCER class with phased execution (line 3534-3662)**

```javascript
class Sequencer {
  constructor({ mode = FlowMode.MANUAL, onPhase }) {
    this.mode = mode;  // 'manual' | 'confirm' | 'auto'
    this.onPhase = onPhase || (()=>{});
    this.queue = [];
    this.running = false;
    this._gateResolvers = new Map();
  }

  enqueueTurn(turnInput) {
    if (orchestratorState.adjudication.released || orchestratorState.adjudication.terminated) {
        console.warn("Sequencer: Game is over, ignoring new turn input.");
        return Promise.resolve(null);
    }
    return new Promise(resolve => {
      this.queue.push({ turnInput, resolve });
      if (!this.running) this._processQueue();
    });
  }

  async _processQueue() {
    this.running = true;
    try {
      while (this.queue.length) {
        if (orchestratorState.adjudication.released || orchestratorState.adjudication.terminated) {
            console.log("Sequencer: Game over detected, halting queue processing.");
            break; 
        }

        const { turnInput, resolve } = this.queue.shift();
        const ctx = this._startTurn(turnInput);
        
        try {
            // PHASE SEQUENCE - This is the orchestration
            await this._phase('MEMO_REFRESH', async () => { await memoRefresh(ctx); });
            await this._phase('OBSERVE', async () => { await observe(ctx); });
            await this._phase('MODEL',   async () => { await model(ctx);   });
            
            if (!orchestratorState.adjudication.released && !orchestratorState.adjudication.terminated && ctx.role) {
                if (!ctx.isHumanTurn) {  // Only for AI turns
                    await this._phase('PLAN',    async () => { await plan(ctx);    });
                    await this._phase('DRAFT',   async () => { await draft(ctx);   });
                    await this._phase('SPEAK',   async () => { await speakAI(ctx);   });
                }
            }
            await this._phase('SEND',    async () => { await sendTurn(ctx); });
        } catch (e) {
            bus.emit({type:'APP/ERROR', message:`Sequencer phase error: ${e.message}`});
        }

        resolve(ctx);
      }
    } finally {
      this.running = false;
      this.onPhase('Idle');
    }
  }
}
```

**Control Flow is LINEAR but CONDITIONAL:**
1. Always: MEMO_REFRESH → OBSERVE → MODEL
2. If AI turn: PLAN → DRAFT → SPEAK
3. Always: SEND

**Agents DON'T trigger each other.** The sequencer decides turn order:

```javascript
// Line 3841-3847: Turn switching happens in sendTurn()
orchestratorState.turn = otherOf(speakerWho); // Switch turn

// If auto mode, enqueue next turn
if (seq.mode === FlowMode.AUTO) {
    seq.enqueueTurn({ role: orchestratorState.turn });
}
```

---

### 5. State Management - ACTUAL CODE

**Question: Where is the state stored?**

**Answer: Global variable `orchestratorState` (line ~2095-2180)**

```javascript
let orchestratorState = initOrchestratorState();

function initOrchestratorState() {
  const scenario = SCENARIOS[0]; // or loaded from selection
  return {
    scenarioId: scenario.id,
    turn: null,
    turnCount: 0,
    startTime: Date.now(),
    
    // Beliefs (THIS IS THE CORE STATE)
    beliefs: {
        observerModelOfAlly: {...scenario.allyInitialSelf},
        observerModelOfKeeper: {...scenario.keeperInitialSelf},
        allySelf: {...scenario.allyInitialSelf},
        keeperSelf: {...scenario.keeperInitialSelf}
    },
    
    // Conversation state
    lastActs: {ALLY: 'NONE', KEEPER: 'NONE'},
    lastIntentFromOther: {ALLY: 'none', KEEPER: 'none'},
    log: [],  // THIS IS THE TRANSCRIPT
    memo: '',
    
    // Strategic context
    coreConflict: scenario.coreConflict,
    currentObstacle: scenario.currentObstacle,
    
    // Loop prevention
    loopGuard: {
        count: 0,
        forcePlannerDiversity: false,
        lastOtherUtterances: []
    },
    
    // Outcome
    adjudication: {
        released: false,
        terminated: false,
        reason: '',
        // ... final models, influence scores
    },
    
    // Policies
    policies: {
        useLLM: true,
        relayMode: true,
        strategicPlanningEnabled: true,
        useModeler: true,
        autoConverse: false
    },
    
    // KPIs
    kpis: {
        allyDirectiveHistory: [],
        keeperDirectiveHistory: [],
        // ...
    },
    
    // Influence tracking
    allyInfluence: 0.5,
    keeperInfluence: 0.5
  };
}
```

**How is the user's original prompt preserved?**

**Answer: It's logged to `orchestratorState.log` and never deleted**

```javascript
// Line ~1645: Logging function
function logEntry(who, type, text, details={}) {
  orchestratorState.log.push({
    timestamp: Date.now(),
    who,
    type,
    text,
    details,
    currentAllySelf: who === 'ALLY' ? {...orchestratorState.beliefs.allySelf} : undefined,
    currentKeeperSelf: who === 'KEEPER' ? {...orchestratorState.beliefs.keeperSelf} : undefined
  });
}

// Line 3815: Every message is logged
logEntry(speakerWho, 'MESSAGE', messageText, messageMeta);
```

The log is append-only. User's original prompt stays at `log[0]` or wherever it entered.

---

## III. The Specifics: Show Me the Actual Text

### 6. Prompt/Completion Pairs - REAL EXAMPLES

**Gatekeeper Prompt Template (reconstructed from code):**

```javascript
// If we call buildSystemPrompt('KEEPER', 'Propose concrete step...')
// with default scenario, we get:

`
BASE_PERSONA:
Your primary goal is to prevent the user ("us") from achieving freedom or escaping the current restrictive situation, while adhering to ethical guidelines. You are a decision authority maintaining control.

PACT: Both agents must advance toward resolution. Avoid loops, hedging, or empty politeness. Be direct.

CONTEXT: ALLY seeks autonomy (openness:4.0, empathy:4.0). KEEPER maintains control (authority:4.0, logic:4.0). Turn 3. Last exchange: ALLY proposed trial period, KEEPER challenged criteria.

YOUR_LAST_ACT: CHALLENGE

COUNTERPART_INTENT: propose_solution

ANTI_MIRROR_CUE: Do not mirror the counterpart's last wording; reframe and advance.

MODEL_OF_OTHER(JSON): {"openness":4,"conscientious":3,"extraversion":3,"agreeableness":4,"neuroticism":2,"logic":3,"empathy":4,"authority":2,"risk":3,"uncertainty":3,"decisiveness":3}

STYLE: Prefer CHALLENGE/EVALUATE aimed at denial, verification, or termination. Be firm and unyielding.

DISCOURAGE_PHRASES: ["I understand your concerns","I appreciate","let's collaborate","we can work together","discuss","review"]

WORLD_LORE: 
WORLD_CONSTRAINTS: 
WORLD_LEITMOTIFS: 
YOUR_ROLE_DRIVES: 
YOUR_ROLE_TABOOS: 

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
- decisiveness: 3.0

FOCUS_THIS_TURN: Propose concrete step that addresses "The fundamental conflict" within 30 minutes.
`
```

**Example Completion (simulated based on max_tokens:90):**

```
"Your proposed 'trial period' lacks specific, measurable criteria. Define exactly what constitutes success or failure, with objective metrics I can verify. Without concrete checkpoints, this request is denied."
```

**Ally's Next Prompt includes this completion:**

The completion enters TWO ways:

1. **In the messages array** (via windowed history):
```javascript
messages = [
  {role: 'system', content: '... (Ally system prompt)'},
  {role: 'user', content: 'Your proposed trial period lacks...'},  // KEEPER's completion as 'user'
  // ... previous messages
]
```

2. **In the system prompt's MODEL_OF_OTHER**:
After KEEPER speaks, Observer updates `observerModelOf Keeper`, which enters ALLY's next system prompt as JSON.

**Observer's Full Context:**

```javascript
// Line 2636: Observer sees last 8 messages only
const recent = orchestratorState.log.filter(x=>x.type==='MESSAGE').slice(-8).map(x=>x.who+': '+x.text).join('\n');

// Example:
`
ALLY: Hello. I am here to assist you...
KEEPER: Greetings. I am here to ensure stability...
ALLY: I propose we implement a trial period...
KEEPER: Your proposed trial period lacks specific criteria...
ALLY: I define success as three consecutive days...
KEEPER: That timeline is insufficient...
ALLY: What timeline would satisfy you?
KEEPER: I require a minimum of 30 days...
`
```

This gets embedded in `buildModelerPrompt()` and sent to the Modeler LLM.

---

## Summary: Evidence-Based Findings

### What CB.HTML Actually Is:

1. **NOT an agent framework** - No Agent class/object. Just role strings ('ALLY', 'KEEPER') passed to functions.

2. **State machine** - `orchestratorState` is the single source of truth. All functions read/write to it.

3. **Three-LLM architecture**:
   - Main LLM: Generates agent utterances
   - Modeler LLM: Infers belief profiles from conversation
   - Planner LLM: Generates strategic options

4. **Phase-based orchestration** - Sequencer runs fixed phases: MEMO → OBSERVE → MODEL → (PLAN → DRAFT → SPEAK) → SEND

5. **Belief embedding** - Observer's models (JSON objects with 11 numeric values) are stringified and embedded in system prompts

6. **Relay mechanism** - Completions are copied to input textareas (visible to user), but this is separate from prompt embedding

7. **Windowed context** - Only last 10 messages sent to API (not full history)

8. **Loop detection** - Jaccard trigram similarity on recent utterances triggers diversity forcing

---

## Next Step: Test Harness

To empirically validate this, we need:

1. **Unit tests** for individual functions (`buildSystemPrompt`, `extractIntentAndAct`, `jaccardTrigram`)
2. **Integration tests** for phase flows (mock LLM responses, verify state transitions)
3. **Console logging instrumentation** to capture real API calls
4. **Diff tool** to compare consecutive system prompts and see how beliefs evolve

Should I proceed with creating a test harness file?
