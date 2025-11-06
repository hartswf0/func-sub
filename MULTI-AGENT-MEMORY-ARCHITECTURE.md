# Multi-Agent Memory Architecture for DSL-01

## The Problem

**Current State (dsl-01):**
```
User → LLM → Analysis Text → Nothing happens
```

**What's Missing:**
1. ❌ Scene modification (LLM can't add/move/remove entities)
2. ❌ Multi-agent coordination (no inner/outer/observer split)
3. ❌ Memory stream (no persistent observations)
4. ❌ Shared memo (no collective memory buffer)
5. ❌ Reflection/Planning (no higher-level synthesis)
6. ❌ Information diffusion (agents don't observe each other)

---

## Proposed Architecture

### 3-Chat System

```
┌─────────────────────────────────────────────────┐
│                  OBSERVER CHAT                  │
│  "Seeing both inner and outer perspectives"    │
│  • Reads both channels                          │
│  • Maintains shared memo (ring buffer)          │
│  • Coordinates scene modifications              │
│  • Detects conflicts/patterns                   │
└─────────────────────────────────────────────────┘
         ↓ Memory Stream ↓         ↓ Memory Stream ↓
┌────────────────────────┐  ┌────────────────────────┐
│    INNER CHAT          │  │    OUTER CHAT          │
│  "Instinct/Seen/Ideas" │  │  "Reason/Unseen/Ideology"│
│  • Adds entities       │  │  • Removes entities    │
│  • Makes spatial moves │  │  • Plans structure     │
│  • Reacts instinctively│  │  • Analyzes patterns   │
└────────────────────────┘  └────────────────────────┘
         ↓                           ↓
         └──────────► SCENE ◄────────┘
               (9×9 Grid)
```

### Memory Stream Components

Each agent maintains:

```javascript
memoryStream = {
  observations: [
    {
      id: 'obs_1',
      timestamp: 1730784000,
      agent: 'INNER',
      type: 'PERCEPTION',
      content: 'Added house at (3,4)',
      importance: 5,
      embedding: [0.2, -0.1, ...]  // For retrieval
    },
    {
      id: 'obs_2',
      timestamp: 1730784010,
      agent: 'OUTER',
      type: 'OBSERVATION',
      content: 'Inner placed 3 houses - clustering detected',
      importance: 7,
      embedding: [...]
    }
  ],
  reflections: [
    {
      id: 'ref_1',
      timestamp: 1730784100,
      agent: 'OBSERVER',
      type: 'REFLECTION',
      content: 'Inner agent favors residential zones, Outer prefers structure',
      basedOn: ['obs_1', 'obs_2', 'obs_5'],
      importance: 9
    }
  ],
  plans: [
    {
      id: 'plan_1',
      timestamp: 1730784200,
      agent: 'INNER',
      type: 'PLAN',
      content: 'Build village center: add well, then surround with houses',
      steps: ['Add well (4,4)', 'Add house (3,4)', 'Add house (5,4)'],
      status: 'IN_PROGRESS'
    }
  ]
}
```

### Shared Memo (Ring Buffer)

```javascript
sharedMemo = {
  buffer: new Array(50),  // Ring buffer, max 50 entries
  head: 0,
  
  entries: [
    {
      timestamp: 1730784000,
      from: 'INNER',
      to: 'OUTER',
      type: 'INFO',
      content: 'Placed 3 houses in cluster',
      sceneSnapshot: { entities: [...], axes: {...} }
    },
    {
      timestamp: 1730784010,
      from: 'OUTER',
      to: 'INNER',
      type: 'REQUEST',
      content: 'Need spacing - add roads between houses',
      reasoning: 'Order axis (Parts→Whole) imbalanced'
    },
    {
      timestamp: 1730784020,
      from: 'OBSERVER',
      to: 'BOTH',
      type: 'COORDINATION',
      content: 'Consensus: Village needs infrastructure',
      action: { type: 'ADD_ENTITY', entityType: 'ROAD', position: [3,5] }
    }
  ]
}
```

---

## Mapping to DSL Axes

**Perfect alignment with your 6-axis system!**

### INNER Agent (Instinct/Seen/Ideas/Source/Heart/Parts)
- **Identity → Instinct:** Quick, reactive placements
- **Experience → Seen:** Works with visible entities
- **Language → Ideas:** Free-form creative assembly
- **Domain → Source:** Generates new entities
- **Purpose → Heart:** Emotional/aesthetic decisions
- **Order → Parts:** Focuses on individual elements

### OUTER Agent (Reason/Unseen/Ideology/Resource/Head/Whole)
- **Identity → Reason:** Analytical, planned removals
- **Experience → Unseen:** Sees potential structures
- **Language → Ideology:** Systematic organization
- **Domain → Resource:** Optimizes existing entities
- **Purpose → Head:** Logical/functional decisions
- **Order → Whole:** Focuses on overall pattern

### OBSERVER Agent (Meta/Synthesis/Coordination)
- **Balances axes:** Detects imbalances (e.g., "Parts 8, Whole 2")
- **Coordinates agents:** Routes to INNER or OUTER
- **Maintains memory:** Writes to shared memo
- **Generates reflections:** Synthesizes patterns

---

## Retrieval Function

**3-factor scoring (from Generative Agents paper):**

```javascript
function retrieveMemories(query, agent, k=10) {
  const memories = memoryStream.observations
    .concat(memoryStream.reflections)
    .concat(memoryStream.plans);
  
  const scored = memories.map(mem => {
    // 1. RECENCY (exponential decay)
    const hoursSince = (Date.now() - mem.timestamp) / 3600000;
    const recency = Math.exp(-0.99 * hoursSince);
    
    // 2. IMPORTANCE (pre-scored 1-10)
    const importance = mem.importance / 10;
    
    // 3. RELEVANCE (cosine similarity to query)
    const relevance = cosineSimilarity(
      embed(query), 
      mem.embedding
    );
    
    // Weighted sum
    return {
      memory: mem,
      score: (recency * 1) + (importance * 1) + (relevance * 1)
    };
  });
  
  // Return top-k
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(s => s.memory);
}
```

---

## Reflection Trigger

**Generate reflections when importance threshold reached:**

```javascript
function checkReflectionTrigger(agent) {
  const recentObs = memoryStream.observations
    .filter(o => o.agent === agent)
    .filter(o => Date.now() - o.timestamp < 3600000); // Last hour
  
  const importanceSum = recentObs.reduce((sum, o) => sum + o.importance, 0);
  
  if (importanceSum > 150) {
    generateReflection(agent, recentObs);
  }
}

async function generateReflection(agent, observations) {
  // 1. Identify questions
  const questions = await llmCall(`
    Given these recent observations, what are 3 high-level questions 
    to reflect on?
    
    Observations:
    ${observations.map(o => o.content).join('\n')}
  `);
  
  // 2. For each question, retrieve relevant memories
  for (const question of questions) {
    const relevant = retrieveMemories(question, agent, 100);
    
    // 3. Generate insight
    const insight = await llmCall(`
      Question: ${question}
      
      Relevant memories:
      ${relevant.map((m, i) => `${i+1}. ${m.content}`).join('\n')}
      
      What is a high-level insight that answers this question?
      Cite memory numbers in parentheses.
    `);
    
    // 4. Add to memory stream
    memoryStream.reflections.push({
      id: `ref_${Date.now()}`,
      timestamp: Date.now(),
      agent: agent,
      type: 'REFLECTION',
      content: insight,
      basedOn: relevant.map(m => m.id),
      importance: 8  // Reflections are high-importance
    });
  }
}
```

---

## Scene Modification Protocol

**Agents output structured actions:**

```javascript
// INNER agent prompt
const innerPrompt = `
You are the INNER agent (Instinct/Seen/Ideas).

## Current Scene:
${sceneData}

## Recent Shared Memo:
${sharedMemo.slice(-5)}

## Your Task:
Respond with ONE action in JSON:

{
  "action": "ADD_ENTITY",
  "params": {
    "type": "BUILDING",
    "icon": "🏠",
    "label": "House",
    "position": [3, 4],
    "reasoning": "Clustering for community"
  }
}

OR

{
  "action": "CHAT",
  "params": {
    "to": "OUTER",
    "message": "Added houses - need roads?"
  }
}

Available actions: ADD_ENTITY, MOVE_ENTITY, CHAT, PLAN
`;

// Execute action
async function executeAgentAction(agent, action) {
  switch (action.action) {
    case 'ADD_ENTITY':
      const entity = addEntity(
        action.params.type,
        action.params.icon,
        action.params.label,
        action.params.position[0],
        action.params.position[1]
      );
      
      // Record in memory stream
      memoryStream.observations.push({
        id: `obs_${Date.now()}`,
        timestamp: Date.now(),
        agent: agent,
        type: 'ACTION',
        content: `Added ${entity.label} at (${entity.row},${entity.col})`,
        importance: 5,
        embedding: await embed(`Added ${entity.label}`)
      });
      
      // Write to shared memo
      sharedMemo.write({
        from: agent,
        to: 'ALL',
        type: 'ACTION_LOG',
        content: action.params.reasoning,
        sceneSnapshot: getCurrentScene()
      });
      break;
      
    case 'CHAT':
      sharedMemo.write({
        from: agent,
        to: action.params.to,
        type: 'MESSAGE',
        content: action.params.message
      });
      break;
  }
}
```

---

## Information Diffusion Example

**Scenario: INNER wants to build a market**

### T0 - INNER Action
```javascript
{
  agent: 'INNER',
  action: 'ADD_ENTITY',
  entity: 'Market',
  position: [4, 4],
  memo: 'Building village center'
}
```

### T1 - OUTER Observes
```javascript
// OUTER retrieves recent memories
const recentMemo = sharedMemo.read({ from: 'INNER' });

// OUTER reflects
{
  agent: 'OUTER',
  reflection: 'INNER building market center - I should add structure',
  action: 'ADD_ENTITY',
  entity: 'Road',
  position: [4, 3],
  memo: 'Connecting market to village entrance'
}
```

### T2 - OBSERVER Coordinates
```javascript
// OBSERVER sees both actions
const innerActions = memoryStream.filter({ agent: 'INNER' });
const outerActions = memoryStream.filter({ agent: 'OUTER' });

// OBSERVER generates coordination
{
  agent: 'OBSERVER',
  reflection: 'INNER and OUTER collaborating on village - add infrastructure',
  action: 'PLAN',
  plan: [
    'INNER: Add 2 more markets',
    'OUTER: Add roads between',
    'BOTH: Agree on village boundary'
  ],
  memo: 'Village plan: market district with road network'
}
```

### Result: **Information diffused from INNER → OUTER → OBSERVER → Collective plan**

---

## Collective Memory Growth

**Generational learning:**

```javascript
// Generation 1: Naive agents
const gen1Memory = {
  observations: ['Added house', 'Added tree', 'Random placements'],
  reflections: [],
  wisdom: 0
};

// Generation 2: Learns from Gen 1
const gen2Memory = {
  observations: [...gen1Memory.observations, 'Houses cluster naturally'],
  reflections: ['Clustering improves village cohesion'],
  wisdom: 1
};

// Generation 3: Synthesizes pattern
const gen3Memory = {
  observations: [...gen2Memory.observations, 'Roads connect clusters'],
  reflections: [
    ...gen2Memory.reflections,
    'Villages need: clusters + roads + center'
  ],
  wisdom: 2
};

// Generation 4: Abstract principle
const gen4Memory = {
  observations: [...gen3Memory.observations],
  reflections: [
    ...gen3Memory.reflections,
    'PRINCIPLE: Parts (houses) + Connections (roads) + Whole (center) = Order'
  ],
  wisdom: 3
};
```

**This maps directly to your DSL Order axis: Parts → Whole!**

---

## Implementation Plan

### Phase 1: Memory Stream Foundation
- [ ] Add memory stream data structure
- [ ] Implement observation logging
- [ ] Add importance scoring
- [ ] Implement retrieval function (recency + importance + relevance)

### Phase 2: 3-Chat Interface
- [ ] Split UI into 3 panels (inner/outer/observer)
- [ ] Add shared memo display (ring buffer view)
- [ ] Each chat has its own message list
- [ ] Observer can see both other chats

### Phase 3: Scene Modification
- [ ] Agents output JSON actions (ADD_ENTITY, MOVE_ENTITY, REMOVE_ENTITY)
- [ ] Execute actions on grid
- [ ] Log actions to memory stream
- [ ] Update axis readings after each action

### Phase 4: Reflection & Planning
- [ ] Implement reflection trigger (importance threshold)
- [ ] Generate reflection prompts
- [ ] Add reflection to memory stream
- [ ] Implement planning (multi-step actions)

### Phase 5: Coordination
- [ ] OBSERVER reads both chats
- [ ] OBSERVER writes to shared memo
- [ ] Agents retrieve from shared memo
- [ ] Implement conflict resolution

---

## Key Differences from Current dsl-01

| Feature | Current dsl-01 | Proposed Architecture |
|---------|---------------|----------------------|
| Chats | 1 (single) | 3 (inner/outer/observer) |
| Memory | Messages only | Stream (obs/ref/plans) |
| Scene modification | ❌ None | ✅ ADD/MOVE/REMOVE |
| Agent coordination | ❌ None | ✅ Shared memo |
| Retrieval | ❌ None | ✅ Recency+Importance+Relevance |
| Reflection | ❌ None | ✅ Automatic synthesis |
| Planning | ❌ None | ✅ Multi-step sequences |
| Information diffusion | ❌ None | ✅ Agents observe each other |
| Collective memory | ❌ None | ✅ Cross-agent learning |

---

## Next Steps

1. **Do you want me to build this?**
   - Full multi-agent memory architecture
   - 3-chat interface with shared memo
   - Scene modification capabilities
   - Memory stream + retrieval + reflection

2. **Or start incrementally?**
   - First: Add scene modification to current dsl-01
   - Then: Split into 3 chats
   - Then: Add memory stream
   - Finally: Add reflection/planning

3. **Or focus on specific component?**
   - Memory stream only
   - Shared memo ring buffer
   - Retrieval function
   - Reflection synthesis

**The architecture is clear. We just need to build it.** 🎯

Which path do you want to take?
