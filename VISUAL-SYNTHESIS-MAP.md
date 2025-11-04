# VISUAL SYNTHESIS MAP

## The Core Insight

```
orbit-graph (1).html          complete_node_dataset.json         index.html
      ↓                                 ↓                            ↓
  ORBITAL MOTION          +      PSYCHOGRAPHIC FIELD       +    OPERATIONS
 (how you move)                  (where you are)              (what you do)
      ↓                                 ↓                            ↓
      ╰────────────────────────┬────────────────────────╯
                               ↓
                    UNIFIED TRAINING GROUND
                    
         "Your orbit through psychographic space
          enacts shed/integrate/ground operations"
```

---

## The 3-Ring System

```
                       ┌─────────────────────┐
                       │   [5,5] CENTER      │
                       │   "The Center"      │
                       └─────────────────────┘
                                ▲
                                │
            ┌───────────────────┼───────────────────┐
            │                   │                   │
            │                   │                   │
     ┌──────▼──────┐     ┌──────▼──────┐    ┌──────▼──────┐
     │   GROUND    │     │  INTEGRATE  │    │    SHED     │
     │  Radius 10  │     │  Radius 15  │    │  Radius 20  │
     │   (inner)   │     │  (middle)   │    │   (outer)   │
     └─────────────┘     └─────────────┘    └─────────────┘
            │                   │                   │
            │                   │                   │
     Stabilize/Commit   Connect/Synthesize   Release/Remove
```

**Key**: You don't "select" an operation from a menu—you MOVE to a different orbital ring. The operation is your spatial position.

---

## Grid Cell Anatomy

```
┌────────────────────────────────────┐
│ [3,5] "CREATIVE BALANCE"           │  ← Node name (from dataset)
│ Distance: 2.0 from center          │  ← Geometric property
│ Axis: Identity · Near Center       │  ← Semantic dimension
├────────────────────────────────────┤
│ Current Ring: INTEGRATE (r=15)     │  ← Your orbital position
│                                    │
│ Operations available:              │
│ ◻ Shedding: "Release perfectionist│  ← What you can do here
│    creation..."                    │
│ → Integrating: "Address creative  │  ← Active (you're in this ring)
│    paralysis..."                   │
│ ◻ Grounding: "Make messy things..." │
└────────────────────────────────────┘
```

**Activation**: When your orbital body CROSSES this cell, the active operation's prompt injects into your context window (hidden from you, visible to AI).

---

## Data Flow Cycle

```
┌──────────────────────────────────────────────────────────────┐
│                    USER ORBITAL POSITION                     │
│              [current row, col, orbital ring]                │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Node Lookup         │
           │   complete_node_      │
           │   dataset.json        │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Operation Select    │
           │   SHED/INTEGRATE/     │
           │   GROUND              │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Prompt Injection    │
           │   (hidden system msg) │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   User Types Message  │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Context Builder     │
           │   + Observer State    │
           │   + Surrounding Cells │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   OpenAI API Call     │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   AI Response         │
           │   (natural language   │
           │   + JSON entities)    │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Parse & Place       │
           │   Entities on Grid    │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Update Observer     │
           │   Track Action        │
           └───────────┬───────────┘
                       │
                       ↓
           ┌───────────────────────┐
           │   Orbital Motion      │
           │   Continues...        │
           └───────────────────────┘
                       │
                       ↓ (loop back to top)
```

---

## Example Traversal

```
User starts at CENTER [5,5] in INTEGRATE ring (radius 15)
               ↓
Orbits clockwise, crosses [5,6] "Vertical Axis"
               ↓
System prompt injected (hidden):
"INTEGRATING: Address scattered energy. 
 Integrate depth with breadth."
               ↓
User types: "how do I balance my projects?"
               ↓
AI sees:
- Position: Vertical Axis
- Operation: INTEGRATE
- Hidden prompt about depth/breadth
- Grid state + observer
               ↓
AI responds:
"You're at the Vertical Axis, integrating vertical 
 depth with horizontal breadth. Consider..."
 
```json
{
  "entities": [
    {"type": "Solution", "row": 5, "col": 6, 
     "label": "Depth-first sprint"},
    {"type": "Solution", "row": 5, "col": 5, 
     "label": "Breadth exploration"}
  ]
}
```
               ↓
Entities placed on grid
               ↓
User continues orbiting...
               ↓
Crosses [6,6] "Balanced Tension"
               ↓
System prompt: "INTEGRATING: Address discomfort 
 avoidance. Integrate holding opposites."
               ↓
(cycle continues)
```

---

## The 6 Axes as Color Gradients

```
┌─────────────────────────────────────────────────────────┐
│  IDENTITY      [Red → Pink]        Instinct ←→ Reason   │
│  EXPERIENCE    [Orange → Amber]    Seen ←→ Unseen       │
│  LANGUAGE      [Yellow → Lime]     Ideas ←→ Ideology    │
│  DOMAIN        [Green → Cyan]      Source ←→ Resource   │
│  PURPOSE       [Blue → Indigo]     Heart ←→ Head        │
│  ORDER         [Purple → Magenta]  Parts ←→ Whole       │
└─────────────────────────────────────────────────────────┘

Grid cells inherit color from nearest axis.
Intensity ∝ distance from center (closer = brighter).
```

Visual result: Grid looks like a psychographic heat map.

---

## Observer Profile View

