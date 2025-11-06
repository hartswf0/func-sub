# DSL-02: Dual Homeostasis Architecture

## Core Insight

**OBSERVER reads ALL → INNER/OUTER each choose SIG based on their HALF of axes**

This creates **dual homeostasis** where each agent self-regulates based on what they perceive, not based on centralized triage.

---

## Turn Flow (Revised)

### 1. OBSERVER: Complete Reading

```javascript
// Observer sees EVERYTHING
const observerReading = {
  scene: describeScene(),  // All entities
  axes: {
    I: { inner: 6, outer: 4 },  // BOTH values
    E: { inner: 3, outer: 7 },
    L: { inner: 7, outer: 3 },
    D: { inner: 6, outer: 2 },
    P: { inner: 3, outer: 4 },
    O: { inner: 7, outer: 2 }
  },
  spatial: {
    density: 0.15,
    overlaps: [],
    isolated: ['e3', 'e5'],
    negativeSpace: [...],
    clusters: [...]
  }
};

// Observer logs to memo
logToMemo('OBSERVER', observerReading);
```

### 2. INNER: Choose SIG Based on INNER Axis Values

```javascript
// INNER sees ONLY inner pole values
const innerView = {
  I: 6,  // Instinct
  E: 3,  // Seen
  L: 7,  // Ideas
  D: 6,  // Source
  P: 3,  // Heart
  O: 7   // Parts
};

// INNER detects imbalance
// E (Seen) is low = 3 → Need to reveal interior
// P (Heart) is low = 3 → Need emotional anchor
// O (Parts) is high = 7 → Too fragmented

// INNER chooses: GROUND (organize parts into whole)
const innerDecision = {
  operator: "GROUND",
  reasoning: "Parts=7 too high, need to organize interior detail",
  actionType: "MOVE",
  target: "interior"
};
```

### 3. OUTER: Choose SIG Based on OUTER Axis Values

```javascript
// OUTER sees ONLY outer pole values
const outerView = {
  I: 4,  // Reason
  E: 7,  // Unseen
  L: 3,  // Ideology
  D: 2,  // Resource
  P: 4,  // Head
  O: 2   // Whole
};

// OUTER detects imbalance
// E (Unseen) is high = 7 → Potential is visible
// D (Resource) is low = 2 → Flow is blocked
// O (Whole) is low = 2 → No coherent structure

// OUTER chooses: INTEGRATE (connect to create whole)
const outerDecision = {
  operator: "INTEGRATE",
  reasoning: "Whole=2 too low, need to connect context",
  actionType: "ADD",
  target: "exterior"
};
```

---

## Dual Homeostasis Model

```
INNER Homeostasis:
- Monitors: Instinct, Seen, Ideas, Source, Heart, Parts
- Seeks balance on interior detail layer
- Uses SHED when Parts > 7
- Uses GROUND when Parts > 6 and chaotic
- Uses INTEGRATE when Parts < 3

OUTER Homeostasis:
- Monitors: Reason, Unseen, Ideology, Resource, Head, Whole
- Seeks balance on exterior context layer
- Uses SHED when Whole > 7 (over-connected)
- Uses GROUND when Resource < 3 (need infrastructure)
- Uses INTEGRATE when Whole < 3 (need connections)
```

**Each agent stabilizes their own layer independently!**

---

## Observer's Role

Observer is **NOT a triage system**. Observer is:

1. **Perception Layer**: Makes complete reading of scene + axes
2. **Interpretation Layer**: Helps user explore alternatives via chat
3. **Coordination Layer**: Logs all actions to shared memo
4. **Context Provider**: Gives both agents access to scene state

Observer chat is for:
- User asking "What's happening?"
- User exploring "What if we tried X?"
- User shaping interpretation of actions
- User understanding scene dynamics

---

## Prompt Structure

### INNER Prompt

