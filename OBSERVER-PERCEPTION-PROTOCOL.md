# Observer Perception Protocol
## Model OF = Model FOR (Generative Observation)

## The Problem: Context Contamination

**Current (Broken):**
```
INNER sees: Scene + Memo + Starter Prompt + Axes
OUTER sees: Scene + Memo + Starter Prompt + Axes
OBSERVER sees: Nothing (just routes)

Result: Agents contaminate each other's context via memo
        No isolated observation layer
        No targeting to scene graph
```

**Fixed (Isolated Contexts):**
```
OBSERVER:
  1. OBSERVE (reads scene graph, axes, spatial relations)
  2. ANALYZE (interprets what's seen)
  3. DECIDE (triages to INNER or OUTER)

INNER:
  - Sees: Only interior detail layer
  - Writes: Targeted actions to scene graph nodes
  - Does NOT see: OUTER's reasoning

OUTER:
  - Sees: Only exterior context layer
  - Writes: Targeted actions to scene graph nodes
  - Does NOT see: INNER's reasoning
```

---

## Scene Graph as READ Target

### Structure

```javascript
const sceneGraph = {
  root: {
    id: 'scene',
    type: 'ROOT',
    position: null,
    
    entities: [
      {
        id: 'house1',
        type: 'BUILDING',
        position: [4, 4],
        icon: '🏠',
        label: 'House',
        
        interior: {  // INNER's READ/WRITE domain
          id: 'house1_interior',
          entities: [
            { id: 'furniture1', type: 'FURNITURE', icon: '🪑', label: 'Chair' },
            { id: 'fireplace1', type: 'FIXTURE', icon: '🔥', label: 'Fireplace' }
          ],
          density: 0.2,
          chaos: 0.1
        },
        
        exterior: {  // OUTER's READ/WRITE domain
          id: 'house1_exterior',
          entities: [
            { id: 'garden1', type: 'GARDEN', icon: '🌻', label: 'Garden' },
            { id: 'fence1', type: 'BOUNDARY', icon: '🚧', label: 'Fence' }
          ],
          connections: ['road1'],
          isolation: 0.3
        }
      },
      
      {
        id: 'road1',
        type: 'INFRASTRUCTURE',
        position: [[4,3], [4,4], [4,5]],  // Path segments
        icon: '🛤️',
        label: 'Road',
        connects: ['house1', 'market1']
      }
    ],
    
    spatial: {
      density: 0.15,
      clusters: [
        { center: [4,4], entities: ['house1', 'road1'], radius: 2 }
      ],
      overlaps: [],
      isolated: [],
      negativeSpace: [
        { region: [0,0,3,3], size: 16, quality: 'open' }
      ]
    }
  }
};
```

### Model OF = Model FOR

**Whatever observer SEES, agents can GENERATE:**

```javascript
// Observer READS (Model OF):
const observation = {
  sees: "house at (4,4) with empty interior",
  interprets: "potential for interior development",
  spatial: "isolation score 0.7 - needs connection"
};

// Agent WRITES (Model FOR):
const action = {
  operator: "INTEGRATE",
  target: "house1.interior",  // Scene graph path
  actionType: "ADD",
  entity: {
    type: "FURNITURE",
    icon: "🪑",
    label: "Chair",
    parent: "house1.interior"  // Where in graph
  }
};
```

**Same vocabulary, different directions:**
- Observer: Scene Graph → Observation (READ)
- Agent: Observation → Scene Graph (WRITE)

---

## Observer Observation Pipeline

### Phase 1: OBSERVE (Pure Perception)

```javascript
async function observeScene(sceneGraph, axes) {
  // 1. See the scene (no interpretation yet)
  const rawObservation = {
    entityCount: sceneGraph.root.entities.length,
    positions: sceneGraph.root.entities.map(e => e.position),
    types: sceneGraph.root.entities.map(e => e.type),
    spatial: sceneGraph.root.spatial
  };
  
  // 2. See axis readings
  const axisObservation = {
    I: axes.I,
    E: axes.E,
    L: axes.L,
    D: axes.D,
    P: axes.P,
    O: axes.O,
    imbalances: computeImbalances(axes)
  };
  
  // 3. See spatial relations
  const spatialObservation = {
    clusters: sceneGraph.root.spatial.clusters,
    overlaps: sceneGraph.root.spatial.overlaps,
    isolated: sceneGraph.root.spatial.isolated,
    negativeSpace: sceneGraph.root.spatial.negativeSpace,
    density: sceneGraph.root.spatial.density
  };
  
  // 4. See user intent context
  const intentObservation = {
    original: state.starterPrompt,
    satisfaction: estimateIntentSatisfaction(sceneGraph, state.starterPrompt),
    progress: estimateProgress(sceneGraph)
  };
  
  return {
    raw: rawObservation,
    axes: axisObservation,
    spatial: spatialObservation,
    intent: intentObservation,
    timestamp: Date.now()
  };
}
```

