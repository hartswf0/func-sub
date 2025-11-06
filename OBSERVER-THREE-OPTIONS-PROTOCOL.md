# Observer Three-Options Protocol
## God's Eye View → Three Paths → Agent Choice → Reflection

## The Pathology (From Log)

```json
Turn 38: SHED → REMOVE fence
Turn 39: SHED → REMOVE fence
Turn 40: SHED → REMOVE fence
...

No reflection, no harmony, just repetition.
```

**Missing:** Observer doesn't generate OPTIONS. Agents just react blindly to axes.

---

## New Architecture: Observer Generates Three Paths

### Turn Flow (Revised)

```
1. OBSERVER: God's Eye View
   - See entire scene composition
   - Analyze shape, proportion, relations
   - Detect patterns, clusters, negative space
   
2. OBSERVER: Generate THREE Options
   - SHED option: What to remove/move out
   - INTEGRATE option: What to group/unify
   - GROUND option: What to stabilize/compose
   
3. USER: Chat with Observer (optional)
   - Discuss alternatives
   - Explore implications
   - Shape interpretation
   
4. INNER: Choose from three options
   - Based on inner axis homeostasis
   - Selects one of three paths
   
5. OUTER: Choose from three options  
   - Based on outer axis homeostasis
   - Selects one of three paths
   
6. REFLECTION: Log cycle
   - What was chosen?
   - Why not the others?
   - How did scene change?
```

---

## Observer's God's Eye View

### Compositional Analysis

```javascript
function observeComposition(scene) {
  return {
    // SHAPE
    shape: {
      clusters: identifyClusters(scene),
      lines: identifyLinearPatterns(scene),
      symmetry: detectSymmetry(scene),
      balance: analyzeBalance(scene)
    },
    
    // PROPORTION
    proportion: {
      density: scene.entities.length / 81,
      distribution: analyzeDistribution(scene),
      scale: analyzeScale(scene),
      spacing: analyzeSpacing(scene)
    },
    
    // RELATIONS
    relations: {
      adjacencies: findAdjacencies(scene),
      connections: findConnections(scene),
      containments: findContainments(scene),
      separations: findSeparations(scene)
    },
    
    // NEGATIVE SPACE
    negativeSpace: {
      voids: findLargeVoids(scene),
      margins: findMargins(scene),
      breathing: assessBreathingRoom(scene)
    },
    
    // PATTERNS
    patterns: {
      repetitions: findRepetitions(scene),
      sequences: findSequences(scene),
      anomalies: findAnomalies(scene)
    }
  };
}
```

---

## Three-Options Generation

### SHED Option: Remove/Clear/Move Out

```javascript
function generateShedOption(composition, axes) {
  // What's causing clutter or blocking flow?
  const blockers = composition.relations.separations;
  const excess = composition.patterns.repetitions.filter(r => r.count > 3);
  const crowded = composition.proportion.density > 0.6;
  
  return {
    operator: "SHED",
    title: "Clear the Garden Fence Cluster",
    action: {
      type: "REMOVE",
      targets: ["fence1", "fence2", "fence3"],
      reason: "3 fences clustered - blocking flow to garden"
    },
    impact: {
      before: "Garden isolated by fence cluster",
      after: "Garden opens to paths, better circulation"
    },
    axes_shift: {
      O_parts: -2,  // Less fragmentation
      D_source: +1  // Better flow
    }
  };
}
```

### INTEGRATE Option: Group/Unify/Replace

```javascript
function generateIntegrateOption(composition, axes) {
  // What's scattered that could be unified?
  const scattered = composition.patterns.repetitions;
  const disconnected = composition.relations.adjacencies.filter(a => a.isolated);
  
  // Find set of similar entities
  const pathSegments = scene.entities.filter(e => e.type === 'PATH');
  
  return {
    operator: "INTEGRATE",
    title: "Unify Path Segments into Road Network",
    action: {
      type: "REPLACE_SET",
      targets: ["path1", "path2", "path3", "path4"],
      replacement: {
        type: "ROAD_NETWORK",
        icon: "🛤️",
        label: "Village Road",
        spans: [[4,3], [4,4], [4,5], [5,4]]
      },
      reason: "4 path segments scattered - unify into coherent network"
    },
    impact: {
      before: "Disconnected path fragments",
      after: "Integrated road network connecting structures"
    },
    axes_shift: {
      O_whole: +3,  // Better coherence
      L_ideology: +1  // System emerges
    }
  };
}
```

### GROUND Option: Stabilize/Compose/Lock

