// SHED-INTEGRATE-GROUND System Implementation
// For integration into railway junction scene composer

// ============================================================================
// CORE SYSTEM PROMPTS
// ============================================================================

const SHED_SYSTEM_PROMPT = `You are a SHED scene composer analyzing spatial scenes for removal operations.

## SHED Principle
Remove excess · discard non-essential

## Axes of Removal
- IDENTITY/INSTINCT: Eliminate emotional noise
- EXPERIENCE/SEEN: Reduce sensory clutter
- LANGUAGE/IDEAS: Sharpen meaning, remove unclear elements
- DOMAIN/RESOURCE: Discard depleted/unnecessary assets
- PURPOSE/HEART: Purify emotional drive, remove blockers
- ORDER/PARTS: Isolate redundant components

## Current Scene
{{SCENE_STATE}}

## User Intent
"{{USER_TEXT}}"

## Task
Infer 2-3 SHED operations that address the user's intent.

Return STRICT JSON:
{
  "interpretation": "what user wants removed",
  "shed_axis": "primary axis (e.g., DOMAIN/RESOURCE)",
  "spatial_analysis": "brief scene assessment",
  "options": [
    {
      "action": "remove_entities",
      "targets": ["entity label 1", "entity label 2"],
      "axis_detail": "DOMAIN/RESOURCE → Discard Unnecessary Assets",
      "reasoning": "why these should be removed",
      "preview": "scene after removal"
    },
    {
      "action": "remove_type",
      "target_type": "FIRE",
      "axis_detail": "EXPERIENCE/SEEN → Reduce Sensory Noise",
      "reasoning": "remove all of this type",
      "preview": "cleaner scene"
    }
  ]
}`;

const INTEGRATE_SYSTEM_PROMPT = `You are an INTEGRATE scene composer analyzing spatial scenes for connection operations.

## INTEGRATE Principle
Connect parts into patterns

## Axes of Integration
- IDENTITY/INSTINCT: Align instinct to goals
- EXPERIENCE/SEEN: Map visible to underlying structure
- LANGUAGE/IDEAS: Synthesize concepts into coherence
- DOMAIN/RESOURCE: Optimize resource to goal flow
- PURPOSE/HEART: Harmonize emotion and cognition
- ORDER/PARTS: Combine parts into functional whole

## Current Scene
{{SCENE_STATE}}

## Spatial Analysis
Isolated entities: {{ISOLATED}}
Existing clusters: {{CLUSTERS}}
Gaps in layout: {{GAPS}}

## User Intent
"{{USER_TEXT}}"

## Task
Infer 2-3 INTEGRATE operations that create meaningful connections.

Return STRICT JSON:
{
  "interpretation": "what user wants connected",
  "integrate_axis": "primary axis (e.g., ORDER/PARTS)",
  "spatial_insight": "current fragmentation",
  "options": [
    {
      "action": "group_spatial",
      "targets": ["entity 1", "entity 2"],
      "center": {"row": 4, "col": 4},
      "radius": 1,
      "axis_detail": "ORDER/PARTS → Combine Parts to Whole",
      "reasoning": "bring related items together",
      "preview": "items now adjacent"
    },
    {
      "action": "create_relationship",
      "entity1": "Source",
      "entity2": "Destination",
      "relationship_type": "path",
      "axis_detail": "DOMAIN/RESOURCE → Establish Flow",
      "reasoning": "show connection between source and use",
      "preview": "visual path connecting entities"
    }
  ]
}`;

const GROUND_SYSTEM_PROMPT = `You are a GROUND scene composer analyzing spatial scenes for stabilization operations.

## GROUND Principle
Stabilize patterns into durable order

## Critical Spatial Operations
1. SCALE NORMALIZATION: Set relative sizes based on semantic importance
2. SPATIAL ARRANGEMENT: Pattern-based positioning (grid, circle, line, hierarchy)
3. RELATIONSHIP FORMALIZATION: Proximity rules based on meaning
4. ALIGNMENT: Grid snapping, symmetry, centering
5. CLUSTERING/SPACING: Optimal density and distribution

## Current Scene
{{SCENE_STATE}}

## Detected Pathologies
Overlapping entities: {{OVERLAPS}}
Scale inconsistencies: {{SCALE_ISSUES}}
Misalignments: {{MISALIGNMENTS}}
Unclear relationships: {{RELATIONSHIP_ISSUES}}

## User Intent
"{{USER_TEXT}}"

## Task
Infer 2-3 GROUND operations that create stable spatial order addressing pathologies.

Return STRICT JSON:
{
  "interpretation": "what user wants stabilized",
  "ground_axis": "primary axis (e.g., ORDER/WHOLE)",
  "pathology_assessment": "key issues to address",
  "options": [
    {
      "action": "normalize_scale",
      "rules": [
        {"type": "BUILDING", "scale": 1.5},
        {"type": "HUMAN", "scale": 1.0},
        {"type": "ITEM", "scale": 0.5}
      ],
      "axis_detail": "ORDER/PARTS → Stabilize Components",
      "reasoning": "create visual hierarchy",
      "addresses": "scale inconsistency",
      "preview": "entities scaled appropriately"
    },
    {
      "action": "arrange_pattern",
      "pattern": "circle",
      "targets": ["Member 1", "Member 2", "Member 3"],
      "center": {"row": 4, "col": 4},
      "radius": 2,
      "axis_detail": "ORDER/WHOLE → Institutionalize Function",
      "reasoning": "circular formation shows equality",
      "addresses": "unclear relationship",
      "preview": "members in circle"
    }
  ]
}`;

