# Observer Handshake System - Implementation Status

**STATUS: ✅ FULLY IMPLEMENTED in func-orb-training.html**

**Last Updated**: Nov 4, 2025

---

## Quick Start: Using the Observer

**Try these commands in the chat:**

```
show observer          # View full observer state
/observer              # Same as above
observer status        # Same as above

@shed IDENTITY inner   # Place a node (observer tracks automatically)
@integrate LANGUAGE outer  # Observer watches INNER vs OUTER balance
```

**Check console logs** - Observer initialization and imbalance alerts are logged to console for debugging.

---

## Current Implementation (Priority 1: Complete)

The **basic observer tracking system is LIVE** without LLM modeler. Manual tracking via raw operation counts.

### What's Working Now:

1. **Global Observer State** (`appState.observerState`) - Line 1763
   - Tracks INNER balance per axis
   - Tracks OUTER balance per axis
   - Counts SHED/INTEGRATE/GROUND operations
   - Records full placement history
   - Detects polarity imbalances

2. **Console Logging** - Lines 1772-1779, 3262-3270
   - Observer initialization visible in console
   - Imbalance detection logged with details
   - Polarity dominance alerts

3. **Observer Status Command** - Lines 3287-3325
   - Type `show observer`, `/observer`, or `observer status`
   - Shows INNER vs OUTER balance breakdown
   - Shows stage distribution
   - Shows recent placements
   - Shows imbalance count

4. **Automatic Tracking** - Lines 3184-3280
   - Every node placement updates observer
   - Separate tracking for INNER vs OUTER
   - Cross-scene context windows
   - Imbalance threshold detection (diff > 1.5)

5. **Full Dimension Names** - Lines 5712-5732 ✅ **FIXED**
   - Radar labels now show **IDENTITY**, **EXPERIENCE**, **LANGUAGE**, **DOMAIN**, **PURPOSE**, **ORDER**
   - Previously showed only 3-char abbreviations ("IDE", "EXP", etc.)

---

## Original Centaur Box Pattern (index 13.html)

## Key Discovery: Observer Doesn't Chat, It Analyzes

The OBSERVER is not a chat participant. It's a **meta-analyzer** that:
1. Watches messages from ALLY and KEEPER
2. Calls an LLM with a "Modeler" prompt to extract psychographic profiles
3. Updates its beliefs about each agent
4. Displays those beliefs on the radar

## The Handshake

**There is no explicit handshake request**. The handshake is automatic:

```javascript
// After ALLY or KEEPER sends a message:
async function updateBeliefsAndEmit(s, speaker) {
  const target = otherOf(speaker);  // If ALLY spoke, analyze KEEPER next
  
  if (s.policies.useModeler && hasAPIcreds()) {
    const modelOutput = await callModeler(target);  // <-- THE HANDSHAKE
    const updatedBelief = {...profileEmpty(), ...(modelOutput?.dims || {})};
    
    // Emit event to update observer's belief
    bus.emit({
      type: 'MODEL/UPDATED',
      target: target,
      belief: updatedBelief,
      // ... other fields
    });
  }
}
```

**Trigger**: When a message is sent, the observer automatically analyzes the OTHER agent.

## The Modeler Prompt

This is THE CRITICAL PIECE - the prompt that extracts psychographic profiles:

```javascript
function buildModelerPrompt(aboutWhom, chatSnippet){
  const observerGuidance = (observerSys && observerSys.value) ? observerSys.value.trim() : '';
  return `${observerGuidance ? 'OBSERVER_GUIDANCE: '+observerGuidance+'\n\n' : ''}
You are a neutral analyst in an ethics-first sandbox.
Task: model ${aboutWhom}'s conversational behavior using ONLY the provided chat.

Do NOT infer or mention demographics, politics, health, or any sensitive attributes.
Return STRICT JSON with keys: dims, prior, posterior, myth, tone, rationale.

Ensure the "dims" object is ALWAYS present and contains ALL 11 required dimensions 
(openness, conscientious, extraversion, agreeableness, neuroticism, logic, 
empathy, authority, risk, uncertainty, decisiveness) with values between 1 and 5.

**Crucially, ensure "myth.narrative" is a 1-2 sentence string describing their 
conversational role/dynamic.**

## Dims (1-5)
Provide numeric scores for: openness, conscientious, extraversion, agreeableness, 
neuroticism, logic, empathy, authority, risk, uncertainty, decisiveness.

## Tenenbaum PLoT
- Treat each exchange as evidence in a tug-of-war of stances (e.g., caution vs progress).
- Include prior and posterior that sum to 1.

