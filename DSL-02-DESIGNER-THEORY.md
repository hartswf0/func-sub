# DSL-02: Theory for Designers
## Compositional Practice Through Constraint and Observation

---

## Introduction

DSL-02 is not a tool for drawing or direct manipulation. It is a **compositional practice tool** where scenes emerge through:

1. **Constraint**: Operators limit action space (only SHED, INTEGRATE, or GROUND)
2. **Observation**: God's eye view reveals patterns, clusters, relations
3. **Choice**: Agents select based on homeostatic imbalance
4. **Reflection**: What was chosen and NOT chosen shapes next turn

This creates a design space between:
- **Full control** (traditional CAD/3D tools)
- **No control** (pure generative art)

---

## Core Theory

### 1. Negative Space as Primary Material

**Traditional Design:** Add elements until composition feels complete
**DSL-02:** Define by what is NOT there

The SHED operator is as important as INTEGRATE. Creating negative space is an additive act. Removing elements reveals structure.

**Example:**
```
Dense scene (20 entities):
- Cluttered, no breathing room
- Relationships unclear

After SHED (12 entities):
- Negative space emerges
- Patterns become visible
- Relationships clarify
```

**Design Implication:** Designers must resist the urge to "fill" the grid. Empty cells are compositional material.

---

### 2. Dual Perspectives Generate Complexity

**INNER sees:**
- Parts (7) - Too fragmented → SHED
- Heart (3) - Need anchor → GROUND
- Seen (4) - Details visible

**OUTER sees:**
- Whole (2) - No coherence → INTEGRATE
- Resource (5) - Flow adequate
- Unseen (7) - Potential high

**Same scene, different readings.**

INNER wants to simplify parts. OUTER wants to unify whole. This tension creates:
- **Productive conflict** (agents negotiate through operator choice)
- **Emergent balance** (neither agent fully controls outcome)
- **Compositional dynamics** (scene oscillates between fragmentation and unity)

**Design Implication:** Don't expect linear progress. Scenes develop through cycles of tension and resolution.

---

### 3. Operators as Strategic Frames

SHED, INTEGRATE, GROUND are not just actions. They are **ways of seeing**.

**SHED Frame:**
- What is excess?
- What blocks circulation?
- Where is density too high?
- What obscures the essential?

**INTEGRATE Frame:**
- What is scattered?
- What could unify?
- What connections are missing?
- What pattern wants to emerge?

**GROUND Frame:**
- What needs stability?
- Where is the anchor?
- What establishes proportion?
- How do parts relate to whole?

**Design Implication:** Observer generates three framings per turn. Agents choose which lens to apply. Compositional practice is **choosing how to see**.

---

### 4. Model OF = Model FOR (Generative Observation)

Observer's analysis uses the same vocabulary as agent's actions:

**Observer READS:**
- "3 fences clustered at (4,4)"
- "Path segments scattered"
- "No compositional center"

**Agent WRITES:**
- Remove 3 fences (responds to cluster)
- Unify path segments (responds to scatter)
- Anchor garden at center (responds to lack)

**Same language, bidirectional.**

This means:
- Whatever you can **observe**, you can **generate**
- Whatever you can **describe**, you can **compose**
- **Analysis = Synthesis**

**Design Implication:** Improve compositional vocabulary → improve compositional capability. The richer your scene descriptions, the more nuanced your options.

---

### 5. Reflection Prevents Pathology

Without reflection, agents fall into loops:
```
Turn 10: SHED
Turn 11: SHED
Turn 12: SHED
Turn 13: SHED
...
```

Reflection cycle asks:
- **What was chosen?** SHED
- **What was NOT chosen?** INTEGRATE, GROUND
- **Why?** Density was high
- **Should we continue?** Only if density still high
- **What changed?** Check scene state

**Design Implication:** Use memo/reflection log to identify stuck patterns. If same operator appears 3+ times, scene may need different framing.

---

## Design Patterns for Practitioners

### Starting Strategies

**1. Sparse Start**
```
Prompt: "a single house in vast space"
Turn 1: INNER → GROUND → Anchor house
Turn 2: OUTER → INTEGRATE → Add connecting path
Turn 3: INNER → INTEGRATE → Add interior detail
Turn 4: OUTER → INTEGRATE → Add neighboring structure
```

Benefits: Negative space dominates early. Relationships emerge gradually.

**2. Dense Start**
```
Prompt: "a crowded market festival"
Turn 1: INNER → SHED → Remove excess stalls
Turn 2: OUTER → GROUND → Organize circulation
Turn 3: INNER → SHED → Clear interior clutter
Turn 4: OUTER → INTEGRATE → Unify market structure
```

Benefits: Practice reduction. Forces SHED operator. Reveals essential structure.

**3. Geometric Start**
```
Prompt: "orthogonal grid of structures"
Turn 1: OUTER → GROUND → Establish grid pattern
Turn 2: INNER → GROUND → Align interior details
Turn 3: OUTER → INTEGRATE → Connect grid cells
Turn 4: INNER → INTEGRATE → Add interior connections
```

Benefits: Strong compositional framework. Good for studying proportion.

---

### Intervention Techniques

**Hands-Off (Observational)**
- Let agents lead for 10-20 turns
- Only use observer chat to understand decisions
- Study emergent patterns
- Document what happens without intervention

**Use Case:** Research how dual homeostasis creates balance