```
╔════════════════════════════════════════════════════════╗
║              PSYCHOGRAPHIC PROFILE                     ║
║              User: [Username]                          ║
╠════════════════════════════════════════════════════════╣
║  ORBIT STATISTICS                                      ║
║  • Cycles completed: 3.7                               ║
║  • Nodes crossed: 47                                   ║
║  • Current operation: INTEGRATE                        ║
║  • Time in system: 18m 23s                            ║
╠════════════════════════════════════════════════════════╣
║  OPERATION BREAKDOWN                                   ║
║  • SHED:       14 nodes (30%)  ███████░░░░░░          ║
║  • INTEGRATE:  22 nodes (47%)  ███████████████░       ║
║  • GROUND:     11 nodes (23%)  ██████░░░░░░░░         ║
╠════════════════════════════════════════════════════════╣
║  AXIS EXPLORATION                                      ║
║  • Identity:    ████████░░  80%                       ║
║  • Experience:  ██████░░░░  60%                       ║
║  • Language:    ███░░░░░░░  30%                       ║
║  • Domain:      █████████░  90%                       ║
║  • Purpose:     █████░░░░░  50%                       ║
║  • Order:       ███████░░░  70%                       ║
╠════════════════════════════════════════════════════════╣
║  MOST VISITED NODES                                    ║
║  1. Creative Balance [3,5] - 7 crossings              ║
║  2. Stable Presence [4,5] - 6 crossings               ║
║  3. The Center [5,5] - 5 crossings                    ║
╠════════════════════════════════════════════════════════╣
║  INTEGRATION INSIGHTS                                  ║
║  You favor the center-ring. Consider exploring        ║
║  the outer SHED ring (radius 20) to release           ║
║  constraints before integrating.                       ║
╚════════════════════════════════════════════════════════╝
```

---

## Mobile UI Layout

```
┌─────────────────────────────────────┐
│  ☰  PSYCHOGRAPHIC ORBIT      [⚙]   │  ← Header
├─────────────────────────────────────┤
│                                     │
│        [3D Grid Viewport]           │  ← Main view
│        • User avatar orbiting       │     (60% height)
│        • Node tooltips on tap       │
│        • Pinch to zoom              │
│                                     │
├─────────────────────────────────────┤
│  OPERATION: [SHED] [INT] [GRD]     │  ← Ring selector
│  POS: [4,5] "Stable Presence"      │     (sticky)
├─────────────────────────────────────┤
│  💬 Chat Messages                   │  ← Chat
│  • AI responses                     │     (30% height,
│  • User input                       │      scrollable)
│  • System notifications             │
├─────────────────────────────────────┤
│  [Type message...]           [Send] │  ← Input
└─────────────────────────────────────┘
```

---

## Comparison Matrix

| Feature | orbit-graph | complete_node | index.html | **SYNTHESIS** |
|---------|-------------|---------------|------------|---------------|
| **Grid** | 9×9 3D | 9×9 coordinates | 6×2 cells | 9×9 3D + node data |
| **Motion** | Train/bodies orbit | Static | None | User avatar orbits |
| **Operations** | Tetrad tracks | Shed/Int/Grd text | Columns | Orbital rings |
| **Data** | Entities (E/L/O/S/G) | Node prompts | Operation text | Both integrated |
| **AI** | JSON entities | N/A | N/A | Context-aware prompts |
| **Observer** | Scene state tracking | N/A | N/A | + Node crossing history |
| **Axes** | Implicit | 6 semantic axes | 6 labeled rows | Color-coded grid |
| **Polarity** | N/A | Inner/Outer | Inner/Outer | Gradient encoding |
| **Profile** | Channel state | Single coordinate | Display only | Orbital trajectory |

---

## Key Innovation: Spatial Embodiment

**Before**: 
- Operations are dropdown menus
- Psychographic data is text
- No connection between location and operation

**After**:
- Operations are WHERE YOU ARE in space
- Psychographic nodes are EVENTS (crossings)
- Location ⊗ Operation ⊗ Context = Coherent system

**Phenomenology**:
- Moving outward = Shedding (release, expand boundary)
- Staying middle = Integrating (connect, synthesize)
- Moving inward = Grounding (commit, stabilize core)

The metaphor is LEGIBLE through interaction, not explanation.

---

## The Three Loops as Orbital Mechanics

```
SHED LOOP (outer, radius 20):
  ┌──────────────────────────┐
  │  High potential energy   │
  │  Wide exploration        │
  │  Releasing constraints   │
  │  Boundary expansion      │
  └──────────────────────────┘
           ↓ (decay orbit)
           
INTEGRATE LOOP (middle, radius 15):
  ┌──────────────────────────┐
  │  Medium energy           │
  │  Connecting patterns     │
  │  Synthesizing            │
  │  Building relationships  │
  └──────────────────────────┘
           ↓ (decay orbit)
           
GROUND LOOP (inner, radius 10):
  ┌──────────────────────────┐
  │  Low potential energy    │
  │  Core stability          │
  │  Commitment              │
  │  Foundation building     │
  └──────────────────────────┘
           ↓ (arrive at center)
           
  [5,5] CENTER - Pure presence
```

**Orbital decay**: Natural progression is shed → integrate → ground → center.

**Energy injection**: User can "jump" to outer ring to start new cycle.

---

## Summary: What Makes This Work

1. **1:1 Mapping**: 81 grid cells = 81 nodes (12 known + 69 synthetic)

2. **Spatial Operations**: SHED/INTEGRATE/GROUND are not menu items—they're orbital altitudes

3. **Event-Driven**: Crossing node = trigger (not just hover information)

4. **Context Engineering**: AI sees position + operation + node prompt + observer state

5. **Profile = Trajectory**: Your history is your orbital path through psychographic space

6. **Axis Legibility**: Color gradients + labels make semantic dimensions visible

7. **Observer Memory**: System tracks what you've shed, integrated, grounded

8. **Escape Hatches**: Manual jump, pause, operation override for user control

The result: **A training ground where psychographic transformation is embodied as orbital motion through a coordinate space.**

---

Ready to implement? 🚀