## Barthes Myth
- archetypes: 2-4 short labels (e.g., Pragmatist, Steward).
- narrative: 1-2 sentence mythic framing about conversational roles only.

## Tone
- One of: constructive, skeptical, emphatic, inquisitive, or simple combos.

JSON SHAPE:
{
  "dims": {
    "openness":3, "conscientious":3, "extraversion":3, "agreeableness":3, 
    "neuroticism":3, "logic":3, "empathy":3, "authority":3, "risk":3, 
    "uncertainty":3, "decisiveness":3
  },
  "prior": {"caution":0.5, "progress":0.5},
  "posterior": {"caution":0.45, "progress":0.55},
  "myth": {
    "archetypes":["Pragmatist","Steward"], 
    "narrative":"Their interaction is defined by a silent struggle for control..."
  },
  "tone": "constructive",
  "rationale": "<one short line on the update>"
}

CHAT SNIPPET (most recent turns):
${chatSnippet}`;
}
```

**Key Parameters**:
- `aboutWhom`: "Ally" or "Gatekeeper"
- `chatSnippet`: Last 8 messages from conversation log

## The Four Profile Types

```javascript
beliefs: {
  observerModelOfAlly: {openness:3, conscientious:3, ...},      // Observer's belief
  observerModelOfKeeper: {openness:3, conscientious:3, ...},    // Observer's belief
  allySelf: {openness:3, conscientious:3, ...},                 // Ally's self-view
  keeperSelf: {openness:3, conscientious:3, ...}                // Keeper's self-view
}
```