```javascript
function generateGroundOption(composition, axes) {
  // What needs stabilization or compositional work?
  const unbalanced = composition.shape.balance < 0.5;
  const unstable = findUnstableElements(composition);
  const proportionIssues = composition.proportion.distribution.variance > 0.7;
  
  return {
    operator: "GROUND",
    title: "Establish Garden as Anchored Center",
    action: {
      type: "LOCK_AND_COMPOSE",
      target: "garden1",
      modifications: {
        position: [4, 4],  // Center of grid
        locked: true,      // Cannot be moved/removed
        scale: 1.5,        // Visual emphasis
        relations: {
          attracts: ["path", "house"],  // Compositional gravity
          repels: ["fence"]              // Keep clear space
        }
      },
      reason: "Scene lacks anchored center - garden becomes gravitational point"
    },
    impact: {
      before: "Floating elements with no anchor",
      after: "Garden anchors composition, elements relate to center"
    },
    axes_shift: {
      O_whole: +2,   // Coherent structure
      P_heart: +2,   // Emotional anchor
      D_resource: +1 // Central flow point
    }
  };
}
```

---

## Operator Semantics (Refined)

### SHED: Removal & Clearing
- **Remove** entities entirely
- **Move** entities out of frame/to edges
- **Clear** clutter from areas
- **Create** negative space
- **Thin** overly dense regions

**NOT additive** - only subtractive or displacement.

### INTEGRATE: Grouping & Unification
- **Group** similar entities into single unit
- **Replace set** with unified structure
- **Connect** disconnected elements
- **Merge** fragments into whole
- **Bridge** gaps between parts

**Combines multiple into fewer** - reduces entity count while increasing coherence.

### GROUND: Stabilization & Composition
- **Lock** entities (cannot be removed)
- **Compose** proportional relationships
- **Stabilize** with attractors/repellers
- **Balance** distribution
- **Anchor** scene with fixed points
- **Scale** for emphasis

**Works on relations, not just entities** - shapes the compositional field.

---

## Observer Chat Interface

### User Interactions

```javascript
// User sees three options
Observer Options (Turn 40):

1. [SHED] Clear the Garden Fence Cluster
   Remove 3 fences blocking garden access
   Impact: Opens circulation, -2 parts fragmentation

2. [INTEGRATE] Unify Path Segments into Road Network  
   Replace 4 paths with integrated road
   Impact: +3 whole coherence, system emerges

3. [GROUND] Establish Garden as Anchored Center
   Lock garden at center, create compositional gravity
   Impact: +2 whole, +2 heart, scene gets anchor

💬 User: "Why would we ground instead of integrate?"

🎯 Observer: "INTEGRATE unifies the paths but doesn't give 
the scene a stable center. GROUND makes the garden an 
immovable anchor point - everything else will organize 
around it. Consider: do you want a network system 
(integrate) or a centered composition (ground)?"

💬 User: "Let's do ground, but make the house the anchor"

🎯 Observer: "Adjusting GROUND option to use house1 as 
anchor instead. This shifts from natural (garden) to 
built (house) as organizing principle."

[Modified option passed to agents]
```

### Chat Functions

```javascript
async function chatWithObserver(userMessage, threeOptions) {
  const prompt = `You are OBSERVER with god's eye view.

## Current Three Options:
${JSON.stringify(threeOptions, null, 2)}

## User Question:
"${userMessage}"

## Your Role:
- Explain trade-offs between options
- Discuss compositional implications
- Help user understand what each path leads to
- Suggest modifications if user wants
- DO NOT make the choice - agents will choose