**Guided (Conversational)**
- Use STEP mode (one turn at a time)
- Chat with observer about options each turn
- Discuss: "Why would we shed instead of integrate?"
- Let agents choose but shape alternatives through dialogue

**Use Case:** Collaborative composition with AI reasoning visible

**Directed (Manual)**
- Use agent override inputs
- Give specific instructions: "INNER: remove all fences"
- Blend automated choice with manual direction
- Switch between hands-off and hands-on mid-session

**Use Case:** Design exploration where you test specific hypotheses

---

### Reading the Axes

**Extreme Imbalances (>7 or <3):**
- Signal urgent need for correction
- Agent will strongly prefer balancing operator
- Scene is out of homeostasis

**Gradual Shifts (+1 or -1 per turn):**
- Scene evolving smoothly
- Homeostasis working
- Both agents contributing

**Oscillation (4↔6 repeated):**
- Productive tension
- Agents negotiating
- Scene finding dynamic equilibrium

**Stagnation (no change for 5+ turns):**
- Potential pathology
- May be stuck in loop
- Consider override or reset

---

## Compositional Principles from DSL-02

### 1. **Constraint Breeds Creativity**

Three operators (not infinite actions) forces:
- Strategic thinking
- Trade-off awareness
- Intentional choice

Compare:
- **Unconstrained:** "Add anything anywhere" → paralysis
- **Constrained:** "SHED, INTEGRATE, or GROUND?" → clarity

### 2. **Dual Perspectives Reveal Blind Spots**

INNER sees detail problems OUTER misses.
OUTER sees system problems INNER misses.

Neither is "right" - both are necessary.

### 3. **Observation Creates Options**

Observer doesn't decide - observes generates **three paths**.

This means:
- Alternatives always visible
- Choice is informed
- Unchosen paths are documented (what we didn't do)

### 4. **Reflection Cultivates Harmony**

Logging cycles of choice/consequence prevents:
- Repetition pathology
- Stuck patterns
- Blind automation

Creates:
- Awareness of trends
- Opportunity for course correction
- Historical context for decisions

### 5. **Negative Space is Active**

Empty cells are not "nothing" - they are:
- Breathing room
- Potential
- Compositional material
- Relationship space

SHED creates negative space as primary action.

---

## For Design Research

### Documenting Sessions

**Export Logs:**
- Click 📋 (bottom-left) → Export Log
- Saves: entities, axes, memo, agent messages, turn count
- JSON format for analysis

**What to Track:**
- Operator frequency (how often SHED vs INTEGRATE vs GROUND)
- Axis trends over time (do axes converge toward 5?)
- Consensus vs conflict (do agents agree or disagree?)
- Turn count to "completion" (when does scene feel done?)

### Research Questions

1. **How does starting prompt shape operator distribution?**
   - Sparse prompts → more INTEGRATE?
   - Dense prompts → more SHED?

2. **Do agents develop preferences over time?**
   - Does INNER favor certain operators?
   - Does OUTER have patterns?

3. **What role does user intervention play?**
   - How often do users override?
   - What triggers intervention?

4. **When do scenes feel "complete"?**
   - Is it axis balance (all near 5)?
   - Is it entity count threshold?
   - Is it visual coherence?

5. **What compositional patterns emerge?**
   - Do certain operator sequences create recognizable structures?
   - Can we identify "recipes" (e.g., GROUND → INTEGRATE → SHED)?

---

## Integration with FUNC Ecosystem

### Relationship to func-orb-training

**func-orb-training:**
- 3D orbital navigation
- Character movement
- Real-time spatial exploration
- Direct manipulation

**DSL-02:**
- 2D grid composition
- Agent-mediated building
- Turn-based reflection
- Constraint-based design

**Complementary:** Orb for exploration, DSL for composition.

### Relationship to dsl-01

**dsl-01:**
- Single agent
- Operator modes as chat
- Analytical (suggests, doesn't build)

**dsl-02:**
- Dual agents
- Three-options protocol
- Generative (builds, not just suggests)

**Evolution:** DSL-01 was spectator problem. DSL-02 is assembly system.

---

## Practical Tips

### Starting Out

1. **Begin with sparse prompts** - easier to understand
2. **Use STEP mode** - see one turn at a time
3. **Chat with observer** - ask questions about options
4. **Watch console logs** - see compositional analysis
5. **Export early and often** - don't lose interesting sessions

### When Stuck

1. **Check axis readings** - what's imbalanced?
2. **Read recent memo** - what's the pattern?
3. **Override one agent** - break the loop manually
4. **Try opposite operator** - if shedding, try integrate
5. **Reset and try different prompt** - start fresh

### Advanced Techniques

1. **Alternate hands-off/hands-on** - observe then direct
2. **Test operator sequences** - does GROUND → INTEGRATE → SHED work?
3. **Study agent disagreements** - when do they conflict?
4. **Export at key moments** - before/after major changes
5. **Compare multiple sessions** - same prompt, different outcomes?

---

## Conclusion

DSL-02 is a **compositional research tool** disguised as a scene builder.

It teaches:
- How to see (observation)
- How to frame (operators as lenses)
- How to balance (dual homeostasis)
- How to reflect (memo as learning)

For designers, it offers a space between control and automation where composition emerges from **strategic constraint, dual perspective, and reflective practice**.

The scene you create is less important than **how you learned to see** while creating it.

---

**Start composing:** `open dsl-02.html` 🎯