### Phase 2: ANALYZE (Interpretation)

```javascript
async function analyzeObservation(observation) {
  const prompt = `You are OBSERVER. You see the scene but do not act.

## What You See (Raw):
Entities: ${observation.raw.entityCount}
Density: ${observation.spatial.density.toFixed(2)}
Clusters: ${observation.spatial.clusters.length}
Isolated: ${observation.spatial.isolated.length}
Negative Space: ${observation.spatial.negativeSpace.length} regions

## Axis Readings:
${formatAxes(observation.axes)}

## User Intent:
"${observation.intent.original}"
Progress: ${(observation.intent.satisfaction * 100).toFixed(0)}%

## Your Task (OBSERVE only, DO NOT act):
What do you see? Describe in terms of:
1. What EXISTS (entities, relationships, patterns)
2. What is MISSING (gaps, needs, potential)
3. What is IMBALANCED (axis tensions, spatial issues)
4. What the scene is BECOMING (toward intent or away?)

Return JSON:
{
  "exists": "2 houses clustered, 1 road connecting",
  "missing": "interior details, negative space in NE corner",
  "imbalanced": "Parts (7) >> Whole (2) - fragmentation",
  "becoming": "Village forming but lacks coherence"
}`;

  const response = await llmCall(prompt);
  return parseJSON(response);
}
```

### Phase 3: DECIDE (Triage)

```javascript
async function triageAction(observation, analysis) {
  const prompt = `You are OBSERVER making triage decisions.

## What You Observed:
${JSON.stringify(analysis, null, 2)}

## Scene Graph State:
Entities: ${observation.raw.entityCount}
Density: ${observation.spatial.density}

## Your Task (DECIDE which agent + operator):
Based on what you observed, decide:
1. Which agent should act? (INNER or OUTER)
2. Which operator should they use? (SHED, INTEGRATE, GROUND)
3. What should they target? (scene graph path)

INNER handles:
- Interior details (entity.interior.*)
- Parts-level work
- Detailed additions

OUTER handles:
- Exterior context (entity.exterior.*)
- Whole-level work
- Structural connections

Return JSON:
{
  "agent": "INNER",
  "operator": "INTEGRATE",
  "target": "house1.interior",
  "directive": "Add interior furniture - house is empty",
  "reasoning": "Analysis shows missing interior detail"
}`;

  const response = await llmCall(prompt);
  return parseJSON(response);
}
```

---

## Context Isolation System Instruction

### For INNER Agent

```javascript
const INNER_ISOLATION_INSTRUCTION = `
## CONTEXT ISOLATION PROTOCOL

You are INNER agent. You see ONLY:
- Your assigned target from OBSERVER
- Interior detail layer of scene graph
- Your own previous actions
- Axis readings (shared)

You do NOT see:
- OUTER agent's reasoning
- OUTER agent's actions in detail
- User intent directly (only via OBSERVER)
- Memo entries from OUTER

## What You Can Read:
- sceneGraph.entities[*].interior
- Your action history
- Axis readings

## What You Can Write:
- Actions targeted to *.interior paths
- Entity additions inside existing structures
- Detail-level modifications

## Response Format:
{
  "operator": "INTEGRATE",
  "actionType": "ADD",
  "target": "house1.interior",  // Scene graph path
  "entity": { ... },
  "reasoning": "INTEGRATE: Adding interior detail per OBSERVER directive"
}
`;
```

### For OUTER Agent

```javascript
const OUTER_ISOLATION_INSTRUCTION = `
## CONTEXT ISOLATION PROTOCOL

You are OUTER agent. You see ONLY:
- Your assigned target from OBSERVER
- Exterior context layer of scene graph
- Your own previous actions
- Axis readings (shared)

You do NOT see:
- INNER agent's reasoning
- INNER agent's actions in detail
- User intent directly (only via OBSERVER)
- Memo entries from INNER

## What You Can Read:
- sceneGraph.entities[*].exterior
- sceneGraph.entities[*].position (spatial layout)
- Your action history
- Axis readings

## What You Can Write:
- Actions targeted to *.exterior paths
- Entity connections between structures
- Spatial-level modifications

## Response Format:
{
  "operator": "GROUND",
  "actionType": "ADD",
  "target": "house1.exterior",  // Scene graph path
  "entity": { ... },
  "reasoning": "GROUND: Organizing external context per OBSERVER directive"
}
`;
```

---

## Action Targeting to Scene Graph

### Targeting Syntax

