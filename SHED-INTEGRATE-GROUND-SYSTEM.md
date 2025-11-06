# SHED-INTEGRATE-GROUND: LLM Scene Composer System

## The Problem (From Telemetry Analysis)

**Current State:**
```json
// railway-junction-1762316728480.json shows:
{
  "role": "user",
  "text": "they sold out of bread! no more"
}
// Result: Nothing happens. User has to manually type "remove Fresh Breads"
```

**What's Missing:**
- LLM inference from natural language to scene operations
- Options presented to user (not forced actions)
- Spatial reasoning for GROUND operations

---

## Architecture: Three Inference Modes

### Mode 1: SHED (Remove Excess)

**Natural Language → Removal Inference**

**System Prompt for SHED Composer:**

```
You are a SHED scene composer. Your task is to analyze a spatial scene and user utterance to infer what should be REMOVED.

## Current Scene State
Grid Size: 9x9
Entities Present:
${entities.map(e => `- "${e.label}" at (${e.row}, ${e.col}) [${e.type}]`).join('\n')}

Train Position: ${trainPosition}%
Current Track: ${currentTrack}

## User Utterance
"${userText}"

## SHED Principle
SHED = Remove excess · discard non-essential

Possible SHED operations:
- IDENTITY/INSTINCT: Eliminate emotional noise (remove entities causing anxiety/distraction)
- EXPERIENCE/SEEN: Reduce sensory noise (remove ephemeral/cluttered elements)
- LANGUAGE/IDEAS: Sharpen meaning (remove entities with unclear purpose)
- DOMAIN/RESOURCE: Discard unnecessary assets (remove redundant entities)
- PURPOSE/HEART: Purify drive (remove entities blocking goal clarity)
- ORDER/PARTS: Isolate redundant parts (remove duplicate/excess entities)

## Your Task
Based on the user's utterance, infer 2-3 SHED options that make sense.

Return STRICT JSON:
{
  "interpretation": "brief explanation of what user means",
  "shed_axis": "which axis this relates to (e.g., EXPERIENCE/SEEN)",
  "options": [
    {
      "action": "remove",
      "targets": ["entity label 1", "entity label 2"],
      "reasoning": "why remove these",
      "preview": "what scene looks like after"
    },
    {
      "action": "remove_type",
      "target_type": "FIRE",
      "reasoning": "remove all of this type",
      "preview": "scene with all fires removed"
    }
  ]
}

EXAMPLES:

User: "they sold out of bread! no more"
→ Remove "Fresh Breads and Pastries"
Axis: DOMAIN/RESOURCE (discard depleted assets)

User: "there is a hunter who kills the frogs"
→ Remove "Lily Pond Frogs", "Green Frogs"
Axis: DOMAIN/SOURCE (remove endangered source)

User: "too noisy here, I can't think"
→ Remove "Market Vendors", "Street Musicians"
Axis: EXPERIENCE/SEEN (reduce sensory noise)

User: "clear the clutter"
→ Remove entities at same position (duplicates)
Axis: ORDER/PARTS (isolate redundant parts)

Return JSON only.
```

**Code Implementation:**

```javascript
async function shedComposer(userText, sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  const prompt = `[System prompt above with ${userText} and ${entities} interpolated]`;
  
  const response = await fetch(apiBase + '/chat/completions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey},
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt}],
      response_format: {type: 'json_object'},
      temperature: 0.7
    })
  });
  
  const result = await response.json();
  const shed = JSON.parse(result.choices[0].message.content);
  
  // PRESENT OPTIONS TO USER
  showShedOptions(shed.options);
  
  // User clicks option → execute removal
  // This is the KEY: LLM suggests, user confirms, code executes
}

function showShedOptions(options) {
  // Display 2-3 buttons
  // "Remove Bread (depleted asset)"
  // "Remove all entities at (3,4) (clear position)"
  
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'shed-option';
    btn.textContent = `🗑️ ${opt.action}: ${opt.targets?.join(', ') || opt.target_type}`;
    btn.title = opt.reasoning;
    btn.onclick = () => executeShed(opt);
    
    shedOptionsPanel.appendChild(btn);
  });
}

function executeShed(option) {
  if (option.action === 'remove') {
    option.targets.forEach(label => {
      const entity = findEntityByLabel(label);
      if (entity) removeEntity(entity.id);
    });
  } else if (option.action === 'remove_type') {
    removeAllEntitiesOfType(option.target_type);
  }
  
  updateGridDisplay();
  logShedAction(option);
}
```

---