```
You are INNER agent. You self-regulate based on INNER axis values.

## Your Axis View (Inner Poles Only):
I (Instinct): 6
E (Seen): 3  ← LOW: reveal interior
L (Ideas): 7
D (Source): 6
P (Heart): 3  ← LOW: need anchor
O (Parts): 7  ← HIGH: too fragmented

## Your Task:
Based on YOUR axis values, choose which operator to use:

SHED if:
- Parts > 7 (too cluttered)
- Any axis > 8 (excess)

GROUND if:
- Parts > 6 and chaotic
- Multiple axes imbalanced

INTEGRATE if:
- Parts < 3 (too sparse)
- Seen < 4 (not enough detail)

## Scene Context:
${observerReading.scene}

## Recent Memo:
${recentMemo}

## Response:
{
  "operator": "GROUND",
  "reasoning": "Parts=7 and chaos detected, need organization",
  "actionType": "MOVE",
  "target": "house1.interior",
  "entity": {...}
}
```

### OUTER Prompt

```
You are OUTER agent. You self-regulate based on OUTER axis values.

## Your Axis View (Outer Poles Only):
I (Reason): 4
E (Unseen): 7  ← HIGH: potential visible
L (Ideology): 3  ← LOW: need framework
D (Resource): 2  ← LOW: flow blocked
P (Head): 4
O (Whole): 2  ← LOW: no coherence

## Your Task:
Based on YOUR axis values, choose which operator to use:

SHED if:
- Whole > 7 (over-connected)
- Unseen > 8 (too much potential, need focus)

GROUND if:
- Resource < 3 (need infrastructure)
- Ideology < 3 (need organizing principle)

INTEGRATE if:
- Whole < 3 (need connections)
- Resource < 4 (need flow)

## Scene Context:
${observerReading.scene}

## Recent Memo:
${recentMemo}

## Response:
{
  "operator": "INTEGRATE",
  "reasoning": "Whole=2 too low, need connections",
  "actionType": "ADD",
  "target": "house1.exterior",
  "entity": {...}
}
```

---

## Why This Works

### 1. **No Centralized Control**
- Observer doesn't decide which operator
- Agents decide based on what THEY perceive
- Emergent coordination from dual self-regulation

### 2. **Dual Homeostasis Creates Balance**
- INNER stabilizes detail layer
- OUTER stabilizes context layer
- Together they balance the whole scene

### 3. **Parallel Processing**
- INNER works on interior while OUTER works on exterior
- No conflicts (separate domains)
- Complementary actions

### 4. **Axis Readings Drive Behavior**
- Each agent responds to their own imbalances
- Creates natural diversity of operators
- Prevents integrate loops (if INNER sees Parts=7, uses SHED)

---

## Implementation Checklist

- [x] Observer makes complete reading
- [x] Observer logs to memo
- [ ] Split axis view for INNER (inner poles only)
- [ ] Split axis view for OUTER (outer poles only)
- [ ] Update INNER prompt with self-regulation rules
- [ ] Update OUTER prompt with self-regulation rules
- [ ] Remove observer triage logic
- [ ] Add console logging for axis decisions
- [ ] Test dual homeostasis in action

---

## Example Session

```
Turn 0:
OBSERVER: Scene empty, all axes balanced at 5
Memo: "System initialized"

Turn 1:
INNER sees: Parts=5, Seen=5 → balanced
INNER chooses: INTEGRATE (add foundational detail)
INNER adds: House interior structure

Turn 2:
OUTER sees: Whole=5, Resource=5 → balanced
OUTER chooses: GROUND (organize context)
OUTER adds: Road infrastructure

Turn 3:
OBSERVER: Scene has 2 entities, density=0.02
INNER sees: Parts=6 (rising), Seen=4 (low)
INNER chooses: INTEGRATE (reveal more interior)
INNER adds: Furniture inside house

Turn 4:
OUTER sees: Whole=3 (low), Resource=4
OUTER chooses: INTEGRATE (connect)
OUTER adds: Path to house

Turn 5:
INNER sees: Parts=8 (HIGH!), chaos detected
INNER chooses: SHED (clear clutter)
INNER removes: Excess furniture

Turn 6:
OUTER sees: Whole=6, Resource=5
OUTER chooses: GROUND (stabilize)
OUTER moves: Entities into pattern
```

**Dual homeostasis in action!** 🎯