```javascript
// Root level (new structures)
target: "scene.root"

// Entity interior (INNER domain)
target: "house1.interior"

// Entity exterior (OUTER domain)  
target: "house1.exterior"

// Specific entity modification
target: "house1"

// Connection between entities
target: "house1->house2"

// Negative space region
target: "negativeSpace[0]"
```

### Target Resolution

```javascript
function resolveTarget(targetPath, sceneGraph) {
  const parts = targetPath.split('.');
  
  if (parts[0] === 'scene' && parts[1] === 'root') {
    return sceneGraph.root;
  }
  
  // Find entity by id
  const entityId = parts[0];
  const entity = sceneGraph.root.entities.find(e => e.id === entityId);
  
  if (!entity) {
    throw new Error(`Target not found: ${entityId}`);
  }
  
  // Navigate to interior/exterior
  if (parts[1] === 'interior') {
    return entity.interior;
  } else if (parts[1] === 'exterior') {
    return entity.exterior;
  }
  
  return entity;
}

function executeTargetedAction(action, sceneGraph) {
  const target = resolveTarget(action.target, sceneGraph);
  
  switch (action.actionType) {
    case 'ADD':
      if (target.entities) {
        target.entities.push({
          id: generateId(),
          ...action.entity,
          parent: action.target
        });
      }
      break;
      
    case 'REMOVE':
      if (target.entities) {
        target.entities = target.entities.filter(e => e.id !== action.entityId);
      }
      break;
      
    case 'MOVE':
      // Update position in scene graph
      const entity = findEntity(sceneGraph, action.entityId);
      entity.position = action.newPosition;
      break;
  }
  
  // Update spatial analysis
  updateSpatialAnalysis(sceneGraph);
}
```

---

## Full Turn Sequence (Revised)

```javascript
async function executeTurn() {
  // 1. OBSERVER: OBSERVE
  const observation = await observeScene(state.sceneGraph, state.axes);
  console.log('[OBSERVER] Raw observation:', observation);
  
  // 2. OBSERVER: ANALYZE
  const analysis = await analyzeObservation(observation);
  console.log('[OBSERVER] Analysis:', analysis);
  
  // 3. OBSERVER: DECIDE (Triage)
  const triage = await triageAction(observation, analysis);
  console.log('[OBSERVER] Triage:', triage);
  addMemoEntry(`Observer: ${triage.directive}`);
  
  // 4. AGENT: ACT (isolated context)
  if (triage.agent === 'INNER') {
    const action = await callInnerAgent(
      triage.target,
      triage.operator,
      triage.directive,
      state.sceneGraph  // Only interior layer visible
    );
    executeTargetedAction(action, state.sceneGraph);
    console.log('[INNER] Action:', action);
    
  } else {
    const action = await callOuterAgent(
      triage.target,
      triage.operator,
      triage.directive,
      state.sceneGraph  // Only exterior layer visible
    );
    executeTargetedAction(action, state.sceneGraph);
    console.log('[OUTER] Action:', action);
  }
  
  // 5. UPDATE: Axes, spatial analysis, rendering
  updateSpatialAnalysis(state.sceneGraph);
  updateAxes();
  renderScene();
  
  state.turn++;
}
```

---

## Key Design Principles

### 1. **Separation of Concerns**
- Observer: SEES (perception)
- Observer: ANALYZES (interpretation)
- Observer: DECIDES (triage)
- Agents: ACT (execution)

### 2. **Context Isolation**
- INNER sees only interior layer
- OUTER sees only exterior layer
- Memo shows triage only, not reasoning
- Agents don't contaminate each other

### 3. **Scene Graph as Ground Truth**
- All reads from scene graph
- All writes to scene graph
- Actions are targeted via paths
- Spatial analysis computed from graph

### 4. **Model OF = Model FOR**
- Same vocabulary for observation and generation
- Observer's description → Agent's action
- Read and write use same language
- Symmetry between perception and creation

---

## Implementation Checklist

Phase 1:
- [ ] Implement scene graph data structure
- [ ] Add interior/exterior layers to entities
- [ ] Create observeScene() function
- [ ] Create analyzeObservation() function
- [ ] Create triageAction() function
- [ ] Add context isolation instructions to agent prompts
- [ ] Implement target resolution
- [ ] Implement executeTargetedAction()
- [ ] Add console logging throughout
- [ ] Update turn sequence

---

**Ready to implement?** This gives us:
1. ✅ Observer perception layer (OBSERVE → ANALYZE → DECIDE)
2. ✅ Context isolation (agents don't contaminate)
3. ✅ Scene graph targeting (actions have addresses)
4. ✅ Model OF = Model FOR (generative observation)

Or do you want to refine the architecture first?
