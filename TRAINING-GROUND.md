# THE TRAINING GROUNDS: OPERATING SYSTEM MANUAL
## Infrastructure Platform Documentation

---

## **PART I: FOUNDATIONAL ARCHITECTURE**

### **1.1 System Overview**

The Training Grounds is a **6-axis spatial reasoning substrate** that transforms unstructured scenes into ordered operational states through three fundamental operators: SHED, INTEGRATE, GROUND.

**Core Principle**: All meaningful transformation occurs through axis-operator interactions on a bounded spatial field.

```
SUBSTRATE = {6 Axes} × {3 Operators} × {9×9 Grid} × {Time Layers}
```

---

### **1.2 The Six Axes of Being**

Each axis represents a **dual-polar tension** between inner/outer aspects of existence:

| Axis | Inner Pole | Outer Pole | Tension |
|------|-----------|-----------|---------|
| **I · IDENTITY** | Instinct | Reason | Immediate ↔ Deliberate |
| **E · EXPERIENCE** | Seen | Unseen | Observable ↔ Inferred |
| **L · LANGUAGE** | Ideas | Ideology | Units ↔ Systems |
| **D · DOMAIN** | Source | Resource | Origin ↔ Asset |
| **P · PURPOSE** | Heart | Head | Affective ↔ Cognitive |
| **O · ORDER** | Parts | Whole | Components ↔ Structure |

**Operational Invariant**: Every scene state can be decomposed into 12 scalar measurements (6 axes × 2 poles) on a 1-9 scale.

---

### **1.3 The Operator Triad**

```
S → I → G  (The Canonical Pipeline)
```

| Operator | Action | Effect | Time Direction |
|----------|--------|--------|----------------|
| **SHED** | Remove | Entropy reduction | T0 → T0' (simplify present) |
| **INTEGRATE** | Connect | Pattern formation | T0 → T+1 (create future) |
| **GROUND** | Stabilize | Order formalization | T+1 → T+∞ (perpetuate structure) |

**Critical Insight**: Operators are NOT sequential stages—they are **mode switches** selected by scene pathology.

---

## **PART II: OBSERVER INFRASTRUCTURE**

### **2.1 The Observer Layer**

Every operation begins with **neutral spatial observation** that produces entropy readings without interpretation.

```javascript
OBSERVER_PROTOCOL = {
  input: SceneState(T0),
  analyze: SpatialMetrics → AxisReadings,
  output: EntropyAssessment + OperatorSignal
}
```

**Observer Guidance Template**:
```
## SPATIAL ENTROPY ASSESSMENT (T0)

Detected Pathologies:
- [Pathology Type]: [Specific Evidence]
  → Axis Impact: [Axis]/[Pole] = [Score]/9

Axis Readings:
- I (Identity): Instinct=X/9, Reason=Y/9 [signal: Z]
- E (Experience): Seen=X/9, Unseen=Y/9 [signal: Z]
- L (Language): Ideas=X/9, Ideology=Y/9 [signal: Z]
- D (Domain): Source=X/9, Resource=Y/9 [signal: Z]
- P (Purpose): Heart=X/9, Head=Y/9 [signal: Z]
- O (Order): Parts=X/9, Whole=Y/9 [signal: Z]

Operator Signal: [S|I|G] (confidence: 0.XX)
```

---

### **2.2 Pathology → Axis Mapping Rules**

The observer translates **spatial pathologies** into **axis imbalances**:

| Spatial Pathology | Affected Axis | Signal | Interpretation |
|-------------------|---------------|--------|----------------|
| **Overlapping entities** | I (Identity) | instinct_chaos | Multiple entities lack distinct identity |
| **Isolated entities** | D (Domain) | flow_blocked | Resources disconnected from sources |
| **Large gaps** | E (Experience) | hidden_structure | Unseen potential not manifested |
| **Type diversity >6** | L (Language) | fragmented_concepts | Ideas not systematized into ideology |
| **Low density <0.15** | P (Purpose) | weak_intent | Insufficient commitment to goals |
| **Scale inconsistency** | O (Order) | disintegrated | Parts not forming coherent whole |
| **Misalignment** | O (Order) | structural_drift | Components lack stable arrangement |

