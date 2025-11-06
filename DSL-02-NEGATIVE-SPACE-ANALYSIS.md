# DSL-02 Negative Space Analysis (NEG-3 NSDS-Core)

## Charter Negative Space

### NOT-LIST (What DSL-02 Should NOT Be)

**Non-Goals:**
- ❌ NOT an "always add" system (no infinite growth)
- ❌ NOT a single-operator preference system (no integrate-only loops)
- ❌ NOT a blind accumulator (ignoring spatial constraints)
- ❌ NOT a flat scene representation (needs hierarchical detail)
- ❌ NOT an unreflective system (must step back and consider)
- ❌ NOT a logging-free black box (must expose reasoning)

**Out-of-Scope Users/Contexts:**
- ❌ Users who want deterministic outcomes (this is emergent)
- ❌ Users who want 100% control (agents have autonomy)
- ❌ Users who want instant results (thinking takes time)
- ❌ Single-agent workflows (requires dual agent coordination)

**Anti-Metrics (What NOT to Optimize For):**
- ❌ Maximum entity count (more ≠ better)
- ❌ Fastest turn completion (speed ≠ quality)
- ❌ Always choosing same operator (diversity matters)
- ❌ Filling entire grid (negative space is valuable)

**Hard Constraints:**
- ✋ Grid capacity: 81 cells max
- ✋ Overlap penalty: entities at same position = problem
- ✋ Operator diversity: must use SHED/INTEGRATE/GROUND roughly equally
- ✋ Spatial awareness: must consider existing layout
- ✋ Reflection trigger: must pause and evaluate periodically

---

## Current Pathologies (What's Wrong)

### 1. **Integrate Loop Problem**
```
Turn 1: INNER → INTEGRATE → ADD house
Turn 2: OUTER → INTEGRATE → ADD road
Turn 3: INNER → INTEGRATE → ADD furniture
Turn 4: OUTER → INTEGRATE → ADD path
Turn 5: INNER → INTEGRATE → ADD table
...never SHED, never GROUND, just ADD ADD ADD
```

**Root Cause:** No negative feedback. System has no reason to NOT choose INTEGRATE.

### 2. **No Scene Graph**
```
Current: Flat list of entities
Missing: Hierarchical containment
- House
  ├─ Interior (INNER's domain)
  │  ├─ Furniture
  │  └─ Fireplace
  └─ Exterior (OUTER's domain)
     ├─ Garden
     └─ Fence
```

**Root Cause:** Agents can't work "inside" vs "outside" without containment model.

### 3. **No Spatial Reasoning**
```
Current: "Add entity at random position"
Missing: "This area is full, use SHED first"
Missing: "Entities are isolated, use INTEGRATE to connect"
Missing: "Layout is chaotic, use GROUND to organize"
```

**Root Cause:** No spatial analysis in prompts. Axes update but don't drive decisions.

### 4. **No Reflection/Pause**
```
Current: Turn → Turn → Turn (infinite)
Missing: Every N turns, STOP and ask:
- "Is this working?"
- "Should we change strategy?"
- "Is the grid too full?"
```

**Root Cause:** No meta-reasoning layer.

### 5. **No Logging**
```
Current: Silent failures, hard to debug
Missing: Console logs showing:
- Agent decisions
- Operator choices
- Why this operator was chosen
- Spatial analysis results
```

**Root Cause:** Development oversight.

---

## Option Map (Bounded Solutions)

### **Option 1: Spatial Constraint System**

**Benefits:**
- Prevents integrate loops via capacity checks
- Forces SHED when grid fills
- Forces GROUND when layout is chaotic
- Axes drive operator selection

**Key Risks:**
- Adds complexity to prompts
- Might be too restrictive (stifles creativity)
- Requires accurate spatial metrics

**Consequences if NOT Chosen:**
- Integrate loops continue
- Grid fills with clutter
- No emergent spatial reasoning

**Implementation:**
```javascript
function analyzeSpaceConstraints(scene) {
  const density = scene.entities.length / 81;
  const overlaps = findOverlaps();
  const isolated = findIsolated();
  
  return {
    shouldSHED: density > 0.6 || overlaps.length > 2,
    shouldINTEGRATE: isolated.length > 3,
    shouldGROUND: getLayoutChaos() > 0.5,
    capacity: 1.0 - density
  };
}
```

### **Option 2: Scene Graph + Dual Views**

**Benefits:**
- INNER sees interior detail layer
- OUTER sees exterior context layer
- No conflicts (separate namespaces)
- True inside/outside duality