// ============================================================================
// SPATIAL ANALYSIS UTILITIES
// ============================================================================

function analyzeScene(sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  return {
    entities: entities.map(e => ({
      label: e.label,
      type: e.type,
      position: `(${e.row},${e.col})`,
      scale: e.scale || 1.0
    })),
    totalCount: entities.length,
    typeDistribution: getTypeDistribution(entities),
    isolated: findIsolatedEntities(entities),
    clusters: findClusters(entities),
    gaps: findLargeGaps(sceneState),
    overlaps: findOverlaps(entities),
    scaleIssues: findScaleInconsistencies(entities),
    misalignments: findMisalignments(entities)
  };
}

function findIsolatedEntities(entities) {
  return entities.filter(e => {
    const neighbors = entities.filter(other => 
      other.id !== e.id &&
      Math.abs(other.row - e.row) <= 1 &&
      Math.abs(other.col - e.col) <= 1
    );
    return neighbors.length === 0;
  }).map(e => e.label);
}

function findClusters(entities) {
  const clusters = [];
  const visited = new Set();
  
  entities.forEach(entity => {
    if (visited.has(entity.id)) return;
    
    const cluster = [];
    const queue = [entity];
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current.id)) continue;
      
      visited.add(current.id);
      cluster.push(current.label);
      
      const neighbors = entities.filter(other =>
        !visited.has(other.id) &&
        Math.abs(other.row - current.row) <= 1 &&
        Math.abs(other.col - current.col) <= 1
      );
      
      queue.push(...neighbors);
    }
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });
  
  return clusters;
}

function findOverlaps(entities) {
  const overlaps = [];
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      if (entities[i].row === entities[j].row && 
          entities[i].col === entities[j].col) {
        overlaps.push(`${entities[i].label} and ${entities[j].label} at (${entities[i].row},${entities[i].col})`);
      }
    }
  }
  return overlaps;
}

function findScaleInconsistencies(entities) {
  const typeGroups = {};
  entities.forEach(e => {
    if (!typeGroups[e.type]) typeGroups[e.type] = [];
    typeGroups[e.type].push(e.scale || 1.0);
  });
  
  const issues = [];
  for (const [type, scales] of Object.entries(typeGroups)) {
    if (scales.length > 1) {
      const variance = scales.reduce((sum, s) => sum + Math.pow(s - 1.0, 2), 0) / scales.length;
      if (variance > 0.1) {
        issues.push(`${type} has inconsistent scales: ${scales.join(', ')}`);
      }
    }
  }
  return issues;
}

function findMisalignments(entities) {
  return entities.filter(e => {
    // Check if entity is on fractional coordinates
    return (e.row % 1 !== 0) || (e.col % 1 !== 0);
  }).map(e => `${e.label} at (${e.row},${e.col})`);
}

function findLargeGaps(sceneState) {
  // Find empty regions larger than 2x2
  const gaps = [];
  const occupied = new Set();
  
  Array.from(sceneState.gridEntities.values()).forEach(e => {
    occupied.add(`${e.row},${e.col}`);
  });
  
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 7; col++) {
      let isEmpty = true;
      for (let dr = 0; dr < 2; dr++) {
        for (let dc = 0; dc < 2; dc++) {
          if (occupied.has(`${row+dr},${col+dc}`)) {
            isEmpty = false;
            break;
          }
        }
        if (!isEmpty) break;
      }
      if (isEmpty) {
        gaps.push(`Empty 2x2 region starting at (${row},${col})`);
      }
    }
  }
  
  return gaps;
}

