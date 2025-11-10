# THE TRAINING GROUNDS

**A 6-axis spatial reasoning substrate for self-alignment and transformative clarity.**

*Inspired by Jordan Caldwell's self-alignment framework and the aesthetic philosophy of Black Metal.*

first-order demos: https://hartswf0.github.io/func-sub/func-index.html
second-order demos: https://hartswf0.github.io/func-sub/t-space-index.html

thousand-tetrad-training-ground demo: https://hartswf0.github.io/func-sub/func-orb-training.html

---

## Overview

The Training Grounds is a theoretical and practical system for transforming chaos into order through deliberate observation and operation. It treats **self-alignment** not as a vague aspiration but as a rigorous spatial practice—positioning entities on a bounded field, detecting pathologies in their arrangement, and applying precise operators to resolve imbalances.

At its core, the system asks: **What patterns emerge when we map internal states to spatial coordinates?** And: **How do we move from entropy to order without imposing arbitrary structure?**

### The Substrate

```
BEING = {6 Axes of Tension} × {3 Operators of Change} × {Spatial Field} × {Time}
```

This is not a productivity tool. It is an **infrastructure for seeing clearly**—a way to externalize the invisible forces that shape experience, then work with them systematically.

---

## The Six Axes of Being

Every scene can be decomposed into 12 scalar measurements across six dual-polar axes:

| Axis | Symbol | Inner Pole | Outer Pole | Tension |
|------|--------|-----------|-----------|---------|
| **Identity** | I | Instinct | Reason | Immediate ↔ Deliberate |
| **Experience** | E | Seen | Unseen | Observable ↔ Inferred |
| **Language** | L | Ideas | Ideology | Units ↔ Systems |
| **Domain** | D | Source | Resource | Origin ↔ Asset |
| **Purpose** | P | Heart | Head | Affective ↔ Cognitive |
| **Order** | O | Parts | Whole | Components ↔ Structure |

Each pole is scored **1-9**, creating a rich diagnostic space for scene analysis.

---

## The Operator Triad

### **SHED** — The Subtraction Operator
- **Action**: Remove excess
- **Effect**: Entropy reduction
- **Time**: T0 → T0' (simplify present)
- **Use Case**: Declutter, eliminate redundancy, remove non-essential elements

### **INTEGRATE** — The Connection Operator
- **Action**: Connect parts into patterns
- **Effect**: Pattern formation
- **Time**: T0 → T+1 (create future)
- **Use Case**: Link isolated entities, establish flows, create relationships

### **GROUND** — The Stabilization Operator
- **Action**: Stabilize patterns into order
- **Effect**: Order formalization
- **Time**: T+1 → T+∞ (perpetuate structure)
- **Use Case**: Lock arrangements, normalize scales, institutionalize patterns

**Critical Insight**: These are not sequential stages—they're **mode switches** selected by scene pathology.

---

## The Theory in Practice

### Three Implementations

This repository contains three expressions of the theoretical framework:

1. **Visual Substrate** — Interactive canvas for experiencing the 6-axis system as orbital space with sonification
2. **Compositional Interface** — AI-assisted scene analysis with Bayesian mode detection and operator suggestion
3. **Validation Infrastructure** — Python framework ensuring operations respect the system's invariants

Each implementation serves a different aspect of the practice:
- **Visual**: Understanding the relationships between axes
- **Compositional**: Applying operators to actual scenes
- **Validation**: Maintaining rigor and traceability

The system is designed to be extended. The core theory (6 axes, 3 operators, spatial substrate) remains constant. The implementations evolve.

---

## Getting Started

The system is both simple and deep. Start with one question:

**"Where am I on each axis?"**

This forces you to:
1. Observe your current state without judgment
2. Assign scalar values (1-9) to polar tensions
3. Identify where imbalances exist
4. Recognize which operator might resolve them