### Mode 2: INTEGRATE (Connect Parts)

**Natural Language → Connection Inference**

**System Prompt for INTEGRATE Composer:**

```
You are an INTEGRATE scene composer. Your task is to analyze a spatial scene and user utterance to infer what should be CONNECTED or UNIFIED.

## Current Scene State
Grid Size: 9x9
Entities Present:
${entities.map(e => `- "${e.label}" at (${e.row}, ${e.col}) [${e.type}]`).join('\n')}

Spatial Analysis:
- Isolated entities: ${isolatedEntities}
- Clusters: ${clusters}
- Gaps: ${gaps}

## User Utterance
"${userText}"

## INTEGRATE Principle
INTEGRATE = Connect parts into patterns

Possible INTEGRATE operations:
- IDENTITY/INSTINCT: Align instinct to goals (connect emotionally-related entities)
- EXPERIENCE/SEEN: Map seen to structure (connect visible entities to underlying meaning)
- LANGUAGE/IDEAS: Synthesize ideas to patterns (group conceptually-related entities)
- DOMAIN/RESOURCE: Optimize resource to goal (connect sources to uses)
- PURPOSE/HEART: Harmonize heart to head (connect emotional and logical entities)
- ORDER/PARTS: Combine parts to whole (physically group scattered entities)

## Your Task
Based on the user's utterance and scene state, infer 2-3 INTEGRATE options.

Return STRICT JSON:
{
  "interpretation": "what user wants to integrate",
  "integrate_axis": "which axis (e.g., ORDER/PARTS)",
  "options": [
    {
      "action": "group_spatial",
      "targets": ["entity 1", "entity 2", "entity 3"],
      "new_position": {"row": 4, "col": 4},
      "reasoning": "bring scattered items to center",
      "preview": "all items now adjacent at (4,4), (4,5), (5,4)"
    },
    {
      "action": "create_path",
      "from": "entity 1",
      "to": "entity 2",
      "reasoning": "establish connection between source and destination",
      "preview": "visual line connecting entities"
    },
    {
      "action": "merge_similar",
      "target_type": "TREE",
      "new_label": "Forest",
      "reasoning": "combine multiple trees into unified forest",
      "preview": "single Forest entity replaces individual trees"
    }
  ]
}

EXAMPLES:

User: "the dock is scattered bring it together"
→ Group all "Dock", "Pier", "Boat" entities to adjacent cells
Axis: ORDER/PARTS (combine parts to whole)

User: "connect the farm to the market"
→ Create visual path or move entities closer
Axis: DOMAIN/RESOURCE (optimize resource to goal)

User: "these ideas are related"
→ Merge conceptually-similar entities into group
Axis: LANGUAGE/IDEAS (synthesize ideas to patterns)

User: "make the village coherent"
→ Group all building-type entities into cluster
Axis: ORDER/WHOLE (integrate whole to patterns)

Return JSON only.
```

**Code Implementation:**

```javascript
async function integrateComposer(userText, sceneState) {
  // Analyze spatial relationships first
  const analysis = analyzeSpatialRelations(sceneState);
  
  const prompt = `[System prompt with scene + analysis]`;
  
  const response = await fetch(apiBase + '/chat/completions', {
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt}],
      response_format: {type: 'json_object'}
    })
  });
  
  const result = await response.json();
  const integrate = JSON.parse(result.choices[0].message.content);
  
  showIntegrateOptions(integrate.options);
}

function analyzeSpatialRelations(sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  // Find isolated (no neighbors within 1 cell)
  const isolated = entities.filter(e => {
    const neighbors = entities.filter(other => 
      Math.abs(other.row - e.row) <= 1 && 
      Math.abs(other.col - e.col) <= 1 &&
      other.id !== e.id
    );
    return neighbors.length === 0;
  });
  
  // Find clusters (groups within 2 cells of each other)
  const clusters = findClusters(entities);
  
  // Find large gaps (empty regions)
  const gaps = findEmptyRegions(sceneState.grid);
  
  return {isolated, clusters, gaps};
}

function executeIntegrate(option) {
  if (option.action === 'group_spatial') {
    // Move all targets to adjacent cells around new_position
    const baseRow = option.new_position.row;
    const baseCol = option.new_position.col;
    
    option.targets.forEach((label, i) => {
      const entity = findEntityByLabel(label);
      if (entity) {
        // Arrange in circle around center
        const offset = getRadialOffset(i, option.targets.length);
        entity.row = baseRow + offset.row;
        entity.col = baseCol + offset.col;
        updateEntityPosition(entity);
      }
    });
  } else if (option.action === 'create_path') {
    // Add visual connector (line or series of marker entities)
    createVisualPath(option.from, option.to);
  } else if (option.action === 'merge_similar') {
    // Replace multiple entities with single grouped entity
    const toMerge = entities.filter(e => e.type === option.target_type);
    const centerPos = getCenterOfMass(toMerge);
    
    // Remove originals
    toMerge.forEach(e => removeEntity(e.id));
    
    // Create merged entity
    addEntity({
      type: option.target_type,
      label: option.new_label,
      row: centerPos.row,
      col: centerPos.col
    });
  }
  
  updateGridDisplay();
}
```