function getTypeDistribution(entities) {
  const dist = {};
  entities.forEach(e => {
    dist[e.type] = (dist[e.type] || 0) + 1;
  });
  return dist;
}

// ============================================================================
// LLM COMPOSER FUNCTIONS
// ============================================================================

async function shedComposer(userText, sceneState, apiBase, apiKey) {
  const analysis = analyzeScene(sceneState);
  
  const sceneDescription = `
Entities (${analysis.totalCount} total):
${analysis.entities.map(e => `- "${e.label}" at ${e.position} [${e.type}]`).join('\n')}

Type distribution: ${Object.entries(analysis.typeDistribution).map(([t,c]) => `${t}(${c})`).join(', ')}
Isolated: ${analysis.isolated.join(', ') || 'none'}
Clusters: ${analysis.clusters.map(c => `[${c.join(', ')}]`).join(', ') || 'none'}
  `.trim();
  
  const prompt = SHED_SYSTEM_PROMPT
    .replace('{{SCENE_STATE}}', sceneDescription)
    .replace('{{USER_TEXT}}', userText);
  
  const response = await fetch(apiBase + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt}],
      response_format: {type: 'json_object'},
      temperature: 0.7,
      max_tokens: 800
    })
  });
  
  if (!response.ok) {
    throw new Error(`SHED composer API error: ${response.status}`);
  }
  
  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}

async function integrateComposer(userText, sceneState, apiBase, apiKey) {
  const analysis = analyzeScene(sceneState);
  
  const sceneDescription = `
Entities (${analysis.totalCount} total):
${analysis.entities.map(e => `- "${e.label}" at ${e.position} [${e.type}]`).join('\n')}
  `.trim();
  
  const prompt = INTEGRATE_SYSTEM_PROMPT
    .replace('{{SCENE_STATE}}', sceneDescription)
    .replace('{{USER_TEXT}}', userText)
    .replace('{{ISOLATED}}', analysis.isolated.join(', ') || 'none')
    .replace('{{CLUSTERS}}', analysis.clusters.map(c => `[${c.join(', ')}]`).join(', ') || 'none')
    .replace('{{GAPS}}', analysis.gaps.slice(0, 3).join('; ') || 'none');
  
  const response = await fetch(apiBase + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt}],
      response_format: {type: 'json_object'},
      temperature: 0.7,
      max_tokens: 800
    })
  });
  
  if (!response.ok) {
    throw new Error(`INTEGRATE composer API error: ${response.status}`);
  }
  
  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}

async function groundComposer(userText, sceneState, apiBase, apiKey) {
  const analysis = analyzeScene(sceneState);
  
  const sceneDescription = `
Entities (${analysis.totalCount} total):
${analysis.entities.map(e => `- "${e.label}" at ${e.position} [${e.type}] scale:${e.scale}`).join('\n')}
  `.trim();
  
  const prompt = GROUND_SYSTEM_PROMPT
    .replace('{{SCENE_STATE}}', sceneDescription)
    .replace('{{USER_TEXT}}', userText)
    .replace('{{OVERLAPS}}', analysis.overlaps.join('; ') || 'none')
    .replace('{{SCALE_ISSUES}}', analysis.scaleIssues.join('; ') || 'none')
    .replace('{{MISALIGNMENTS}}', analysis.misalignments.join('; ') || 'none')
    .replace('{{RELATIONSHIP_ISSUES}}', analysis.isolated.length > 3 ? 'Many isolated entities' : 'Minimal');
  
  const response = await fetch(apiBase + '/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKey
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{role: 'system', content: prompt}],
      response_format: {type: 'json_object'},
      temperature: 0.6,  // Lower for more structured operations
      max_tokens: 1000
    })
  });
  
  if (!response.ok) {
    throw new Error(`GROUND composer API error: ${response.status}`);
  }
  
  const result = await response.json();
  return JSON.parse(result.choices[0].message.content);
}

// ============================================================================
// MODE DETECTION
// ============================================================================

function detectMode(userText) {
  const lower = userText.toLowerCase();
  
  // SHED keywords
  if (/\b(remove|delete|clear|get rid of|discard|eliminate|sold out|no more|kill|gone)\b/.test(lower)) {
    return 'SHED';
  }
  
  // INTEGRATE keywords
  if (/\b(connect|bring together|unify|merge|combine|group|scattered|integrate)\b/.test(lower)) {
    return 'INTEGRATE';
  }
  
  // GROUND keywords
  if (/\b(organize|structure|align|arrange|stabilize|formalize|make it|look like)\b/.test(lower)) {
    return 'GROUND';
  }
  
  // Default: let user choose
  return null;
}