From there, the work unfolds naturally:
- **If scattered**: SHED (remove excess)
- **If fragmented**: INTEGRATE (connect parts)
- **If unstable**: GROUND (stabilize patterns)

The implementations in this repository provide computational infrastructure for this practice. You can work manually (pen and paper, spatial thinking) or use the interfaces for AI-assisted analysis. Both are valid.

**The key is to start observing.**

---

## The Observer Protocol

Every operation begins with **neutral spatial observation**:

```javascript
OBSERVER_PROTOCOL = {
  input: SceneState(T0),
  analyze: SpatialMetrics → AxisReadings,
  output: EntropyAssessment + OperatorSignal
}
```

### Pathology → Axis Mapping

| Spatial Pathology | Affected Axis | Signal | Operator Hint |
|-------------------|---------------|--------|---------------|
| Overlapping entities | I (Identity) | `instinct_chaos` | GROUND (separate) |
| Isolated entities | D (Domain) | `flow_blocked` | INTEGRATE (connect) |
| Large gaps | E (Experience) | `hidden_structure` | INTEGRATE (fill) |
| Type diversity >6 | L (Language) | `fragmented_concepts` | SHED (consolidate) |
| Low density <0.15 | P (Purpose) | `weak_intent` | INTEGRATE (commit) |
| Scale inconsistency | O (Order) | `disintegrated` | GROUND (normalize) |

### Evidence Accumulation

Mode detection uses Bayesian fusion from three sources:

```javascript
EVIDENCE(S) = Σ(linguistic_signal, spatial_signal, axis_signal)
EVIDENCE(I) = Σ(linguistic_signal, spatial_signal, axis_signal)
EVIDENCE(G) = Σ(linguistic_signal, spatial_signal, axis_signal)

MODE = argmax(EVIDENCE)
CONFIDENCE = max(EVIDENCE) / Σ(EVIDENCE)
```

---

## Time Layer Mechanics

```
T-1  : PastLife   (historical context, read-only)
T0   : Present    (current editable state)
T+1  : NextLife   (projected future state)
T+∞  : Perpetual  (grounded permanent state)
```

**State Transitions**:
- **SHED**: T0 → T0' (simplify present)
- **INTEGRATE**: T0 → T+1 (create future)
- **GROUND**: T+1 → T+∞ (perpetuate structure)

---

## Design Principles

### Invariants

1. **Axis Completeness**: Every scene state produces readings for all 12 poles
2. **Operator Exclusivity**: Only ONE operator active per cycle
3. **Evidence Traceability**: Every operation cites specific spatial evidence
4. **Confidence Bounds**: All confidence scores ∈ [0, 1]
5. **Bayesian Consistency**: Prior/posterior distributions sum to 1.0
6. **Time Monotonicity**: T-1 < T0 < T+1 < T+∞

### Anti-Patterns

❌ **DO NOT**:
- Infer demographics/politics from spatial patterns
- Generate operations without observer guidance
- Return null/undefined for axis readings
- Mix multiple operators in single execution
- Produce overconfident scores (>0.95) without strong evidence

✅ **DO**:
- Always start with neutral spatial observation
- Map every pathology to specific axis
- Provide 2-3 options with varying confidence
- Include "time_projection" narrative
- Document rationale for belief updates
- Allow user to override operator selection

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERFACE LAYER                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   tin.html   │  │   cb.html    │  │ func-orb-*.  │      │
│  │ (Holo Index) │  │ (Sandbox)    │  │ (Training)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          ├──────────────────┴──────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────┐
│                   OBSERVER INFRASTRUCTURE                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Scene Analysis → Pathology Detection → Axis Map   │   │
│  │  Evidence Fusion → Mode Detection → Confidence     │   │
│  └────────────────────────────────────────────────────┘   │
└─────────┬─────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────┐
│                   OPERATOR EXECUTION                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│  │   SHED   │ →  │ INTEGRATE│ →  │  GROUND  │            │
│  │ (Remove) │    │ (Connect)│    │(Stabilize)│            │
│  └──────────┘    └──────────┘    └──────────┘            │
└─────────┬─────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────┐
│                 VALIDATION & SCHEMA LAYER                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │  training_grounds.py + training_grounds_schema.json│   │
│  │  Entity checks · Axis validation · Operator rules  │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
[1] USER INPUT
    ↓