---

### Mode 3: GROUND (Stabilize Patterns)

**Natural Language → Spatial Ordering Inference**

**This is the critical one for your pathologies - spatial relations, scale, positioning.**

**System Prompt for GROUND Composer:**

```
You are a GROUND scene composer. Your task is to analyze a spatial scene and user utterance to infer how to STABILIZE patterns into durable order.

## Current Scene State
Grid Size: 9x9
Entities Present:
${entities.map(e => `- "${e.label}" at (${e.row}, ${e.col}) [${e.type}] size:${e.scale || 1.0}`).join('\n')}

Spatial Pathologies Detected:
- Overlapping entities: ${overlaps}
- Scale mismatches: ${scaleMismatches}
- Misaligned elements: ${misalignments}
- Unclear relationships: ${unclearRelations}

## User Utterance
"${userText}"

## GROUND Principle
GROUND = Stabilize patterns into order

Critical GROUND operations (addressing spatial pathologies):

### A. SCALE NORMALIZATION
Problem: Entities at same conceptual level have inconsistent sizes
Operation: Set scale values (0.5, 1.0, 2.0) based on semantic importance
Example: "Tree" (scale:2.0), "Flower" (scale:0.5), "Human" (scale:1.0)

### B. SPATIAL ARRANGEMENT
Problem: Entities randomly positioned without semantic meaning
Operation: Arrange in patterns (grid, circle, line, hierarchy)
Example: "Houses" in grid, "Council" in circle, "Path" in line

### C. RELATIONSHIP FORMALIZATION
Problem: Related entities not visually connected
Operation: Add proximity rules (A always near B, C never overlaps D)
Example: "Farmer" near "Farm", "Fire" away from "Water"

### D. LAYERING/DEPTH
Problem: Foreground/background unclear
Operation: Set z-index or layer values
Example: "Background hills" (z:0), "Trees" (z:1), "Characters" (z:2)

### E. SYMMETRY/ALIGNMENT
Problem: Asymmetric when should be symmetric, misaligned
Operation: Mirror, center, align to grid
Example: "Village center at (4,4)", "Symmetric shops at (3,4) and (5,4)"

### F. CLUSTERING/SPACING
Problem: Entities too crowded or too sparse
Operation: Apply spacing rules (min distance 1, max distance 3)
Example: "Trees clustered in (2-3, 2-3)", "Buildings spaced 2 apart"

## Your Task
Analyze the scene's spatial pathologies and user intent. Suggest 2-3 GROUND operations that create **durable spatial order**.

Return STRICT JSON:
{
  "interpretation": "what user wants to stabilize",
  "ground_axis": "which axis (e.g., ORDER/PARTS)",
  "spatial_pathologies": ["overlap at (3,4)", "scale mismatch between Tree and Flower"],
  "options": [
    {
      "action": "normalize_scale",
      "rules": [
        {"type": "TREE", "scale": 2.0, "reasoning": "large environmental element"},
        {"type": "HUMAN", "scale": 1.0, "reasoning": "baseline scale"},
        {"type": "ITEM", "scale": 0.5, "reasoning": "small object"}
      ],
      "preview": "all entities scaled appropriately",
      "addresses": "scale mismatch pathology"
    },
    {
      "action": "arrange_pattern",
      "pattern": "circle",
      "center": {"row": 4, "col": 4},
      "radius": 2,
      "targets": ["Council Member 1", "Council Member 2", "Council Member 3"],
      "reasoning": "council in circular formation shows equality",
      "preview": "members evenly distributed in circle",
      "addresses": "unclear relationship pathology"
    },
    {
      "action": "formalize_relationships",
      "rules": [
        {"entity1": "Farmer", "relation": "near", "entity2": "Farm", "distance": 1},
        {"entity1": "Fire", "relation": "away_from", "entity2": "Water", "min_distance": 3}
      ],
      "reasoning": "semantic relationships reflected spatially",
      "preview": "entities repositioned per rules",
      "addresses": "unclear relationship pathology"
    },
    {
      "action": "apply_grid_alignment",
      "target_type": "BUILDING",
      "alignment": "center",
      "spacing": 2,
      "reasoning": "buildings on regular grid shows planning",
      "preview": "buildings aligned at (2,2), (2,4), (2,6), (4,2)...",
      "addresses": "misalignment pathology"
    }
  ]
}

EXAMPLES:

User: "make this look like a real village"
→ normalize_scale (houses 1.5x, people 1.0x, items 0.5x)
→ arrange_pattern (houses in grid, plaza in center)
→ formalize_relationships (shops near plaza, farms at edge)
Axis: ORDER/WHOLE (institutionalize order into function)

User: "the farm should be organized"
→ apply_grid_alignment (crops in rows)
→ formalize_relationships (barn near crops, farmer near barn)
Axis: ORDER/PARTS (stabilize arrangement into fixed state)

User: "this council scene needs structure"
→ arrange_pattern (council in circle)
→ normalize_scale (all council members same size)
→ formalize_relationships (speaker in center, members around)
Axis: IDENTITY/REASON (formalize principle into use)

Return JSON only.
```

