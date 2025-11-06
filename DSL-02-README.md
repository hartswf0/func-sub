# DSL-02: Dual Agent Scene Assembly System
## A Tool for Spatial Composition Through Observation and Choice

> **Want to build your own cartridge?** See [START-HERE.md](START-HERE.md) for quick-start guide.

---

## What Is This?

**DSL-02** is an experimental interface for collaborative scene-building between humans and AI agents. Instead of direct drawing or placement, you work with **two AI agents** (INNER and OUTER) who observe a shared scene, propose actions through three strategic operators (SHED, INTEGRATE, GROUND), and compose spatial arrangements through cycles of observation, choice, and reflection.

Think of it as:
- **Not** a scene editor where you place objects
- **Not** an automated generator that builds without you
- **But** a conversation space where composition emerges from observing, discussing alternatives, and choosing paths

---

## Core Concepts

### 1. Dual Agent Architecture

**INNER Agent** (Inside / Detail)
- Focuses on interior detail, parts, elements within structures
- Sees inner pole of DSL axes: Instinct, Seen, Ideas, Source, Heart, Parts
- Works on granular composition, negative space, clarity of detail

**OUTER Agent** (Outside / Context)  
- Focuses on exterior context, relationships, connections between structures
- Sees outer pole of DSL axes: Reason, Unseen, Ideology, Resource, Head, Whole
- Works on systemic composition, infrastructure, coherence of whole

**OBSERVER** (God's Eye View)
- Analyzes full scene composition: shape, proportion, relations, negative space
- Generates three strategic options each turn (one per operator)
- Facilitates dialogue with human about alternatives
- Does NOT choose - presents possibilities for agents to select

### 2. The Six DSL Axes

Each axis has two poles (inner/outer):

```
I - Identity:   Instinct ←→ Reason
E - Experience: Seen ←→ Unseen
L - Language:   Ideas ←→ Ideology
D - Domain:     Source ←→ Resource
P - Purpose:    Heart ←→ Head
O - Order:      Parts ←→ Whole
```

These axes measure scene balance and guide agent decisions.

### 3. Three Strategic Operators

**SHED** (Remove, Clear, Move Out)
- Removes entities or clutter
- Creates negative space
- Example: "Clear Garden Fence Cluster"

**INTEGRATE** (Group, Unify, Connect)
- Combines scattered elements
- Replaces sets with unified structures
- Example: "Unify 4 Path Segments into Road Network"

**GROUND** (Anchor, Stabilize, Compose)
- Locks entities as immovable anchors
- Establishes compositional centers
- Example: "Anchor Garden as Center"

---

## How to Use

### Starting a Session

1. Open dsl-02.html in browser
2. Click ◎ (top-left) to enter API key
3. Click ? (top-right) to enter starter prompt
4. Click START to begin

### Interface

```
◎ API          ? Help          📋 Log

INNER    │   OBSERVER   │    OUTER
(Inside) │   CENTER     │  (Outside)
Chat     │   Grid       │   Chat
         │   3 Options  │
         │   💬 Chat    │
Override │              │ Override
```

### For Designers

**Use Cases:**
- Spatial composition studies
- Collaborative scene building  
- Design research on emergence
- Prototyping workflows

**Intervention Strategies:**
- **Hands-off**: AUTO mode, observe patterns
- **Collaborative**: STEP mode, chat with Observer
- **Hands-on**: Use override inputs

---

## File Structure

```
dsl-02.html          # Main interface
dsl-02.js            # Core logic

Documentation:
  DSL-02-README.md
  DSL-02-NEGATIVE-SPACE-ANALYSIS.md
  OBSERVER-PERCEPTION-PROTOCOL.md
  OBSERVER-THREE-OPTIONS-PROTOCOL.md

Logs:
  dsl-02-log-[timestamp].json
```

---

## Integration with FUNC Ecosystem

DSL-02 is part of the FUNC (Functional Understanding Navigation Composition) suite:

- **func-orb-training.html**: Orbital navigation with channels
- **dsl-01.html**: Single-agent DSL with SIG operators
- **dsl-02.html**: Dual-agent with three-options protocol
- **func-sherpa.html**: SHED-INTEGRATE-GROUND implementation

See func-index.html for full ecosystem overview.

---

## Requirements

- Modern browser (Chrome, Firefox, Safari)
- OpenAI API key (or compatible endpoint)
- No installation needed (standalone HTML)

---

## Theory & Background

DSL-02 implements ideas from:

1. **Negative Space Programming (NEG-3)**: Define by what system is NOT
2. **Dual Homeostasis**: Two agents self-regulate based on separate axis views
3. **Observer Pattern**: Central observer generates options, agents choose
4. **Compositional Analysis**: Shape, proportion, relations, patterns
5. **Reflection Cycles**: Log what was chosen and NOT chosen to prevent repetition

See architectural docs for detailed theory.

---

## License & Attribution

Part of the FUNC research project exploring human-AI collaborative composition.

Built with: HTML5, JavaScript, OpenAI API

For questions or collaboration: See main FUNC documentation

---

**Quick Start:**
1. Open dsl-02.html
2. Enter API key (◎)
3. Type prompt (?)
4. Click START
5. Chat with Observer (💬)
6. Watch agents compose

**Enjoy spatial exploration!** 🎯
