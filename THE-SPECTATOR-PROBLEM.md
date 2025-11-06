# The Spectator Problem

## Core Pathology

**dsl-01 is a "read-only" interface:**
- LLM analyzes scene ✅
- LLM recommends actions ✅  
- **LLM cannot modify scene** ❌
- **No multi-agent coordination** ❌
- **No collective memory** ❌

## What Generative Agents Paper Has (We Don't)

### 1. Memory Stream
```
Paper: Comprehensive record of observations, reflections, plans
Us: Just chat messages (no persistence, no retrieval)
```

### 2. Retrieval Function
```
Paper: Scores by recency + importance + relevance
Us: No retrieval (agents don't remember context)
```

### 3. Reflection
```
Paper: Agents synthesize memories into higher-level insights
Us: No reflection (agents can't learn patterns)
```

### 4. Planning
```
Paper: Multi-step action sequences
Us: No planning (agents react turn-by-turn only)
```

### 5. Action Execution
```
Paper: Agents move, interact with environment, modify state
Us: Agents TALK ABOUT modifying but can't actually do it
```

### 6. Information Diffusion
```
Paper: Agent A tells B about party → B tells C → 12 agents know
Us: No agent-to-agent communication (single chat only)
```

### 7. Collective Memory
```
Paper: Shared observations, agents can query "What does X know?"
Us: No shared memory (agents don't observe each other)
```

## The 3-Chat Architecture You Need

```
INNER AGENT (Instinct/Seen/Ideas)
├─ Memory stream: Own observations
├─ Reads: Shared memo
├─ Writes: Shared memo
└─ Actions: ADD_ENTITY, MOVE_ENTITY

OUTER AGENT (Reason/Unseen/Ideology)
├─ Memory stream: Own observations
├─ Reads: Shared memo + INNER's actions
├─ Writes: Shared memo
└─ Actions: REMOVE_ENTITY, ORGANIZE

OBSERVER AGENT (Meta/Coordination)
├─ Memory stream: All observations
├─ Reads: INNER + OUTER chats
├─ Writes: Shared memo (coordination)
└─ Actions: REFLECT, PLAN, ROUTE
```

## Shared Memo = Ring Buffer

```
[0] INNER: Added house (3,3)
[1] OUTER: House placement OK - adding road
[2] INNER: Road connects - adding well
[3] OBSERVER: Pattern detected - village forming
[4] OUTER: Village needs boundary - adding fence
...
[49] OBSERVER: Reflection - agents collaborating well
[0] ← OVERWRITE (ring buffer wraps)
```

**Both agents read from this buffer to coordinate.**

## Example Flow (With Memory)

### Turn 1
```
INNER sees: Empty grid
INNER memory retrieval: [no relevant memories]
INNER action: ADD house (3,3)
INNER writes memo: "Started building - placed house"
INNER memory stream: [obs: added house, importance: 5]
```

### Turn 2
```
OUTER reads memo: "INNER started building"
OUTER memory retrieval: [house placement guidelines from reflection]
OUTER sees: 1 house at (3,3)
OUTER action: ADD house (4,4) [spacing from previous]
OUTER writes memo: "Expanding cluster with proper spacing"
OUTER memory stream: [obs: observed INNER's house, obs: added own house]
```

### Turn 3
```
OBSERVER reads memo: INNER + OUTER both building
OBSERVER memory retrieval: [village patterns from past sessions]
OBSERVER reflection: "Agents creating residential zone"
OBSERVER action: SUGGEST road between houses
OBSERVER writes memo: "Coordination: residential zone needs roads"
OBSERVER memory stream: [reflection: agents collaborating, importance: 9]
```

### Turn 4
```
INNER reads memo: "OBSERVER suggests roads"
INNER memory retrieval: [obs: my house, obs: OUTER's house, ref: need roads]
INNER action: ADD road (3,4)
INNER writes memo: "Added road per OBSERVER suggestion"
```

### Turn 10 (Later)
```
OBSERVER checks: importanceSum of recent memories = 160 > 150
OBSERVER triggers REFLECTION:
  Question: "What pattern emerged in house placement?"
  Retrieved memories: [all house placements from turns 1-10]
  Reflection: "Agents naturally cluster buildings then add infrastructure"
  → Added to memory stream, importance: 9
```

### Turn 20 (Even Later)
```
INNER starting new build
INNER memory retrieval: [reflection: "cluster then infrastructure" pattern]
INNER uses pattern: Places 3 houses FIRST, THEN asks for roads
INNER has LEARNED from collective memory!
```

## This Is What's Broken

| Component | Generative Agents | dsl-01 Current |
|-----------|------------------|----------------|
| Memory Stream | ✅ Per-agent DB | ❌ None |
| Retrieval | ✅ Recency+Importance+Relevance | ❌ None |
| Reflection | ✅ Automatic synthesis | ❌ None |
| Planning | ✅ Multi-step | ❌ None |
| Action Execution | ✅ Modify world | ❌ Text only |
| Multi-Agent | ✅ 25 agents | ❌ 1 LLM call |
| Shared Memory | ✅ Collective observations | ❌ None |
| Info Diffusion | ✅ Agent-to-agent spread | ❌ None |

## Your DSL Axes Map Perfectly

**INNER/OUTER duality = Your 6 axes!**

```
INNER Agent focuses on INNER poles:
- Identity: INSTINCT (quick, reactive)
- Experience: SEEN (concrete entities)
- Language: IDEAS (creative)
- Domain: SOURCE (generates)
- Purpose: HEART (aesthetic)
- Order: PARTS (individual elements)

OUTER Agent focuses on OUTER poles:
- Identity: REASON (analytical)
- Experience: UNSEEN (potential)
- Language: IDEOLOGY (systematic)
- Domain: RESOURCE (optimizes)
- Purpose: HEAD (logical)
- Order: WHOLE (overall pattern)

OBSERVER Agent balances:
- Detects imbalances (e.g., "PARTS 8, WHOLE 2 → need OUTER")
- Coordinates INNER ↔ OUTER
- Routes to appropriate agent
- Maintains memory of balance history
```

## Solution Architecture

See `MULTI-AGENT-MEMORY-ARCHITECTURE.md` for full implementation.

**Core additions needed:**
1. Memory stream (observations + reflections + plans)
2. Retrieval function (score by recency + importance + relevance)
3. Shared memo ring buffer (50 entries)
4. Action execution (agents modify scene via JSON actions)
5. 3-chat UI (inner/outer/observer panels)
6. Reflection trigger (when importance > threshold)

**The fix is to make agents GENERATIVE, not just ANALYTICAL.**

Ready to build this? 🎯