**Infrastructure Rule**: Every pathology must map to exactly one primary axis. Secondary effects are recorded but not used for operator selection.

---

### **2.3 Evidence Accumulation System**

Mode detection uses **Bayesian evidence fusion** from three sources:

```javascript
EVIDENCE(S) = Σ(linguistic_signal, spatial_signal, axis_signal)
EVIDENCE(I) = Σ(linguistic_signal, spatial_signal, axis_signal)
EVIDENCE(G) = Σ(linguistic_signal, spatial_signal, axis_signal)

MODE = argmax(EVIDENCE)
CONFIDENCE = max(EVIDENCE) / Σ(EVIDENCE)
```

**Example**:
```
User: "organize these scattered items"

Linguistic: organize=+1.0(G), scattered=+0.5(I)
Spatial: 8 isolated entities → +0.7(I)
Axis: O/Parts=7, O/Whole=2 (imbalance=5) → +0.8(G)

EVIDENCE = {S:0, I:1.2, G:1.8}
MODE = G (GROUND)
CONFIDENCE = 1.8/3.0 = 0.60
```

---

## **PART III: OPERATOR SEMANTICS**

### **3.1 SHED: The Subtraction Operator**

**Formal Definition**:
```
SHED(Scene, Target) → Scene' where |Scene'| < |Scene|
```

**Axis-Specific Actions**:

#### **I · IDENTITY**
- **INNER (Instinct)**: Eliminate current emotional noise
  - **Target**: ◎ Noise in immediate preference
  - **Method**: Remove entities triggering conflicting instinctual responses
  - **Example**: Delete redundant NPCs that create choice paralysis

- **OUTER (Reason)**: Decommission current unused formalisms
  - **Target**: ◎ Current structural excess
  - **Method**: Remove logical rules no longer serving function
  - **Example**: Delete obsolete type categories

#### **E · EXPERIENCE**
- **INNER (Seen)**: Reduce current sensory noise
  - **Target**: ◎ Ephemeral phenomena
  - **Method**: Remove transient visual clutter
  - **Example**: Clear temporary markers, effects

- **OUTER (Unseen)**: Reject hidden redundancy
  - **Target**: ◎ Non-essential inferences
  - **Method**: Remove implicit relationships that add no value
  - **Example**: Delete unused connection metadata

#### **L · LANGUAGE**
- **INNER (Ideas)**: Sharpen units of current meaning
  - **Target**: ◎ Unnecessary ideas
  - **Method**: Remove concepts that dilute core message
  - **Example**: Consolidate 5 similar entity types into 2

- **OUTER (Ideology)**: Dismantle current group ideology
  - **Target**: ◎ Obsolete guiding system
  - **Method**: Remove systematized beliefs blocking adaptation
  - **Example**: Delete theme constraints that no longer apply

#### **D · DOMAIN**
- **INNER (Source)**: Cultivate new origin points
  - **Target**: ◎ Current source dependence
  - **Method**: Remove over-reliance on single source
  - **Example**: Delete centralized spawn point forcing convergence

- **OUTER (Resource)**: Discard unnecessary action assets
  - **Target**: ◎ Current inventory excess
  - **Method**: Remove resources not in use
  - **Example**: Clear items never picked up by users

#### **P · PURPOSE**
- **INNER (Heart)**: Purify current emotional drive
  - **Target**: ◎ Emotional drive clutter
  - **Method**: Remove entities misaligned with core feeling
  - **Example**: Delete comedic elements from tragic scene

- **OUTER (Head)**: De-clutter current strategic noise
  - **Target**: ◎ Strategic noise
  - **Method**: Remove tactical options creating decision paralysis
  - **Example**: Reduce branching paths from 8 to 3

#### **O · ORDER**
- **INNER (Parts)**: Isolate redundant current parts
  - **Target**: ◎ Individual components
  - **Method**: Remove duplicate components
  - **Example**: Delete 3 identical trees, keep 1