**Code Implementation:**

```javascript
async function groundComposer(userText, sceneState) {
  // First detect spatial pathologies
  const pathologies = detectSpatialPathologies(sceneState);
  
  const prompt = `[System prompt with scene + pathologies]`;
  
  const response = await fetch(apiBase + '/chat/completions', {
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt}],
      response_format: {type: 'json_object'},
      temperature: 0.6  // Lower temp for more structured operations
    })
  });
  
  const result = await response.json();
  const ground = JSON.parse(result.choices[0].message.content);
  
  showGroundOptions(ground.options);
}

function detectSpatialPathologies(sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  // PATHOLOGY 1: Overlapping entities
  const overlaps = [];
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      if (entities[i].row === entities[j].row && entities[i].col === entities[j].col) {
        overlaps.push(`${entities[i].label} and ${entities[j].label} at (${entities[i].row},${entities[i].col})`);
      }
    }
  }
  
  // PATHOLOGY 2: Scale mismatches (related entities with different scales)
  const scaleMismatches = [];
  const typeGroups = groupByType(entities);
  for (const [type, group] of Object.entries(typeGroups)) {
    const scales = group.map(e => e.scale || 1.0);
    const variance = calculateVariance(scales);
    if (variance > 0.2) {  // Inconsistent scales
      scaleMismatches.push(`${type} entities have inconsistent scales: ${scales.join(', ')}`);
    }
  }
  
  // PATHOLOGY 3: Misaligned elements (not on grid)
  const misalignments = entities.filter(e => {
    // Check if entity is off-grid or poorly positioned
    return (e.row % 1 !== 0) || (e.col % 1 !== 0);
  });
  
  // PATHOLOGY 4: Unclear relationships (semantically-related entities far apart)
  const unclearRelations = detectSemanticDistance(entities);
  
  return {overlaps, scaleMismatches, misalignments, unclearRelations};
}

function executeGround(option) {
  if (option.action === 'normalize_scale') {
    option.rules.forEach(rule => {
      const targets = entities.filter(e => e.type === rule.type);
      targets.forEach(e => {
        e.scale = rule.scale;
        updateEntityScale(e);
      });
    });
  }
  
  else if (option.action === 'arrange_pattern') {
    const targets = option.targets.map(label => findEntityByLabel(label));
    
    if (option.pattern === 'circle') {
      const angleStep = (Math.PI * 2) / targets.length;
      targets.forEach((entity, i) => {
        const angle = angleStep * i;
        entity.row = option.center.row + Math.round(Math.cos(angle) * option.radius);
        entity.col = option.center.col + Math.round(Math.sin(angle) * option.radius);
        updateEntityPosition(entity);
      });
    }
    
    else if (option.pattern === 'grid') {
      // Arrange in evenly-spaced grid
      const sqrtCount = Math.ceil(Math.sqrt(targets.length));
      targets.forEach((entity, i) => {
        entity.row = option.center.row + Math.floor(i / sqrtCount) * option.spacing;
        entity.col = option.center.col + (i % sqrtCount) * option.spacing;
        updateEntityPosition(entity);
      });
    }
    
    else if (option.pattern === 'line') {
      // Arrange in straight line
      targets.forEach((entity, i) => {
        entity.row = option.start.row + i * option.direction.row;
        entity.col = option.start.col + i * option.direction.col;
        updateEntityPosition(entity);
      });
    }
  }
  
  else if (option.action === 'formalize_relationships') {
    option.rules.forEach(rule => {
      const entity1 = findEntityByLabel(rule.entity1);
      const entity2 = findEntityByLabel(rule.entity2);
      
      if (rule.relation === 'near') {
        // Move entity1 within distance of entity2
        const targetPos = findNearestEmptyCell(entity2, rule.distance);
        entity1.row = targetPos.row;
        entity1.col = targetPos.col;
        updateEntityPosition(entity1);
      }
      
      else if (rule.relation === 'away_from') {
        // Move entity1 to be min_distance from entity2
        const currentDist = distance(entity1, entity2);
        if (currentDist < rule.min_distance) {
          const newPos = findPositionAtDistance(entity1, entity2, rule.min_distance);
          entity1.row = newPos.row;
          entity1.col = newPos.col;
          updateEntityPosition(entity1);
        }
      }
    });
  }
  
  else if (option.action === 'apply_grid_alignment') {
    const targets = entities.filter(e => e.type === option.target_type);
    
    // Snap to grid with spacing
    let gridRow = 0, gridCol = 0;
    targets.forEach((entity, i) => {
      entity.row = gridRow;
      entity.col = gridCol;
      updateEntityPosition(entity);
      
      gridCol += option.spacing;
      if (gridCol >= 9) {
        gridCol = 0;
        gridRow += option.spacing;
      }
    });
  }
  
  updateGridDisplay();
  logGroundAction(option);
}
```