[2] SCENE ANALYSIS
    → spatial metrics (isolation, overlap, gaps)
    → type distribution
    → pathology detection
    ↓
[3] OBSERVER GUIDANCE
    → axis readings (12 poles × 1-9 scores)
    → entropy assessment
    → operator signal (S/I/G)
    ↓
[4] MODE DETECTION
    → linguistic evidence (keywords)
    → spatial evidence (metrics)
    → axis evidence (imbalances)
    → Bayesian confidence scoring
    ↓
[5] PROMPT COMPOSITION
    → inject observer guidance
    → include scene state
    → specify JSON schema
    ↓
[6] LLM COMPOSER (OpenAI)
    → interpret user intent
    → generate 2-3 options
    → include confidence + rationale
    ↓
[7] USER SELECTION
    → review options
    → choose preferred operation
    ↓
[8] OPERATOR EXECUTION
    → modify scene state
    → record state transition
    → document prior/posterior
    ↓
[9] READINGS GENERATION
    → export star plot
    → export vector traces
    → log to time layer (T+1)
```

---

## JSON Schemas

### Observer Output
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

### Composer Output
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
      "confidence": 0.85,
      "time_projection": "Moves T0 → T+∞ by institutionalizing layout"
    }
  ]
}
```

---

## Repository Contents

```
THE TRAINING GROUNDS/
├── README.md                       # This document (theory + credit)
├── manual.md                       # Complete operating system manual
├── pseudo.md                       # Algorithmic specification
├── training_grounds.py             # Python validation framework
├── training_grounds_schema.json    # JSON schema
└── *.html                          # Interactive implementations
```

The manual (`manual.md`) is the authoritative reference for the complete system specification.

---

## Philosophical Foundations

### Why Six Axes?

Six axes emerge from three fundamental dualities:

1. **Self ↔ World** (Identity, Experience)
2. **Symbol ↔ Referent** (Language, Domain)
3. **Intention ↔ Execution** (Purpose, Order)

Each duality splits into inner/outer poles: 6 axes × 2 poles = **12 dimensions**.

### Why Shed → Integrate → Ground?

The triad mirrors **natural system evolution**:

1. **SHED**: Variation (remove unfit elements)
2. **INTEGRATE**: Selection (connect fit elements)
3. **GROUND**: Retention (stabilize patterns)

This is **Darwinian adaptation as spatial operation**.

### Why Bayesian Updates?

Bayesian inference provides:
- **Transparency**: Shows what changed and why
- **Composability**: Updates chain across cycles
- **Uncertainty**: Confidence scores express epistemic limits
- **Falsifiability**: Predictions (posterior) can be tested at T+1

---

## Extension Points

### Custom Axes

Users can define domain-specific axes while maintaining the infrastructure:

```javascript
const CUSTOM_AXES = {
  C: { name: 'Combat',   inner: 'Aggression', outer: 'Defense' },
  S: { name: 'Social',   inner: 'Individual', outer: 'Collective' },
  T: { name: 'Tempo',    inner: 'Fast',       outer: 'Slow' }
};
```

**Requirement**: Must preserve inner/outer duality and 1-9 scoring.

### Custom Operators

```javascript
const TRANSFORM = {
  name: 'Transform',
  action: 'morph',
  principle: 'Change form while preserving function',
  time_direction: 'T0 → T1',
  targets: ['Types', 'Scales', 'Positions']
};
```

**Requirement**: Must specify time direction and axis impacts.

### Grid Topology

