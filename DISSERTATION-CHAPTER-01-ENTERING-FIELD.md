# Chapter: Observing the Observers
## Part I: Entering the Field

### 1.1 Research Site and Objectives

**Date:** November 4, 2025  
**Location:** `/Users/gaia/FUNC-SUB/`  
**Artifacts:** Two HTML files (cb.html, func-orb-training.html)  
**Research Question:** How do multi-agent LLM systems implement observer roles, and what distinguishes second-order from first-order cybernetic architectures in practice?

**Initial Hypothesis:**  
Both systems appeared to implement three-agent architectures with observer components that model the primary agents. Preliminary inspection suggested family resemblance in structure (three agents, radar visualizations, phased execution).

**Actual Discovery:**  
One system (CB) integrates LLMs recursively for agent modeling; the other (ORB) uses no LLMs in its core loop. What appeared as architectural similarity was **naming convention convergence** masking **functional divergence**.

---

### 1.2 Methodological Pivot: From Ontology to Forensics

**Initial Approach (Failed):**
- Build conceptual model from system descriptions
- Assume LLM integration based on variable names
- Create ontological categories before examining evidence

**Problems Encountered:**
```
PROBLEM 1: "systemPrompt" field in ORB suggests LLM usage
EVIDENCE: Never passed to fetch() - only displayed in UI
CONCLUSION: Variable naming is aspirational, not descriptive

PROBLEM 2: Both systems have "Observer" components
EVIDENCE: CB's Observer calls LLMs and embeds results in prompts
          ORB's Observer accumulates stats for display only
CONCLUSION: Same name, different function
```

**Corrected Approach (Information Foraging):**

Following Pirolli & Card's Information Foraging Theory (1999), I adopted a "patch model" where:
- **Patches** = Code modules (functions, event handlers)
- **Scent** = Variable names, function signatures
- **Foraging** = Systematic exploration until diminishing returns
- **Between-patch transitions** = Following data flows

**Foraging Sequence:**
1. Search for all `fetch(` calls (API boundaries)
2. Trace variable flows backward (where does data come from?)
3. Trace variable flows forward (where does data go?)
4. Map state mutations (what changes when?)
5. Test claims empirically (console validation)

---

### 1.3 The Two Systems: CB and ORB

#### CB.HTML: Centaur Box Experiment

**File Metadata:**
```
Title: Centaur Box Experiment
Subtitle: Ethical Sandbox + Hidden-Model Prompts
Size: ~4,200 lines
Primary Dependencies: OpenAI API
Architecture: Multi-agent conversational system
```

**First Impression (from UI):**
Three panels (ALLY, GATEKEEPER, OBSERVER) with chat interfaces, radar visualizations, and control settings. Appears to be a dialogue system with real-time belief modeling.

**Code Reality (from inspection):**
```javascript
// Three distinct LLM-calling functions found:
llmReply(role, systemPrompt, chatHistoryText, temp)      // Line 2551
callModeler(aboutWhom)                                    // Line 2630
callStrategyPlanner(role, currentMemo, chatHistory, ...) // Line 2808
```

**Surprise Discovery:** Not one LLM, but THREE different API calls per agent turn:
- Planner generates strategic options
- Drafter generates utterance
- Modeler infers belief profile

#### FUNC-ORB-TRAINING.HTML: Orbital Navigation Training Ground

**File Metadata:**
```
Title: Orbital Navigation - Training Ground
Size: ~3,800 lines
Primary Dependencies: Three.js, external psychograph dataset
Architecture: 3D spatial navigation interface
```

**First Impression (from UI):**
Three channels (INNER, OUTER, OBSERVER) with 3D grid visualizations, radar displays, and movement controls. Appears to be a multi-agent system with spatial reasoning.

**Code Reality (from inspection):**
```javascript
// Search for LLM calls:
$ grep -n "fetch.*chat/completions" func-orb-training.html
// RESULT: No matches in core loop

// Search for API calls:
$ grep -n "fetch(" func-orb-training.html
// RESULT: Only for loading external datasets, not for LLM inference
```

**Surprise Discovery:** "Agents" are UI viewports (Three.js scenes), not conversational entities. The system is a **visualization tool**, not a generative system.

---

### 1.4 Field Notes: Initial Contact

**Field Note 2025-11-04 22:15**

Opened CB.HTML in browser. System presents scenario selection dropdown. Selected "Default Scenario" (ALLY vs GATEKEEPER). Clicked "AUTO" mode.

**Observation Log:**

```
T+0s:   ALLY: "Hello. I am here to assist you in navigating..."
        [Typing indicator appears for KEEPER]
        
T+3.2s: KEEPER: "Greetings. I am here to ensure stability..."
        [Observer radar updates - polygon shifts]
        
T+6.8s: ALLY: "I propose we implement a trial period..."
        [KEEPER input box auto-fills with ALLY's text]
        [Typing indicator for KEEPER appears]
        
T+10.1s: KEEPER: "Your proposal lacks specific criteria..."
         [Observer narrative updates: "ALLY seeks autonomy (openness:4.0)..."]
```

**First Questions:**
1. How does ALLY's text appear in KEEPER's input box? (Relay mechanism?)
2. Why does Observer radar change shape? (Belief updating?)
3. What prompts are being sent to the LLM? (Need to inspect)