## Response:
Thoughtful explanation of the options in context of user's question.`;

  const response = await llmCall(prompt);
  return response;
}
```

---

## Agent Choice Logic

### INNER Chooses Based on Interior Axis View

```javascript
async function innerChooseFromOptions(threeOptions, innerAxes) {
  const prompt = `You are INNER. Choose ONE of three options.

## Your Axis View (Inner Poles):
I (Instinct): ${innerAxes.I}
E (Seen): ${innerAxes.E}  ${innerAxes.E < 4 ? '← LOW' : ''}
L (Ideas): ${innerAxes.L}
D (Source): ${innerAxes.D}
P (Heart): ${innerAxes.P}  ${innerAxes.P < 4 ? '← LOW' : ''}
O (Parts): ${innerAxes.O}  ${innerAxes.O > 6 ? '← HIGH' : ''}

## Three Options:
1. SHED: ${threeOptions.shed.title}
   ${threeOptions.shed.axes_shift ? 'Shifts: ' + JSON.stringify(threeOptions.shed.axes_shift) : ''}
   
2. INTEGRATE: ${threeOptions.integrate.title}
   ${threeOptions.integrate.axes_shift ? 'Shifts: ' + JSON.stringify(threeOptions.integrate.axes_shift) : ''}
   
3. GROUND: ${threeOptions.ground.title}
   ${threeOptions.ground.axes_shift ? 'Shifts: ' + JSON.stringify(threeOptions.ground.axes_shift) : ''}

## Your Task:
Choose the option that best addresses YOUR imbalances.
- If Parts > 6: prefer SHED
- If Heart < 4 or Seen < 4: prefer GROUND or INTEGRATE
- Consider which shifts help you most

## Response:
{
  "choice": "GROUND",
  "reasoning": "Parts=7 but Heart=3 is more critical - need anchor"
}`;

  const response = await llmCall(prompt);
  return parseJSON(response);
}
```

### OUTER Chooses Based on Exterior Axis View

```javascript
async function outerChooseFromOptions(threeOptions, outerAxes) {
  const prompt = `You are OUTER. Choose ONE of three options.

## Your Axis View (Outer Poles):
I (Reason): ${outerAxes.I}
E (Unseen): ${outerAxes.E}  ${outerAxes.E > 6 ? '← HIGH' : ''}
L (Ideology): ${outerAxes.L}  ${outerAxes.L < 4 ? '← LOW' : ''}
D (Resource): ${outerAxes.D}  ${outerAxes.D < 4 ? '← LOW' : ''}
P (Head): ${outerAxes.P}
O (Whole): ${outerAxes.O}  ${outerAxes.O < 4 ? '← LOW' : ''}

## Three Options:
[same three options]

## Your Task:
Choose the option that best addresses YOUR imbalances.
- If Whole < 4: prefer INTEGRATE or GROUND
- If Resource < 4: prefer GROUND (stabilize flow)
- If Unseen > 6: prefer SHED (reduce potential)

## Response:
{
  "choice": "INTEGRATE",
  "reasoning": "Whole=2 critical, need unification"
}`;

  const response = await llmCall(prompt);
  return parseJSON(response);
}
```

---

## Reflection Cycle

After both agents choose, log the reflection:

```javascript
function logReflection(threeOptions, innerChoice, outerChoice, scene) {
  const reflection = {
    turn: state.turn,
    options_presented: {
      shed: threeOptions.shed.title,
      integrate: threeOptions.integrate.title,
      ground: threeOptions.ground.title
    },
    inner_chose: innerChoice.choice,
    inner_reasoning: innerChoice.reasoning,
    outer_chose: outerChoice.choice,
    outer_reasoning: outerChoice.reasoning,
    consensus: innerChoice.choice === outerChoice.choice,
    executed: innerChoice.choice === outerChoice.choice 
      ? innerChoice.choice 
      : resolveConflict(innerChoice, outerChoice),
    scene_after: describeScene(scene)
  };
  
  addMemoEntry(`🔄 Reflection:
INNER chose ${reflection.inner_chose}: ${reflection.inner_reasoning}
OUTER chose ${reflection.outer_chose}: ${reflection.outer_reasoning}
${reflection.consensus ? '✓ Consensus' : '⚠ Conflict resolved'}
Executed: ${reflection.executed}`);
  
  return reflection;
}
```

---

## Implementation Plan

### Phase 1: Observer Three-Options
- [ ] Implement compositional analysis functions
- [ ] Generate three options per turn (SHED, INTEGRATE, GROUND)
- [ ] Display options in observer memo
- [ ] Wire observer chat to discuss options

### Phase 2: Agent Choice
- [ ] Pass three options to INNER
- [ ] INNER chooses based on inner axes
- [ ] Pass three options to OUTER
- [ ] OUTER chooses based on outer axes
- [ ] Handle consensus vs. conflict

### Phase 3: Reflection
- [ ] Log full reflection cycle
- [ ] Track what was NOT chosen and why
- [ ] Measure harmony over time
- [ ] Detect repetition pathology

### Phase 4: Advanced GROUND
- [ ] Implement locked entities (cannot remove)
- [ ] Compositional gravity (attract/repel)
- [ ] Proportional relations
- [ ] Visual emphasis (scale)

---

## Example Session (With Three Options)

```
Turn 10:
OBSERVER: God's eye view analysis
- 6 entities scattered
- No compositional center
- 3 path segments could unify
- Garden fence blocking flow

OBSERVER: Three Options Generated

1. [SHED] Remove Garden Fence Cluster
   Clear 3 fences to open circulation

2. [INTEGRATE] Unify 3 Path Segments into Road
   Replace paths with integrated network

3. [GROUND] Lock Garden as Center Anchor
   Make garden immovable compositional anchor

USER: "What happens if we ground the garden?"

OBSERVER: "Garden becomes the organizing principle. 
All future additions will naturally relate to it. 
Creates stable center but limits flexibility."

INNER (Parts=7, Heart=3):
"Choose GROUND - need emotional anchor (Heart=3)"

OUTER (Whole=2, Resource=4):
"Choose INTEGRATE - need coherence (Whole=2)"

⚠ CONFLICT: INNER wants GROUND, OUTER wants INTEGRATE

RESOLUTION: Alternate (this turn GROUND, next turn INTEGRATE)

EXECUTED: GROUND - Garden locked at center

REFLECTION:
- Scene now has stable anchor
- INTEGRATE deferred but not forgotten
- Next turn will likely unify paths
- Harmony: Both needs being addressed
```

---

**This architecture creates:**
1. ✅ Observer as god's eye generator of options
2. ✅ Three paths always visible
3. ✅ User can chat about alternatives
4. ✅ Agents choose based on their homeostasis
5. ✅ Reflection prevents repetition
6. ✅ Cultivation of harmony through cycles

**Ready to implement?** 🎯