- **OUTER (Whole)**: Restructure current systemic arrangement
  - **Target**: ◎ Obsolete structure
  - **Method**: Remove entire organizational pattern
  - **Example**: Dismantle hierarchical layout for flat grid

---

### **3.2 INTEGRATE: The Connection Operator**

**Formal Definition**:
```
INTEGRATE(Scene, Entities) → Scene' where connectivity(Scene') > connectivity(Scene)
```

**Axis-Specific Actions**:

#### **I · IDENTITY**
- **INNER (Instinct)**: Align instinct to conscious goals
  - **Target**: ◎ Directional clarity
  - **Method**: Connect intuitive responses to deliberate intent
  - **Example**: Group entities by emotional resonance

- **OUTER (Reason)**: Link reason to external feedback
  - **Target**: ◎ Environmental input
  - **Method**: Connect logical structures to observable patterns
  - **Example**: Create paths from abstract rules to concrete entities

#### **E · EXPERIENCE**
- **INNER (Seen)**: Map seen to underlying structure
  - **Target**: ◎ Unseen dynamics
  - **Method**: Connect visible elements to hidden mechanisms
  - **Example**: Draw lines from surface entities to root causes

- **OUTER (Unseen)**: Verify unseen to current seen phenomena
  - **Target**: ◎ Real-time evidence
  - **Method**: Test inferences against observations
  - **Example**: Link hypothetical connections to actual spatial relationships

#### **L · LANGUAGE**
- **INNER (Ideas)**: Synthesize ideas to coherent patterns
  - **Target**: ◎ Systematic meaning
  - **Method**: Group concepts into meaningful clusters
  - **Example**: Cluster entities by semantic similarity

- **OUTER (Ideology)**: Connect new ideas to guiding narrative
  - **Target**: ◎ System cohesion
  - **Method**: Integrate novel elements into existing worldview
  - **Example**: Position new entity types within established taxonomy

#### **D · DOMAIN**
- **INNER (Source)**: Establish source to resource flow
  - **Target**: ◎ Usable assets
  - **Method**: Create paths from origins to assets
  - **Example**: Draw supply lines from spawners to consumers

- **OUTER (Resource)**: Optimize resource to goal vector
  - **Target**: ◎ Purposeful action
  - **Method**: Connect assets to objectives
  - **Example**: Link tools to their intended use cases

#### **P · PURPOSE**
- **INNER (Heart)**: Harmonize heart to head clarity
  - **Target**: ◎ Cognitive system
  - **Method**: Align emotional drive with rational structure
  - **Example**: Position emotionally salient entities within logical framework

- **OUTER (Head)**: Adjust head to heart direction
  - **Target**: ◎ Emotional alignment
  - **Method**: Tune strategic plans to affective goals
  - **Example**: Reorient paths to pass through emotionally meaningful waypoints

#### **O · ORDER**
- **INNER (Parts)**: Combine parts to coherent whole
  - **Target**: ◎ System assembly
  - **Method**: Group components into functional units
  - **Example**: Arrange scattered elements into recognizable formation

- **OUTER (Whole)**: Integrate whole to new patterns
  - **Target**: ◎ Constituent parts
  - **Method**: Embed complete system into larger context
  - **Example**: Position entire scene cluster within meta-structure

---

### **3.3 GROUND: The Stabilization Operator**

**Formal Definition**:
```
GROUND(Scene, Pattern) → Scene' where stability(Scene') > stability(Scene)
```

**Axis-Specific Actions**:

#### **I · IDENTITY**
- **INNER (Instinct)**: Commit core value to present action
  - **Target**: ◎ Stable instinct
  - **Method**: Lock intuitive responses into repeatable patterns
  - **Example**: Formalize entity behavior rules based on type identity

- **OUTER (Reason)**: Formalize principle into present use
  - **Target**: ◎ Structural logic
  - **Method**: Convert abstract rules into concrete constraints
  - **Example**: Encode reasoning chains as spatial arrangement rules

#### **E · EXPERIENCE**
- **INNER (Seen)**: Apply observation protocol to present
  - **Target**: ◎ Current senses
  - **Method**: Standardize how phenomena are perceived
  - **Example**: Normalize entity rendering scales for consistency