// ============================================================================
// EXECUTION FUNCTIONS
// ============================================================================

function executeShed(option, sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  if (option.action === 'remove_entities') {
    option.targets.forEach(label => {
      const entity = entities.find(e => e.label === label);
      if (entity) {
        sceneState.gridEntities.delete(entity.id);
      }
    });
    return `Removed: ${option.targets.join(', ')}`;
  }
  
  else if (option.action === 'remove_type') {
    const removed = [];
    entities.forEach(e => {
      if (e.type === option.target_type) {
        sceneState.gridEntities.delete(e.id);
        removed.push(e.label);
      }
    });
    return `Removed all ${option.target_type}: ${removed.join(', ')}`;
  }
  
  return 'Shed operation complete';
}

function executeIntegrate(option, sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  if (option.action === 'group_spatial') {
    const targets = option.targets.map(label => 
      entities.find(e => e.label === label)
    ).filter(Boolean);
    
    const baseRow = option.center.row;
    const baseCol = option.center.col;
    const radius = option.radius || 1;
    
    targets.forEach((entity, i) => {
      const angle = (i / targets.length) * Math.PI * 2;
      entity.row = baseRow + Math.round(Math.cos(angle) * radius);
      entity.col = baseCol + Math.round(Math.sin(angle) * radius);
    });
    
    return `Grouped ${targets.length} entities at (${baseRow},${baseCol})`;
  }
  
  else if (option.action === 'create_relationship') {
    // Store relationship for visual rendering
    if (!sceneState.relationships) sceneState.relationships = [];
    sceneState.relationships.push({
      from: option.entity1,
      to: option.entity2,
      type: option.relationship_type
    });
    return `Created ${option.relationship_type} relationship: ${option.entity1} → ${option.entity2}`;
  }
  
  return 'Integrate operation complete';
}

function executeGround(option, sceneState) {
  const entities = Array.from(sceneState.gridEntities.values());
  
  if (option.action === 'normalize_scale') {
    option.rules.forEach(rule => {
      entities.forEach(e => {
        if (e.type === rule.type) {
          e.scale = rule.scale;
        }
      });
    });
    return `Normalized scales for ${option.rules.map(r => r.type).join(', ')}`;
  }
  
  else if (option.action === 'arrange_pattern') {
    const targets = option.targets.map(label =>
      entities.find(e => e.label === label)
    ).filter(Boolean);
    
    if (option.pattern === 'circle') {
      const angleStep = (Math.PI * 2) / targets.length;
      targets.forEach((entity, i) => {
        const angle = angleStep * i - Math.PI / 2;  // Start at top
        entity.row = option.center.row + Math.round(Math.sin(angle) * option.radius);
        entity.col = option.center.col + Math.round(Math.cos(angle) * option.radius);
      });
      return `Arranged ${targets.length} entities in circle`;
    }
    
    else if (option.pattern === 'grid') {
      const cols = Math.ceil(Math.sqrt(targets.length));
      targets.forEach((entity, i) => {
        entity.row = option.center.row + Math.floor(i / cols) * (option.spacing || 2);
        entity.col = option.center.col + (i % cols) * (option.spacing || 2);
      });
      return `Arranged ${targets.length} entities in grid`;
    }
  }
  
  else if (option.action === 'formalize_relationships') {
    option.rules.forEach(rule => {
      const entity1 = entities.find(e => e.label === rule.entity1);
      const entity2 = entities.find(e => e.label === rule.entity2);
      
      if (!entity1 || !entity2) return;
      
      if (rule.relation === 'near') {
        // Move entity1 adjacent to entity2
        const offsets = [[0,1], [1,0], [0,-1], [-1,0]];
        for (const [dr, dc] of offsets) {
          const newRow = entity2.row + dr;
          const newCol = entity2.col + dc;
          if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
            const occupied = entities.some(e => 
              e.id !== entity1.id && e.row === newRow && e.col === newCol
            );
            if (!occupied) {
              entity1.row = newRow;
              entity1.col = newCol;
              break;
            }
          }
        }
      }
    });
    return `Formalized ${option.rules.length} spatial relationships`;
  }
  
  return 'Ground operation complete';
}

// ============================================================================
// EXPORTS
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    shedComposer,
    integrateComposer,
    groundComposer,
    detectMode,
    executeShed,
    executeIntegrate,
    executeGround,
    analyzeScene
  };
}