**Key Risks:**
- Requires scene graph data structure
- More complex rendering
- Agents might lose sync

**Consequences if NOT Chosen:**
- Inside/outside distinction remains conceptual only
- Agents keep adding at same level
- No hierarchical composition

**Implementation:**
```javascript
const sceneGraph = {
  root: {
    id: 'scene',
    children: [
      {
        id: 'house1',
        position: [4, 4],
        interior: {  // INNER's domain
          children: [
            { id: 'furniture1', type: 'chair' }
          ]
        },
        exterior: {  // OUTER's domain
          children: [
            { id: 'garden1', type: 'garden' }
          ]
        }
      }
    ]
  }
};
```

### **Option 3: Reflection Layer + Kill Criteria**

**Benefits:**
- Periodic pause for evaluation
- Can detect stuck patterns
- Can pivot strategy mid-session
- Clear stop conditions

**Key Risks:**
- Interrupts flow
- Might pause too often
- Requires meta-reasoning prompts

**Consequences if NOT Chosen:**
- No way to escape bad patterns
- Runs forever without stopping
- No awareness of failure states

**Implementation:**
```javascript
function shouldReflect(state) {
  if (state.turn % 10 === 0) return true;  // Every 10 turns
  if (state.sameOperatorCount > 5) return true;  // Stuck in loop
  if (state.axisReadings.imbalance > 7) return true;  // Severe imbalance
  return false;
}

async function performReflection(state) {
  const analysis = await llmCall(`
    Review the last 10 turns. Are we stuck in a pattern?
    Should we switch strategies?
    Return: { continue: true/false, reasoning: "..." }
  `);
  
  if (!analysis.continue) {
    triggerKillCriteria('pattern_stuck');
  }
}
```

---

## Decision Record

### **Final Choice: ALL THREE (Phased)**

**Phase 1 (Immediate):**
- Add logging (zero subtraction needed)
- Add spatial constraint system
- Fix integrate loop

**Phase 2 (Next):**
- Add reflection layer
- Add kill criteria
- Add pause/evaluate

**Phase 3 (Later):**
- Implement scene graph
- Separate interior/exterior views
- Full hierarchical composition

### **Dissent & Response**

**Dissent 1:** "All three is too much, pick one"
- **Response:** Phase 1 is minimal (constraints + logging). Others deferred.

**Dissent 2:** "Spatial constraints will kill creativity"
- **Response:** Constraints create pressure to use SHED/GROUND, which is MORE creative than integrate-only. Negative space = fertile ground.

**Dissent 3:** "Scene graph is overkill"
- **Response:** Agreed for now. Deferred to Phase 3. Phase 1 uses flat scene with better spatial analysis.

### **Freeze Period**
- Phase 1: Build now, freeze for 1 week of testing
- Reopen triggers:
  - Integrate loop returns despite constraints
  - New pathology emerges
  - User requests specific change

---

## Stop-Doing Ledger (Enforced Subtractions)

### **What We STOP Doing:**

1. **STOP: Blind operator selection**
   - Old: Agent picks any operator
   - New: Spatial constraints guide selection
   - Capacity freed: Reduces bad decisions
   - Owner: Agent prompt logic
   - Date: Now

2. **STOP: Ignoring grid density**
   - Old: Add entities regardless of space
   - New: Check density before ADD
   - Capacity freed: Grid stays usable
   - Owner: executeAction() function
   - Date: Now

3. **STOP: Silent execution**
   - Old: No logs, hard to debug
   - New: Console logs for every decision
   - Capacity freed: Development time saved
   - Owner: All agent functions
   - Date: Now

4. **STOP: Infinite turns without pause**
   - Old: Auto mode runs forever
   - New: Pause every 10 turns for reflection
   - Capacity freed: Prevents runaway sessions
   - Owner: Auto mode handler
   - Date: Phase 2

5. **STOP: Flat scene assumption**
   - Old: All entities at same level
   - New: Interior/exterior separation (Phase 3)
   - Capacity freed: True dual context
   - Owner: Scene graph implementation
   - Date: Phase 3 (deferred)

---

## Kill Criteria (When to Pivot/Pause/Stop)

### **PIVOT (Change Strategy):**
- Same operator used 5+ times in a row
- Axis imbalance exceeds 7 on any dimension
- Grid density > 0.8 (nearly full)
- User manually stops auto mode