- **OUTER (Unseen)**: Standardize inference method
  - **Target**: ◎ Stable inference
  - **Method**: Formalize how hidden patterns are detected
  - **Example**: Document implicit relationship rules

#### **L · LANGUAGE**
- **INNER (Ideas)**: Document concept for present use
  - **Target**: ◎ Fixed vocabulary
  - **Method**: Lock concept definitions into shared lexicon
  - **Example**: Formalize entity type ontology

- **OUTER (Ideology)**: Formalize narrative into shared beliefs
  - **Target**: ◎ Current shared beliefs
  - **Method**: Institutionalize worldview as explicit doctrine
  - **Example**: Create authoritative scene theme statement

#### **D · DOMAIN**
- **INNER (Source)**: Sustain source for present use
  - **Target**: ◎ Perpetual origin
  - **Method**: Ensure origins remain stable
  - **Example**: Lock spawn point positions

- **OUTER (Resource)**: Secure asset base for present
  - **Target**: ◎ Fixed assets
  - **Method**: Formalize resource availability
  - **Example**: Set entity scale standards by type

#### **P · PURPOSE**
- **INNER (Heart)**: Execute chosen goal with full commit
  - **Target**: ◎ Affective center
  - **Method**: Lock emotional direction into action
  - **Example**: Finalize scene mood through entity selection

- **OUTER (Head)**: Implement strategy into formal plan
  - **Target**: ◎ Cognitive plan
  - **Method**: Convert intentions into executable steps
  - **Example**: Document arrangement rules as reusable patterns

#### **O · ORDER**
- **INNER (Parts)**: Stabilize arrangement into fixed state
  - **Target**: ◎ Fixed components
  - **Method**: Lock component positions and properties
  - **Example**: Grid-snap all entities to integer coordinates

- **OUTER (Whole)**: Institutionalize order into function
  - **Target**: ◎ Functioning system
  - **Method**: Formalize systemic patterns as permanent structure
  - **Example**: Save scene layout as template for future use

---

## **PART IV: TIME LAYER MECHANICS**

### **4.1 Temporal Ontology**

```
Timeline = {T-1, T0, T+1, ..., T+∞}

T-1  : PastLife   (historical context, not modifiable)
T0   : Present    (current editable state)
T+1  : NextLife   (projected future state)
T+∞  : Perpetual  (grounded permanent state)
```

**State Transition Rules**:
```
SHED:      T0 → T0'   (simplify present)
INTEGRATE: T0 → T+1   (create future)
GROUND:    T+1 → T+∞  (perpetuate structure)
```

---

### **4.2 Bayesian State Updates**

Every operator execution produces a **prior → posterior belief shift**:

```javascript
StateUpdate = {
  prior: {concept_A: p_A, concept_B: p_B},      // Σ = 1.0
  posterior: {concept_A: p_A', concept_B: p_B'}, // Σ = 1.0
  evidence: "what changed in the scene",
  rationale: "why beliefs updated"
}
```

**Example (SHED operation)**:
```json
{
  "prior": {"parts": 0.8, "whole": 0.2},
  "posterior": {"parts": 0.5, "whole": 0.5},
  "evidence": "Removed 6 redundant entities",
  "rationale": "Reduced part count brings part/whole balance closer"
}
```

---

## **PART V: EXECUTION INFRASTRUCTURE**

### **5.1 Canonical Pipeline**

```
[1] USER INPUT
    ↓
[2] SCENE ANALYSIS
    → spatial metrics
    → type distribution
    → pathology detection
    ↓
[3] OBSERVER GUIDANCE
    → axis readings (1-9 scores)
    → entropy assessment
    → operator signal
    ↓
[4] MODE DETECTION
    → evidence accumulation
    → confidence scoring
    → mode selection {S|I|G}
    ↓
[5] PROMPT COMPOSITION
    → inject observer guidance
    → include axis context
    → specify JSON schema
    ↓
[6] LLM COMPOSER
    → interpret user intent
    → generate 2-3 options
    → include confidence + rationale
    ↓
[7] USER SELECTION
    → choose option
    ↓
[8] OPERATOR EXECUTION
    → modify scene state
    → record state transition
    ↓
[9] READINGS GENERATION
    → export star plot
    → export vector traces
    → log to T+1
```

