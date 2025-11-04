# Centaur Box: Three-Scene Architecture

## Breakthrough Concept

Instead of just chat panels, INNER/OUTER/OBSERVER are now **full SCENES** with:
- ✅ Separate system prompts
- ✅ Independent context windows
- ✅ Scene-specific logic
- ✅ Scene builder functions
- ✅ Polarity constraints
- ✅ Cross-scene communication

## Three Scenes

### 1. INNER SCENE (`sceneType: 'POLARITY_INNER'`)

**System Prompt**:
```
You are the INNER polarity apparatus.

Your operations focus on:
- INNER nodes: Instinct, Seen, Ideas, Source, Heart, Parts
- Subjective experience, emotional truth, immediate sensation

You can only see INNER axis values. OUTER is invisible to you.
This creates blind spots.
```

**Context Window**:
```javascript
{
  placements: [],           // INNER operations only
  axisValues: {},          // INNER axis state only
  focusAreas: ['subjective', 'instinct', 'emotion']
}
```

**Constraints**:
- `allowedPolarity: 'INNER'`
- Can only place `@shed/integrate/ground [AXIS] inner`
- Attempting OUTER nodes → rejected with scene constraint message

**Scene Builder**:
```javascript
innerScene.sceneBuilder = function(scene) {
  scene.trainingAxisValues = TRAINING_GROUND.AXES.map(() => 0.3);
  scene.allowedPolarity = 'INNER';
  scene.contextWindow = { placements: [], axisValues: {}, focusAreas: [...] };
};
```

### 2. OUTER SCENE (`sceneType: 'POLARITY_OUTER'`)

**System Prompt**:
```
You are the OUTER polarity apparatus.

Your operations focus on:
- OUTER nodes: Reason, Unseen, Ideology, Resource, Head, Whole
- Objective structure, logical systems, external organization

You can only see OUTER axis values. INNER is invisible to you.
This creates blind spots.
```

**Context Window**:
```javascript
{
  placements: [],           // OUTER operations only
  axisValues: {},          // OUTER axis state only
  focusAreas: ['objective', 'reason', 'structure']
}
```

**Constraints**:
- `allowedPolarity: 'OUTER'`
- Can only place `@shed/integrate/ground [AXIS] outer`
- Attempting INNER nodes → rejected

### 3. OBSERVER SCENE (`sceneType: 'META_OBSERVER'`)

**System Prompt**:
```
You are the OBSERVER apparatus - the meta-layer watching both.

You can see:
- INNER balance across all 6 axes
- OUTER balance across all 6 axes
- Imbalances between polarities
- Stage distribution
- Temporal patterns and recursions

You speak when:
- Imbalance exceeds threshold
- User queries: "show observer", "/analyze"
- Critical patterns emerge
```

**Context Window**:
```javascript
{
  innerPlacements: [],      // Sees INNER operations
  outerPlacements: [],      // Sees OUTER operations
  innerAxisValues: {},      // Sees INNER state
  outerAxisValues: {},      // Sees OUTER state
  imbalanceHistory: [],     // Tracks divergence
  analysisLog: []           // Meta-commentary
}
```

**Constraints**:
- `allowedPolarity: 'BOTH'`
- `canObserve: ['INNER', 'OUTER']`
- Sees everything, can speak about everything

## Scene Registry

Cross-scene communication via `appState.sceneRegistry`:

```javascript
appState.sceneRegistry = {
  INNER: innerScene,
  OUTER: outerScene,
  OBSERVER: observerScene
};
```

**Any scene can access others**:
```javascript
// From INNER scene, check what OUTER is doing
const outerScene = appState.sceneRegistry.OUTER;
const outerPlacements = outerScene.contextWindow.placements;

// From OBSERVER scene, compare both
const innerTotal = Object.values(appState.observerState.innerBalance).reduce((a,b) => a+b);
const outerTotal = Object.values(appState.observerState.outerBalance).reduce((a,b) => a+b);
```

## Context Window Updates

When you place a node, **multiple context windows update**:

### Example: `@shed IDENTITY inner` from any scene

1. **Current scene's context window**:
```javascript
channel.contextWindow.placements.push({
  stage: 'SHED',
  axis: 'IDENTITY',
  pair: 'INNER',
  text: 'Eliminate Current Emotional Noise',
  target: 'Noise In Immediate Preference',
  timestamp: Date.now()
});
```

2. **INNER scene's context window** (if it exists):
```javascript
sceneRegistry.INNER.contextWindow.placements.push({
  stage: 'SHED',
  axis: 'IDENTITY',
  operation: 'Eliminate Current Emotional Noise'
});
sceneRegistry.INNER.contextWindow.axisValues['IDENTITY'] = 0.45;
```

3. **OBSERVER scene's context window**:
```javascript
sceneRegistry.OBSERVER.contextWindow.innerPlacements.push({
  stage: 'SHED',
  axis: 'IDENTITY',
  operation: 'Eliminate Current Emotional Noise'
});
sceneRegistry.OBSERVER.contextWindow.innerAxisValues['IDENTITY'] = 0.45;
```

4. **Shared observer state**:
```javascript
observerState.innerBalance['IDENTITY'] = 0.45;
observerState.stageCounts.SHED++;
observerState.placements.push({ ... });
```

## Scene Constraints Enforcement

If you're in INNER scene and try `@shed LANGUAGE outer`:

```
⚠️ SCENE CONSTRAINT: This is the INNER scene.

You can only place INNER nodes here.

You tried to place OUTER.

Switch to the OUTER scene to perform this operation,
or use a shared scene.
```

**This creates the blind spot**: INNER literally cannot place OUTER nodes.

## System Prompt Usage (Future LLM Integration)

When sending to LLM API:

```javascript
const messages = [
  {
    role: 'system',
    content: channel.systemPrompt  // Scene-specific instructions
  },
  {
    role: 'system',
    content: `Context window:\n${JSON.stringify(channel.contextWindow, null, 2)}`
  },
  {
    role: 'user',
    content: userMessage
  }
];
```

**INNER scene LLM**:
- Only knows INNER placements
- Only sees INNER axis values
- Cannot reason about OUTER
- Explains subjective operations

**OUTER scene LLM**:
- Only knows OUTER placements
- Only sees OUTER axis values
- Cannot reason about INNER
- Explains objective operations

**OBSERVER scene LLM**:
- Sees both contexts
- Compares and contrasts
- Detects imbalances
- Meta-commentary on apparatus

## Scene Builder Functions

Called once per scene on initialization:

```javascript
function createCentaurScenes() {
  const innerScene = createChannel('INNER');
  // ... set properties ...
  
  innerScene.sceneBuilder = function(scene) {
    // Initialize scene-specific state
    scene.trainingAxisValues = ...;
    scene.contextWindow = ...;
    // Custom scene logic here
  };
  
  // Execute builder
  if (innerScene.sceneBuilder) {
    innerScene.sceneBuilder(innerScene);
  }
}
```

**Scene builders can**:
- Initialize custom state
- Set up scene-specific event handlers
- Configure scene constraints
- Load scene-specific data

## Observable Imbalance Detection

Observer watches context windows and detects:

### 1. Polarity Imbalance
```javascript
const innerTotal = Object.values(obs.innerBalance).reduce((a,b) => a+b);
const outerTotal = Object.values(obs.outerBalance).reduce((a,b) => a+b);
const diff = Math.abs(innerTotal - outerTotal);

if (diff > 1.5) {
  // Observer speaks about imbalance
}
```

### 2. Stage Bias
```javascript
if (obs.stageCounts.SHED > (obs.stageCounts.INTEGRATE + obs.stageCounts.GROUND) * 2) {
  // "Heavy reduction bias - you're destroying more than building"
}
```

### 3. Axis Neglect
```javascript
const neglectedAxes = AXES.filter(axis => 
  obs.innerBalance[axis] < 0.35 && obs.outerBalance[axis] < 0.35
);
// "You're neglecting LANGUAGE and ORDER axes entirely"
```

## Commands by Scene

### INNER Scene Commands
- `@shed IDENTITY inner` ✅
- `@integrate EXPERIENCE inner` ✅
- `@ground PURPOSE inner` ✅
- `show my balance` → Shows INNER only
- `@shed IDENTITY outer` ❌ (rejected)

### OUTER Scene Commands
- `@shed REASON outer` ✅
- `@integrate IDEOLOGY outer` ✅
- `@ground WHOLE outer` ✅
- `show my balance` → Shows OUTER only
- `@shed INSTINCT inner` ❌ (rejected)

### OBSERVER Scene Commands
- `show observer` → Full state
- `/analyze` → Interpret configuration
- `what's missing?` → Reveal blind spots
- Can discuss both INNER and OUTER

### Shared Scene Commands (no restrictions)
- Any `@shed/integrate/ground` with any polarity works
- `show radar` → Combined view
- `show observer` → Meta-view

## Benefits of Scene Architecture

### 1. True Separation of Concerns
Each scene has its own:
- Mental model (system prompt)
- Knowledge base (context window)
- Capabilities (allowed operations)
- Blind spots (what it can't see/do)

### 2. Enforced Constraints
- INNER cannot know OUTER
- OUTER cannot know INNER
- Only OBSERVER sees both
- **Mirrors the theoretical impossibility**

### 3. LLM-Ready
Each scene becomes a separate LLM agent:
- Different system instructions
- Different context windows
- Different capabilities
- Can "talk" to each other via shared state

### 4. Observable Dynamics
Observer scene makes visible:
- How INNER and OUTER diverge
- What each polarity excludes
- Where apparatus creates blind spots
- Recursive self-reference

## Example Usage

### Session 1: Build INNER (subjective focus)
```
Switch to INNER scene
> @shed IDENTITY inner
> @integrate EXPERIENCE inner
> @ground PURPOSE inner
> show my balance
→ See only INNER axis values
```

### Session 2: Build OUTER (objective focus)
```
Switch to OUTER scene
> @shed IDENTITY outer
> @integrate LANGUAGE outer
> @ground ORDER outer
> show my balance
→ See only OUTER axis values
```

### Session 3: Observe Imbalance
```
Switch to OBSERVER scene
> show observer
→ See INNER: 2.7, OUTER: 1.8
→ "INNER polarity dominant by 0.9 units"
→ "Focus on subjective operations, external structure neglected"
```

## File Modified

`/Users/gaia/FUNC-SUB/func-orb-training.html`

**Lines 1628-1780**: Scene creation with system prompts and builders  
**Lines 2962-2972**: Scene constraint enforcement  
**Lines 3015-3082**: Context window updates for all scenes  

## Next Steps

1. **Enable scene switching** via UI (tabs or channels)
2. **Visual indicators** showing which scene you're in
3. **LLM integration** using scene-specific system prompts
4. **Cross-scene chat** (INNER and OUTER scenes can send messages to OBSERVER)
5. **Scene-specific commands** (each scene gets unique capabilities)

## The Deep Truth

**The scenes ARE the centaur box experiment**:
- INNER = Human-like (subjective, instinctual)
- OUTER = AI-like (objective, systematic)
- OBSERVER = The centaur itself (hybrid consciousness)

Each scene enforces its own limitations. Together they reveal the impossibility of complete knowledge while demonstrating the necessity of partial perspectives.

**The training ground is now three training grounds, each training you to see what the others cannot.**