Default: 9×9 Cartesian grid

Alternatives:
- Hexagonal tiling
- Polar coordinates
- Hierarchical quadtree
- Toroidal wrap-around

**Requirement**: Must preserve distance metrics for pathology detection.

---

## Technical Requirements

The implementations require modern web standards and Python 3.8+. The **theory** requires only:
- Willingness to observe without judgment
- Capacity to assign numerical values to subjective states
- Commitment to tracing evidence
- Tolerance for discomfort

The second set is harder than the first.

---

## The Work

Using the Training Grounds means:

1. **Observing ruthlessly**: Name what is, not what should be
2. **Scoring honestly**: Assign axis readings based on evidence, not wishful thinking
3. **Shedding courageously**: Remove what no longer serves, even if it's comfortable
4. **Integrating deliberately**: Connect what remains into meaningful patterns
5. **Grounding committedly**: Stabilize what matters into durable structure
6. **Documenting transparently**: Record prior/posterior shifts so the work is traceable

This is not easy. It requires confronting entropy, imbalance, and the gap between intention and reality.

**The system makes it possible. You make it real.**

---

## Credits & Origins

### Jordan Caldwell's Training Grounds

This system is directly inspired by and builds upon **Jordan Caldwell's self-alignment framework**—a transformative approach to personal development that maps abstract inner states to concrete spatial operations. Caldwell's work provides the foundational insight: **alignment is not about forcing yourself into a predetermined shape, but about observing what is, shedding what no longer serves, integrating what remains, and grounding what matters.**

The 6-axis system (Identity, Experience, Language, Domain, Purpose, Order) and the operator triad (Shed → Integrate → Ground) are Caldwell's core contributions. This implementation adds computational infrastructure, Bayesian evidence systems, and AI-assisted composition to make the framework operational at scale.

### The Black Metal Project

The aesthetic and philosophical attitude of this system is informed by **Black Metal**—not as genre, but as **method**:

- **Intensity over comfort**: Confront what is difficult rather than avoiding it
- **Clarity through noise**: Find signal in chaos through sustained attention
- **Catharsis as transformation**: Use discomfort as the raw material of change
- **Stark contrasts**: Embrace extremes (light/dark, order/chaos, inner/outer) rather than collapsing into grey

Black Metal teaches that **transformation requires burning away excess**. The SHED operator—the first and hardest step—embodies this ethos. You cannot integrate what you haven't first had the courage to release.

The visual design (celestial/blackened palettes, tremolo textures, raw timbres) reflects this: beauty through austerity, power through precision, depth through restraint.

---

## Philosophical Stance

This system operates from several core beliefs:

1. **Alignment is spatial**: Internal states can be externalized as arrangements on a bounded field
2. **Pathology is observable**: Entropy manifests as overlap, isolation, drift, fragmentation
3. **Operations are precise**: Change happens through discrete operators with clear semantics
4. **Evidence is traceable**: Every transformation must cite specific spatial facts
5. **Confidence is honest**: Uncertainty is not weakness—it's epistemic responsibility
6. **Time is layered**: Past informs present, present projects future, future stabilizes into perpetual

**The system is a mirror, not a prescription.** It shows you what is. What you do with that information is your choice.

---

## License & Use

This is a research and educational project. The theoretical framework belongs to Jordan Caldwell. This implementation is offered as infrastructure for those doing the work of self-alignment.

Use it to **see more clearly**. Use it to **act more deliberately**. Use it to **burn away what no longer serves**.

---

## Closing

The Training Grounds is not about optimization or productivity. It's about **confronting what is** with enough rigor to transform it.

The work is hard. The system makes it possible.

**Remember**: The substrate is not prescriptive—it's descriptive. Use it to **observe** what is, not to impose what should be.

---

**End of README — The Training Grounds v1.0**

This is the **substrate**—the infrastructure that enables all spatial reasoning operations. Build on this foundation. 🏗️