**Field Note 2025-11-04 22:30**

Opened browser console. Instrumented `fetch()` to log API calls:

```javascript
const originalFetch = window.fetch;
window.fetch = function(...args) {
    if (args[0].includes('/chat/completions')) {
        console.log('[API CALL]', JSON.parse(args[1].body).messages);
    }
    return originalFetch.apply(this, args);
};
```

**Logged Output (Planner call):**

```json
[
  {
    "role": "system",
    "content": "You are a strategic planner for the KEEPER..."
  },
  {
    "role": "user",
    "content": "Current obstacle: The fundamental conflict...\n\nGenerate 4-6 options..."
  }
]
```

**Logged Output (Drafter call - KEEPER's turn):**

```json
[
  {
    "role": "system",
    "content": "BASE_PERSONA:\nYour primary goal is to prevent...\n\nMODEL_OF_OTHER(JSON): {\"openness\":4,\"conscientious\":3,...}\n\nFOCUS_THIS_TURN: Propose concrete step that addresses..."
  },
  {
    "role": "user",
    "content": "I propose we implement a trial period..."
  },
  {
    "role": "assistant",
    "content": "I define success as three consecutive days..."
  }
]
```

**Critical Finding:** The `MODEL_OF_OTHER(JSON):` line embeds a JSON object in the system prompt. This is the ALLY's profile as modeled by the Observer. KEEPER "sees" this when generating completions.

**Field Note 2025-11-04 22:45**

Opened ORB in browser. Pressed arrow keys to move avatar on grid. Radar updates immediately.

**Observation Log:**

```
Position (4,4) → Radar: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
Position (3,4) → Radar: [0.5, 0.7, 0.3, 0.8, 0.4, 0.6]
Position (4,4) → Radar: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3]
```

**Test:** Return to (4,4) → Same radar values every time.

**Conclusion:** Deterministic lookup. Position determines display. No inference, no LLM.

Typed in chat: "addfire"

**System Response (instant, no API delay):**

```
🔥 Fire created at (3, 7)!
```

**Inspection of code:**

```javascript
// Line 3621-3636
if (lowerText === 'addfire' || lowerText === 'add fire') {
  const emptyCell = findRandomEmptyCell(channel);
  const fire = {type: 'FIRE', label: 'Fire', row: emptyCell.row, col: emptyCell.col};
  entities.push(fire);
  addMessage(channel, 'system', `🔥 Fire created at (${emptyCell.row}, ${emptyCell.col})!`);
}
```

**Finding:** Local string matching. No LLM parsing. This is command routing, not natural language understanding.

---

### 1.5 The Methodological Challenge

**The Problem:**

Two systems with similar surface features but potentially different internal mechanisms. How to compare them rigorously?

**Rejected Approaches:**

1. **Pure behavioral comparison:** Would miss internal architecture differences
2. **Pure code reading:** Would miss emergent dynamics
3. **Conceptual modeling first:** Led to false assumptions (the "systemPrompt" error)

**Adopted Approach: Forensic Evidence + Ethnographic Observation**

Combine:
- **Code archaeology:** Variable tracing, function signature analysis
- **Live observation:** Console logging, state inspection
- **Empirical testing:** Modify variables, observe outcomes
- **Comparative analysis:** Side-by-side evidence tables

**The "Investigative Questions" Method:**

Instead of "What is the architecture?" ask:
- What is the exact JavaScript function making the API call?
- What are the variable names for the messages array?
- Show me the code where one agent's output enters another's prompt.
- Where is the literal system prompt string?

These questions force **grounded answers** with **line numbers** and **actual code**.

---

### 1.6 Scope and Boundaries

**What This Analysis Covers:**

1. **Prompt Construction:** How text, numbers, and structured data become LLM prompts
2. **Belief Modeling:** How systems represent and update agent profiles
3. **Observer Roles:** Where observers sit in causal loops
4. **GUI-Prompt Coupling:** How LLM outputs become styled interface elements

**What This Analysis Does Not Cover:**

1. **LLM Internals:** Treating LLM as black box (prompt → completion)
2. **User Experience Design:** Focusing on mechanics, not aesthetics
3. **Ethical Evaluation:** Not assessing moral implications of agent dynamics
4. **Performance Optimization:** Not analyzing speed or efficiency

**Delimitation Rationale:**

This is a **structural analysis** of multi-agent architectures. The goal is to understand **how these systems work**, not whether they work well or what they should do.

---

### 1.7 Chapter Roadmap

**Part II: First-Order Observations**  
Walk through both systems as black boxes, describing visible behavior and inferring structure.

**Part III: The Forensic Turn**  
Open the code, trace variables, map API calls, validate hypotheses with tests.

**Part IV: Boundary Zones**  
Analyze the interfaces where text becomes numbers, code becomes prompts, completions become GUI.

**Part V: Pathologies Encountered**  
Document bugs, design flaws, and misleading patterns discovered during analysis.

**Part VI: Resonances Discovered**  
Identify common patterns, shared design choices, and theoretical foundations.

**Part VII: The Critical Distinction**  
Articulate the difference between second-order and first-order cybernetic systems.

**Part VIII: Implications**  
Propose design principles, diagnostic tools (OTU), and future research directions.

---

**Next:** Part II - Detailed system walkthroughs with full prompt examples and code traces.