---

### **5.2 JSON Schemas**

#### **Observer Output**
```json
{
  "spatial_entropy": [
    "High overlap—entities lack distinct identity",
    "Sparse distribution—unseen potential"
  ],
  "axis_readings": {
    "I": {"signal": "instinct_chaos", "inner": 2, "outer": 6, "imbalance": 4},
    "O": {"signal": "disintegrated", "inner": 6, "outer": 2, "imbalance": 4}
  },
  "operator_recommendation": "G",
  "confidence": 0.75
}
```

#### **Composer Output**
```json
{
  "interpretation": "User wants to stabilize scattered layout",
  "primary_axis": "O",
  "axis_detail": "O/Whole → Institutionalize Stable Order",
  "instability_pathology": "8 isolated entities with no coherent pattern",
  "rationale": "User's 'organize' signals need for structural formalization",
  "prior_state": {"unstable": 0.8, "stable": 0.2},
  "posterior_state": {"unstable": 0.4, "stable": 0.6},
  "options": [
    {
      "action": "arrange_pattern",
      "pattern": "grid",
      "targets": ["House", "Tree", "Person", "Car"],
      "center": {"row": 4, "col": 4},
      "spacing": 2,
      "reasoning": "Grid pattern creates stable, predictable order",
      "axis_impact": "Grounds O/Whole by establishing formal arrangement",
      "addresses": "isolation + misalignment",
      "preview": "Entities arranged in 2x2 grid centered at (4,4)",
      "confidence": 0.85,
      "time_projection": "Moves T0 → T+∞ by institutionalizing layout"
    }
  ]
}
```

---

### **5.3 Execution Functions**

```javascript
// SHED execution
function executeShed(option, sceneState) {
  if (option.action === 'remove_entities') {
    option.targets.forEach(label => {
      const entity = findEntity(sceneState, label);
      sceneState.gridEntities.delete(entity.id);
    });
  }
  return logTransition('T0', 'T0\'', option);
}

// INTEGRATE execution
function executeIntegrate(option, sceneState) {
  if (option.action === 'group_spatial') {
    const targets = option.targets.map(label => findEntity(sceneState, label));
    arrangeInCircle(targets, option.center, option.radius);
  }
  return logTransition('T0', 'T+1', option);
}

// GROUND execution
function executeGround(option, sceneState) {
  if (option.action === 'normalize_scale') {
    option.rules.forEach(rule => {
      sceneState.gridEntities.forEach(entity => {
        if (entity.type === rule.type) entity.scale = rule.scale;
      });
    });
  }
  return logTransition('T+1', 'T+∞', option);
}
```

---

## **PART VI: USER INTERFACE PATTERNS**

### **6.1 Entry Prompts**

**Canonical Questions**:
1. "Where am I on each axis?" → Triggers axis reading
2. "What's wrong with this scene?" → Triggers pathology detection
3. "What should I do next?" → Triggers operator recommendation

---

### **6.2 Visualization Outputs**

#### **Star Plot (6-Axis Radar)**
```
      I (Identity)
         /  \
        /    \
    E /      \ L
     |   ⭐   |
    D \      / P
        \    /
         \  /
      O (Order)

Inner (blue) vs Outer (red) scores overlaid
```

#### **Vector Traces**
- **Spiral Out** (cyan): INTEGRATE operations expanding from center
- **Loop In** (magenta): SHED operations contracting toward center
- **Straight Vectors** (yellow): GROUND operations stabilizing positions

---

## **PART VII: DESIGN PRINCIPLES**

### **7.1 Invariants**

1. **Axis Completeness**: Every scene state MUST produce readings for all 12 poles
2. **Operator Exclusivity**: Only ONE operator active per cycle (no S+I+G hybrids)
3. **Evidence Traceability**: Every operation MUST cite specific spatial evidence
4. **Confidence Bounds**: All confidence scores ∈ [0, 1]
5. **Bayesian Consistency**: Prior/posterior MUST sum to 1.0
6. **Time Monotonicity**: T-1 < T0 < T+1 < T+∞ (no time reversal)