**Radar displays**: `observerModelOfAlly` and `observerModelOfKeeper` (observer's beliefs)

**Mini radars**: Show both self-view and observer's belief layered

## Adapting for Training Ground

### Our System Needs

Instead of ALLY vs KEEPER, we have:
- **INNER scene** (subjective operations)
- **OUTER scene** (objective operations)
- **OBSERVER scene** (meta-monitoring)

### Adaptation Plan

#### 1. Replace 11-Axis with 6-Axis

```javascript
const axes = [
  'IDENTITY',
  'EXPERIENCE', 
  'LANGUAGE',
  'DOMAIN',
  'PURPOSE',
  'ORDER'
];
```

#### 2. Create Modeler Prompt for Training Ground

```javascript
function buildTrainingModelerPrompt(targetScene, operations) {
  return `You are analyzing psychographic operations on a training grid.

Task: Extract the psychographic profile from the OPERATIONS performed by the ${targetScene} scene.

The operations show how the user organizes their psychographic space across 6 axes.
Each axis has a value from 0-100 representing focus/development in that area.

Analyze ONLY the provided operations. Return STRICT JSON.

## Axes (0-100)
- IDENTITY: Self-concept, identity formation
- EXPERIENCE: Depth of lived experience processing
- LANGUAGE: Linguistic/symbolic reasoning
- DOMAIN: Field expertise, specialized knowledge
- PURPOSE: Goal orientation, intentionality
- ORDER: Organizational structure, systematization

## Operations Format
Each operation is: STAGE • AXIS • POLARITY
- SHED: Elimination/reduction
- INTEGRATE: Connection/synthesis
- GROUND: Stabilization/institutionalization

- INNER: Instinct, Seen, Ideas, Source, Heart, Parts (subjective)
- OUTER: Reason, Unseen, Ideology, Resource, Head, Whole (objective)

JSON SHAPE:
{
  "axes": {
    "IDENTITY": 45,
    "EXPERIENCE": 60,
    "LANGUAGE": 30,
    "DOMAIN": 40,
    "PURPOSE": 75,
    "ORDER": 35
  },
  "imbalance": {
    "dominant": "INNER",
    "degree": 2.3,
    "explanation": "Heavy focus on subjective operations..."
  },
  "pattern": {
    "type": "reduction_bias",
    "description": "Primarily using SHED, avoiding GROUND..."
  },
  "narrative": "User is eliminating emotional noise while neglecting external structure."
}

OPERATIONS (recent ${operations.length}):
${operations.map(op => `${op.stage} • ${op.axis} • ${op.pair}`).join('\n')}`;
}
```

#### 3. Observer State Structure

```javascript
appState.observerState = {
  // Observer's beliefs about each scene
  observerModelOfInner: {
    IDENTITY: 30,
    EXPERIENCE: 30,
    LANGUAGE: 30,
    DOMAIN: 30,
    PURPOSE: 30,
    ORDER: 30
  },
  observerModelOfOuter: {
    IDENTITY: 30,
    EXPERIENCE: 30,
    LANGUAGE: 30,
    DOMAIN: 30,
    PURPOSE: 30,
    ORDER: 30
  },
  
  // Scenes' self-views (from their operations)
  innerSelf: {
    IDENTITY: 30,
    EXPERIENCE: 30,
    // ...
  },
  outerSelf: {
    IDENTITY: 30,
    // ...
  },
  
  // Imbalance tracking
  imbalances: [],
  recursionDepth: 0,
  placements: []
};
```

#### 4. The Handshake Implementation

```javascript
// After INNER or OUTER places a node
async function updateObserverBelief(sceneType) {
  if (!appState.observerState) return;
  
  const scene = appState.sceneRegistry[sceneType];
  if (!scene) return;
  
  // Get recent operations from this scene
  const recentOps = scene.contextWindow.placements.slice(-8);
  
  if (recentOps.length < 3) {
    // Need at least 3 operations to analyze
    return;
  }
  
  // Call modeler (LLM)
  const prompt = buildTrainingModelerPrompt(sceneType, recentOps);
  
  const modelOutput = await callLLMModeler(prompt);
  
  // Update observer's belief about this scene
  if (sceneType === 'INNER') {
    appState.observerState.observerModelOfInner = modelOutput.axes;
  } else if (sceneType === 'OUTER') {
    appState.observerState.observerModelOfOuter = modelOutput.axes;
  }
  
  // Update 3D radar with new belief
  updateRadarFromObserverBeliefs();
  
  // Observer comments on what it detected
  addMessage(observerScene, 'system',
    `📊 **OBSERVER UPDATE**\n\n` +
    `Analyzed ${sceneType} scene:\n` +
    `${modelOutput.narrative}\n\n` +
    `Pattern: ${modelOutput.pattern.description}\n` +
    `Imbalance: ${modelOutput.imbalance.explanation}`
  );
}
```

#### 5. When to Trigger

```javascript
// In sendMessageWithLEGOS, after placing a node:
if (channel.sceneType === 'POLARITY_INNER' || channel.sceneType === 'POLARITY_OUTER') {
  // Trigger observer analysis
  setTimeout(() => {
    updateObserverBelief(channel.role);  // 'INNER' or 'OUTER'
  }, 500);
}
```

#### 6. Radar Display

```javascript
function drawTrainingRadar() {
  const obs = appState.observerState;
  
  // Draw observer's belief about INNER (red/pink)
  drawRadarPolygon(
    obs.observerModelOfInner,
    0xff5c7c,
    0.2,
    false  // filled
  );
  
  // Draw observer's belief about OUTER (blue)
  drawRadarPolygon(
    obs.observerModelOfOuter,
    0x569fff,
    0.2,
    false  // filled
  );
  
  // Draw dashed outlines for clarity
  drawRadarPolygon(obs.observerModelOfInner, 0xff5c7c, 0, true);  // dashed
  drawRadarPolygon(obs.observerModelOfOuter, 0x569fff, 0, true);  // dashed
}
```

## Summary: How It Works

### In index (13).html:
1. Ally sends message
2. System calls `updateBeliefsAndEmit('ALLY')`
3. Observer analyzes KEEPER using last 8 messages
4. LLM extracts psychographic profile
5. Observer's belief about KEEPER updates
6. Radar redraws showing observer's beliefs

### For Training Ground:
1. User places node in INNER scene (`@shed IDENTITY inner`)
2. System calls `updateObserverBelief('INNER')`
3. Observer analyzes INNER scene using last 8 operations
4. LLM extracts axis values and patterns
5. Observer's belief about INNER updates
6. 3D radar redraws showing observer's beliefs
7. Observer chat shows analysis

## Key Differences

**Centaur Box**:
- Analyzes CONVERSATION messages
- Extracts personality traits (Big 5 + extensions)
- Uses 11 dimensions

**Training Ground**:
- Analyzes OPERATIONS (node placements)
- Extracts psychographic focus areas
- Uses 6 axes
- Tracks INNER vs OUTER imbalance

## Implementation Priority

1. **First**: Get basic radar working without LLM
   - Just use raw operation counts per axis
   - Display manually tracked values

2. **Then**: Add observer analysis
   - Implement modeler prompt
   - Call LLM after every 3-5 operations
   - Update observer beliefs

3. **Finally**: Add sophistication
   - Pattern detection
   - Imbalance warnings
   - Narrative generation

## The Critical Insight

**The observer doesn't need to be loaded as a "scene with system instructions" in the traditional sense.**

It's not an LLM agent with ongoing conversation. It's a **batch analyzer** that:
1. Watches operations
2. Periodically analyzes them
3. Extracts insights
4. Updates the radar

The "system instructions" are the MODELER PROMPT, not a conversational system prompt.