---

## Integration with Existing System

### Add to railway junction flow:

```javascript
// After user sends message
const userText = userInput.value.trim();

// Detect mode from context or let user choose
const mode = detectMode(userText, sceneState);  // 'SHED', 'INTEGRATE', or 'GROUND'

if (mode === 'SHED') {
  const options = await shedComposer(userText, sceneState);
  // Show 2-3 buttons, user clicks one
}
else if (mode === 'INTEGRATE') {
  const options = await integrateComposer(userText, sceneState);
}
else if (mode === 'GROUND') {
  const options = await groundComposer(userText, sceneState);
}
```

### Mode Detection (Optional):

```javascript
function detectMode(userText, sceneState) {
  const lower = userText.toLowerCase();
  
  // SHED keywords
  if (/\b(remove|delete|clear|get rid of|discard|eliminate)\b/.test(lower)) {
    return 'SHED';
  }
  
  // INTEGRATE keywords
  if (/\b(connect|bring together|unify|merge|combine|group)\b/.test(lower)) {
    return 'INTEGRATE';
  }
  
  // GROUND keywords
  if (/\b(organize|structure|align|arrange|stabilize|formalize)\b/.test(lower)) {
    return 'GROUND';
  }
  
  // Default: offer all three
  return null;
}
```

---

## UI Flow Example

**User types:** "the dock is scattered bring it together"

**System:**
1. Detects `INTEGRATE` mode (keyword: "bring together")
2. Calls `integrateComposer()`
3. LLM analyzes scene, sees "Dock", "Pier", "Boat" at (1,2), (3,7), (6,4)
4. Returns 3 options:

**Option buttons appear:**

```
🔗 Group dock elements at center (4,4)
   └─ Brings Dock, Pier, Boat to adjacent cells

🔗 Create path from Dock to Boat
   └─ Visual connection showing route

🔗 Merge into "Harbor" entity
   └─ Replace 3 entities with single Harbor
```

**User clicks option 1**
- System moves Dock → (4,4), Pier → (4,5), Boat → (5,4)
- Grid updates
- Message: "✅ Integrated dock elements (ORDER/PARTS)"

---

## Why This Solves Your Pathologies

### Pathology: "Spatial relations are hardest part"
**GROUND mode directly addresses:**
- Scale normalization (relative sizes)
- Spatial arrangement (positions with meaning)
- Relationship formalization (proximity rules)
- Alignment (grid snapping)

### Pathology: "Random placement"
**All three modes add intention:**
- SHED removes with reasoning
- INTEGRATE connects with purpose
- GROUND stabilizes with structure

### Pathology: "Just writing chat"
**LLM inference layer:**
- Natural language → scene operations
- User doesn't type commands, just describes intent
- System offers options, user chooses

---

## Next: Implementation Order

1. **Start with SHED** (simplest - just removal)
2. **Add INTEGRATE** (grouping, paths)
3. **Build GROUND** (spatial ordering - most complex)

Want me to generate the complete code for one of these modes with full integration into your railway-junction system?