### **PAUSE (Reflect Before Continuing):**
- Every 10 turns in auto mode
- Entity count > 40
- Overlaps detected (entities at same position)
- Axis readings change by < 0.1 for 5 turns (stagnation)

### **STOP (End Session):**
- Grid completely full (81 entities)
- User intent explicitly satisfied (LLM confirms)
- 50 turns reached (time limit)
- Critical error (API failure, invalid JSON, etc.)

### **Observable Metrics:**
```javascript
const killMetrics = {
  operatorRepetition: countConsecutiveSame(),  // → PIVOT if > 5
  gridDensity: entities.length / 81,           // → PIVOT if > 0.8
  axisImbalance: maxAxisDelta(),               // → PIVOT if > 7
  turnCount: state.turn,                        // → STOP if > 50
  overlaps: findOverlaps().length,             // → PAUSE if > 0
  stagnation: checkStagnation(5)               // → PAUSE if true
};
```

---

## Quality Checks (Applied)

✅ **Every goal has a corresponding non-goal**
- Goal: Diverse operator use ↔ Non-goal: Integrate-only loops
- Goal: Spatial awareness ↔ Non-goal: Blind accumulation
- Goal: Emergent reasoning ↔ Non-goal: Deterministic scripting

✅ **Every addition has a named subtraction**
- Add: Spatial constraints → Subtract: Blind operator choice
- Add: Reflection layer → Subtract: Infinite auto mode
- Add: Logging → Subtract: Silent execution

✅ **Option Map includes not-chosen consequences**
- If NOT spatial constraints → integrate loops continue
- If NOT scene graph → no true inside/outside
- If NOT reflection → no escape from bad patterns

✅ **Decision Record includes dissent, freeze, triggers**
- Dissent documented with responses
- Freeze: 1 week per phase
- Triggers: Loop returns, new pathology, user request

✅ **Kill Criteria are clear, observable, feasible**
- Operator repetition count: observable
- Grid density: calculable
- Turn count: tracked
- All have clear thresholds and owners

---

## Implementation Plan (Phase 1 Only)

### **Changes to Make:**

1. **Add Console Logging**
   ```javascript
   console.log('[INNER]', decision);
   console.log('[SPATIAL]', constraints);
   console.log('[AXIS]', readings);
   ```

2. **Add Spatial Constraint Function**
   ```javascript
   function computeConstraints(scene, axes) {
     const density = scene.entities.length / 81;
     const overlaps = findOverlaps(scene.entities);
     const isolated = findIsolated(scene.entities);
     const chaos = computeChaos(axes);
     
     return {
       forceSHED: density > 0.6 || overlaps.length > 2,
       forceINTEGRATE: isolated.length > 3 && density < 0.3,
       forceGROUND: chaos > 0.7,
       capacity: 1.0 - density,
       reasoning: `Density: ${density.toFixed(2)}, Overlaps: ${overlaps.length}, Isolated: ${isolated.length}`
     };
   }
   ```

3. **Inject Constraints into Agent Prompts**
   ```javascript
   ## SPATIAL CONSTRAINTS (CRITICAL):
   ${constraints.forceSHED ? '⚠️ MUST use SHED - grid too full' : ''}
   ${constraints.forceINTEGRATE ? '⚠️ SHOULD use INTEGRATE - entities isolated' : ''}
   ${constraints.forceGROUND ? '⚠️ SHOULD use GROUND - layout chaotic' : ''}
   
   Grid capacity: ${(constraints.capacity * 100).toFixed(0)}% available
   ```

4. **Track Operator History**
   ```javascript
   state.operatorHistory = [];
   
   function detectLoop() {
     const last5 = state.operatorHistory.slice(-5);
     return last5.every(op => op === last5[0]);
   }
   ```

5. **Reorganize UI Layout**
   ```
   Top: Starter input + controls
   Center: Grid + Axes
   Bottom: Observer memo
   Left: INNER chat
   Right: OUTER chat
   ```

---

## Next Actions

1. ✅ This analysis document complete
2. ⏳ Implement Phase 1 changes to dsl-02
3. ⏳ Test for 1 week
4. ⏳ Evaluate against kill criteria
5. ⏳ Decide on Phase 2 (reflection layer)

---

**Status:** Analysis complete. Ready to implement Phase 1 (logging + spatial constraints + UI reorg).

**Key Insight:** The integrate loop is a symptom of missing negative space. By defining what NOT to do (don't add when full, don't ignore isolation, don't repeat same operator), we create pressure for diverse, emergent behavior.

**Negative space = constraint = creativity.**