---

### **7.2 Anti-Patterns**

❌ **DO NOT**:
- Infer demographics, politics, health from spatial patterns
- Generate operations without observer guidance
- Return null/undefined for axis readings (use defaults)
- Mix multiple operators in single execution
- Produce overconfident scores (>0.95) without strong evidence
- Skip prior/posterior documentation

✅ **DO**:
- Always start with neutral spatial observation
- Map every pathology to specific axis
- Provide 2-3 options with varying confidence
- Include "time_projection" narrative in all outputs
- Document rationale for belief updates
- Allow user to override operator selection

---

## **PART VIII: EXTENSION POINTS**

### **8.1 Custom Axes**

Users can define domain-specific axes while maintaining the infrastructure:

```javascript
const CUSTOM_AXES = {
  C: { name: 'Combat',   inner: 'Aggression', outer: 'Defense' },
  S: { name: 'Social',   inner: 'Individual', outer: 'Collective' },
  T: { name: 'Tempo',    inner: 'Fast',       outer: 'Slow' }
};
```

**Requirement**: Must preserve inner/outer duality and 1-9 scoring.

---

### **8.2 Custom Operators**

```javascript
const TRANSFORM = {
  name: 'Transform',
  action: 'morph',
  principle: 'Change form while preserving function',
  targets: ['Types', 'Scales', 'Positions']
};
```

**Requirement**: Must specify time direction (T→T') and axis impacts.

---

### **8.3 Grid Topology**

Default: 9×9 Cartesian grid
Alternatives:
- Hexagonal tiling
- Polar coordinates
- Hierarchical quadtree
- Toroidal wrap-around

**Requirement**: Must preserve distance metrics for pathology detection.

---

## **PART IX: PHILOSOPHICAL FOUNDATIONS**

### **9.1 Why Six Axes?**

Six axes emerge from three fundamental dualities:
1. **Self ↔ World** (Identity, Experience)
2. **Symbol ↔ Referent** (Language, Domain)
3. **Intention ↔ Execution** (Purpose, Order)

Each duality splits into inner/outer poles, yielding 6 axes × 2 poles = 12 dimensions.

---

### **9.2 Why Shed → Integrate → Ground?**

The triad mirrors **natural system evolution**:
1. **SHED**: Variation (remove unfit elements)
2. **INTEGRATE**: Selection (connect fit elements)
3. **GROUND**: Retention (stabilize patterns)

This is **Darwinian adaptation as spatial operation**.

---

### **9.3 Why Bayesian Updates?**

Bayesian inference provides:
- **Transparency**: Shows what changed and why
- **Composability**: Updates can be chained across cycles
- **Uncertainty**: Confidence scores express epistemic limits
- **Falsifiability**: Predictions (posterior) can be tested at T+1

---

## **PART X: IMPLEMENTATION CHECKLIST**

### **For System Builders**

- [ ] Implement 6-axis reading function
- [ ] Build pathology → axis mapper
- [ ] Create evidence accumulation system
- [ ] Write 3 operator execution functions
- [ ] Add Bayesian state tracking
- [ ] Generate star plot visualization
- [ ] Log all transitions to time layers
- [ ] Export readings as JSON/YAML
- [ ] Document custom axis protocol
- [ ] Write test suite for invariants

### **For Users**

- [ ] Learn 6-axis vocabulary
- [ ] Practice identifying pathologies
- [ ] Understand S/I/G operator semantics
- [ ] Interpret star plots
- [ ] Read prior/posterior updates
- [ ] Question low-confidence operations
- [ ] Override operator selection when needed
- [ ] Export scenes at each time layer
- [ ] Document custom patterns
- [ ] Share readings with collaborators

---

## **APPENDIX: COMPLETE REFERENCE TABLES**

*(See previous sections for full tables)*

---

**End of Training Grounds Operating System Manual v1.0**

