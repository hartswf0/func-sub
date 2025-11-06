// ============================================================================
// DSL-02: DUAL AGENT ASSEMBLY SYSTEM
// INNER (inside/details) ↔ OUTER (outside/context) + OBSERVER (overlap)
// ============================================================================

const AXES = {
  I: { name: 'Identity',   inner: 'Instinct', outer: 'Reason' },
  E: { name: 'Experience', inner: 'Seen',     outer: 'Unseen' },
  L: { name: 'Language',   inner: 'Ideas',    outer: 'Ideology' },
  D: { name: 'Domain',     inner: 'Source',   outer: 'Resource' },
  P: { name: 'Purpose',    inner: 'Heart',    outer: 'Head' },
  O: { name: 'Order',      inner: 'Parts',    outer: 'Whole' }
};

const OPERATORS = {
  SHED: {
    name: 'Shed',
    description: 'Remove excess, clear clutter, create space',
    canDo: ['REMOVE entity', 'MOVE entity away', 'ADD negative space'],
    color: '#ff5c7c'
  },
  INTEGRATE: {
    name: 'Integrate',
    description: 'Connect parts, create relationships, bridge gaps',
    canDo: ['ADD connection', 'MOVE entities together', 'REMOVE barrier'],
    color: '#56ff9f'
  },
  GROUND: {
    name: 'Ground',
    description: 'Organize structure, stabilize, create order',
    canDo: ['MOVE into pattern', 'ADD structure', 'REMOVE chaos'],
    color: '#ffb956'
  }
};

const state = {
  starterPrompt: null,
  isRunning: false,
  isAuto: false,
  turn: 0,
  currentAgent: 'INNER',
  
  entities: new Map(),
  nextId: 1,
  
  axisReadings: {
    I: { inner: 5, outer: 5 },
    E: { inner: 5, outer: 5 },
    L: { inner: 5, outer: 5 },
    D: { inner: 5, outer: 5 },
    P: { inner: 5, outer: 5 },
    O: { inner: 5, outer: 5 }
  },
  
  innerContext: {
    messages: [],
    userOverride: null
  },
  
  outerContext: {
    messages: [],
    userOverride: null
  },
  
  observerMemo: {
    buffer: [],
    maxSize: 50,
    head: 0
  }
};

const GRID_SIZE = 9;
const CELL_SIZE = 40;

// ============================================================================
// INIT
// ============================================================================

function init() {
  createGrid();
  renderAxes();
  wireEvents();
  addMemoEntry('System initialized. Enter starter prompt and click START.');
}

function createGrid() {
  const grid = document.getElementById('grid');
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.left = (c * CELL_SIZE) + 'px';
      cell.style.top = (r * CELL_SIZE) + 'px';
      cell.textContent = `${r},${c}`;
      grid.appendChild(cell);
    }
  }
}

function wireEvents() {
  // Corner buttons
  document.getElementById('cornerKey').addEventListener('click', () => toggleMenu('keyMenu'));
  document.getElementById('cornerHelp').addEventListener('click', () => toggleMenu('helpMenu'));
  document.getElementById('cornerLog').addEventListener('click', () => toggleMenu('logMenu'));
  
  // Close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.corner-btn') && !e.target.closest('.corner-menu')) {
      document.querySelectorAll('.corner-menu.visible').forEach(m => m.classList.remove('visible'));
    }
  });
  
  // Help menu actions
  document.querySelectorAll('#helpMenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'start') handleStart();
      else if (action === 'step') handleStep();
      else if (action === 'auto') handleAuto();
      else if (action === 'stop') handleStop();
    });
  });
  
  // Log menu actions
  document.querySelectorAll('#logMenu button').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'export-log') exportLog();
      else if (action === 'import-log') importLog();
      else if (action === 'clear-log') clearLog();
    });
  });
  
  // Key menu test
  document.querySelector('#keyMenu button[data-action="test-key"]').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    if (!apiKey) {
      alert('Enter API key first');
      return;
    }
    try {
      const response = await fetch(document.getElementById('apiBase').value + '/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      if (response.ok) {
        alert('✅ API key valid!');
      } else {
        alert('❌ API key invalid');
      }
    } catch (e) {
      alert('❌ Connection failed: ' + e.message);
    }
  });
  
  document.getElementById('innerSend').addEventListener('click', () => {
    const input = document.getElementById('innerInput');
    state.innerContext.userOverride = input.value.trim();
    input.value = '';
    addInnerMsg('user', `Override: ${state.innerContext.userOverride}`);
  });
  
  document.getElementById('outerSend').addEventListener('click', () => {
    const input = document.getElementById('outerInput');
    state.outerContext.userOverride = input.value.trim();
    input.value = '';
    addOuterMsg('user', `Override: ${state.outerContext.userOverride}`);
  });
  
  document.getElementById('innerInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('innerSend').click();
  });
  
  document.getElementById('outerInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('outerSend').click();
  });
  
  document.getElementById('observerSend').addEventListener('click', () => {
    const input = document.getElementById('observerInput');
    const text = input.value.trim();
    if (text) {
      addMemoEntry(`💬 User: ${text}`);
      input.value = '';
      // Could trigger observer response here
    }
  });
  
  document.getElementById('observerInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('observerSend').click();
  });
}

// ============================================================================
// MENU UTILITIES
// ============================================================================

function toggleMenu(menuId) {
  const menu = document.getElementById(menuId);
  if (!menu) return;
  
  const alreadyVisible = menu.classList.contains('visible');
  document.querySelectorAll('.corner-menu.visible').forEach(m => m.classList.remove('visible'));
  
  if (!alreadyVisible) {
    menu.classList.add('visible');
  }
}

// ============================================================================
// CONTROL FLOW
// ============================================================================

async function handleStart() {
  console.log('[START] Initializing...');
  
  const prompt = document.getElementById('starterPrompt').value.trim();
  if (!prompt) {
    alert('Enter starter prompt in ? menu first');
    return;
  }
  
  const apiKey = document.getElementById('apiKey').value.trim();
  if (!apiKey) {
    alert('Enter API key in ◎ menu first');
    return;
  }
  
  state.starterPrompt = prompt;
  state.isRunning = true;
  state.turn = 0;
  state.currentAgent = 'INNER';
  
  document.querySelector('#helpMenu button[data-action="start"]').disabled = true;
  document.getElementById('stepBtn').disabled = false;
  document.getElementById('autoBtn').disabled = false;
  document.getElementById('innerSend').disabled = false;
  document.getElementById('outerSend').disabled = false;
  document.getElementById('observerSend').disabled = false;
  
  addMemoEntry(`🎯 Started: "${prompt}"`);
  addInnerMsg('system', `Starter prompt: ${prompt}`);
  addOuterMsg('system', `Starter prompt: ${prompt}`);
  
  // Execute first step immediately
  console.log('[START] Executing first turn...');
  await executeTurn();
}

async function handleStep() {
  if (!state.isRunning) return;
  
  document.getElementById('stepBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
  
  await executeTurn();
  
  document.getElementById('stepBtn').disabled = false;
}

async function handleAuto() {
  state.isAuto = true;
  document.getElementById('autoBtn').disabled = true;
  document.getElementById('stepBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
  
  while (state.isAuto && state.isRunning) {
    await executeTurn();
    await sleep(2000); // 2 second pause between turns
  }
}

function handleStop() {
  state.isAuto = false;
  document.getElementById('autoBtn').disabled = false;
  document.getElementById('stepBtn').disabled = false;
  document.getElementById('stopBtn').disabled = true;
  addMemoEntry('⏸ Paused');
}

// ============================================================================
// COMPOSITIONAL ANALYSIS
// ============================================================================

function analyzeComposition() {
  const entities = Array.from(state.entities.values());
  const density = entities.length / 81;
  
  // Find clusters
  const clusters = findClusters(entities);
  
  // Find repetitions
  const typeCounts = {};
  entities.forEach(e => {
    typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
  });
  const repetitions = Object.entries(typeCounts)
    .filter(([type, count]) => count > 2)
    .map(([type, count]) => ({ type, count }));
  
  // Find isolated
  const isolated = findIsolated(entities);
  
  // Find negative space
  const occupiedCells = new Set(entities.map(e => `${e.row},${e.col}`));
  const voids = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!occupiedCells.has(`${r},${c}`)) {
        voids.push([r, c]);
      }
    }
  }
  
  return {
    density,
    clusters,
    repetitions,
    isolated,
    voids,
    entityCount: entities.length
  };
}

function findClusters(entities) {
  const clusters = [];
  const visited = new Set();
  
  entities.forEach(entity => {
    if (visited.has(entity.id)) return;
    
    const cluster = [entity];
    visited.add(entity.id);
    
    // Find neighbors within distance 2
    entities.forEach(other => {
      if (visited.has(other.id)) return;
      const dist = Math.abs(entity.row - other.row) + Math.abs(entity.col - other.col);
      if (dist <= 2) {
        cluster.push(other);
        visited.add(other.id);
      }
    });
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });
  
  return clusters;
}

// ============================================================================
// THREE-OPTIONS GENERATION
// ============================================================================

function generateThreeOptions(composition, axes) {
  const shed = generateShedOption(composition);
  const integrate = generateIntegrateOption(composition);
  const ground = generateGroundOption(composition);
  
  // Display in UI
  document.getElementById('shedTitle').textContent = shed.title;
  document.getElementById('shedImpact').textContent = shed.impact;
  document.getElementById('integrateTitle').textContent = integrate.title;
  document.getElementById('integrateImpact').textContent = integrate.impact;
  document.getElementById('groundTitle').textContent = ground.title;
  document.getElementById('groundImpact').textContent = ground.impact;
  
  console.log('[OBSERVER] Three options generated:', { shed, integrate, ground });
  
  return { shed, integrate, ground };
}

function generateShedOption(comp) {
  if (comp.density > 0.5) {
    return {
      title: "Clear Dense Region",
      impact: `Remove ${Math.floor(comp.entityCount * 0.2)} entities to reduce density`,
      action: { type: 'REMOVE', count: Math.floor(comp.entityCount * 0.2) }
    };
  }
  
  if (comp.clusters.length > 0) {
    const largest = comp.clusters.sort((a,b) => b.length - a.length)[0];
    return {
      title: `Clear ${largest[0].type} Cluster`,
      impact: `Remove ${largest.length} clustered entities to open space`,
      action: { type: 'REMOVE', targets: largest.map(e => e.id) }
    };
  }
  
  return {
    title: "Remove Oldest Entity",
    impact: "Clear space by removing earliest addition",
    action: { type: 'REMOVE', targets: [Array.from(state.entities.keys())[0]] }
  };
}

function generateIntegrateOption(comp) {
  if (comp.repetitions.length > 0) {
    const mostRepeated = comp.repetitions[0];
    return {
      title: `Unify ${mostRepeated.count} ${mostRepeated.type} Entities`,
      impact: `Replace ${mostRepeated.count} items with single unified structure`,
      action: { type: 'REPLACE_SET', entityType: mostRepeated.type, count: mostRepeated.count }
    };
  }
  
  if (comp.isolated.length > 2) {
    return {
      title: `Connect ${comp.isolated.length} Isolated Entities`,
      impact: `Add connections to bridge gaps`,
      action: { type: 'ADD_CONNECTIONS', targets: comp.isolated.map(e => e.id) }
    };
  }
  
  return {
    title: "Add Connecting Structure",
    impact: "Create new connection between existing elements",
    action: { type: 'ADD', entityType: 'CONNECTOR' }
  };
}

function generateGroundOption(comp) {
  const entities = Array.from(state.entities.values());
  
  if (comp.entityCount > 0 && comp.density < 0.3) {
    const centerMost = entities.reduce((closest, e) => {
      const dist = Math.abs(e.row - 4) + Math.abs(e.col - 4);
      const closestDist = Math.abs(closest.row - 4) + Math.abs(closest.col - 4);
      return dist < closestDist ? e : closest;
    });
    
    return {
      title: `Anchor ${centerMost.label} as Center`,
      impact: `Lock entity at (${centerMost.row},${centerMost.col}) as compositional anchor`,
      action: { type: 'LOCK', target: centerMost.id, position: [centerMost.row, centerMost.col] }
    };
  }
  
  if (comp.clusters.length > 0) {
    return {
      title: "Organize Cluster into Grid",
      impact: `Arrange ${comp.clusters[0].length} entities in compositional pattern`,
      action: { type: 'ARRANGE', targets: comp.clusters[0].map(e => e.id) }
    };
  }
  
  return {
    title: "Establish Compositional Balance",
    impact: "Distribute existing entities with better proportion",
    action: { type: 'BALANCE', mode: 'distribute' }
  };
}

// ============================================================================
// TURN EXECUTION
// ============================================================================

async function executeTurn() {
  state.turn++;
  
  // 1. Observer: Analyze composition
  console.log('[OBSERVER] Analyzing composition...');
  const composition = analyzeComposition();
  console.log('[OBSERVER] Composition:', composition);
  
  // 2. Observer: Generate three options
  const threeOptions = generateThreeOptions(composition, state.axisReadings);
  
  // 3. Execute agent turns (will choose from options later)
  if (state.currentAgent === 'INNER') {
    await executeInnerTurn();
    state.currentAgent = 'OUTER';
  } else {
    await executeOuterTurn();
    state.currentAgent = 'INNER';
  }
  
  updateAxes();
  document.getElementById('axisTime').textContent = state.turn;
}

async function executeInnerTurn() {
  const turnNum = Math.floor((state.turn + 1) / 2);
  document.getElementById('innerTurn').textContent = `T: ${turnNum}`;
  
  console.log(`[INNER] Starting turn ${turnNum}`);
  
  try {
    const decision = await callInnerAgent();
    console.log('[INNER] Decision:', decision);
    
    if (decision) {
      executeAction(decision, 'INNER');
      addInnerMsg('inner', formatDecision(decision));
      logToMemo('INNER', decision);
      state.innerContext.userOverride = null; // Clear after use
    }
  } catch (error) {
    console.error('[INNER] Error:', error);
    addInnerMsg('system', `❌ Error: ${error.message}`);
  }
}

async function executeOuterTurn() {
  const turnNum = Math.floor(state.turn / 2);
  document.getElementById('outerTurn').textContent = `T: ${turnNum}`;
  
  console.log(`[OUTER] Starting turn ${turnNum}`);
  
  try {
    const decision = await callOuterAgent();
    console.log('[OUTER] Decision:', decision);
    
    if (decision) {
      executeAction(decision, 'OUTER');
      addOuterMsg('outer', formatDecision(decision));
      logToMemo('OUTER', decision);
      state.outerContext.userOverride = null; // Clear after use
    }
  } catch (error) {
    console.error('[OUTER] Error:', error);
    addOuterMsg('system', `❌ Error: ${error.message}`);
  }
}

// ============================================================================
// AGENT LLM CALLS
// ============================================================================

async function callInnerAgent() {
  const prompt = buildInnerPrompt();
  const response = await callLLM(prompt);
  return parseDecision(response);
}

async function callOuterAgent() {
  const prompt = buildOuterPrompt();
  const response = await callLLM(prompt);
  return parseDecision(response);
}

function buildInnerPrompt() {
  const override = state.innerContext.userOverride;
  const sceneDesc = describeScene();
  const memoRecent = getRecentMemo(3);
  const axes = formatAxes();
  
  return `You are INNER agent. You build INSIDE and INTO details.

## Current Scene:
${sceneDesc}

## Axis Readings:
${axes}

## Recent Memo:
${memoRecent}

## Your Focus (CRITICAL):
INNER = NEGATIVE SPACE + DETAIL ORGANIZATION + REMOVAL

Priority order:
1. SHED: Remove clutter, clear excess detail
2. GROUND: Organize interior arrangements, move detail into patterns
3. INTEGRATE: Only add detail when space is prepared

You work on INTERIOR layers and DETAILS:
- House interior → Clear clutter FIRST, then organize furniture
- Market interior → Remove excess FIRST, then arrange goods
- Any structure → Focus on negative space, not filling every cell

## Operators (choose ONE per turn):

**SHED** (Remove excess, clear clutter, create space)
- Can: REMOVE entity, MOVE entity away, ADD negative space
- Use when: Too crowded, blocked, cluttered

**INTEGRATE** (Connect parts, create relationships, bridge gaps)
- Can: ADD connection, MOVE entities together, REMOVE barrier
- Use when: Isolated, disconnected, fragmented

**GROUND** (Organize structure, stabilize, create order)
- Can: MOVE into pattern, ADD structure, REMOVE chaos
- Use when: Disorganized, unstable, chaotic

## Starter Intent:
"${state.starterPrompt}"

${override ? `## USER OVERRIDE (HIGH PRIORITY): 
${override}` : ''}

## Response Format:
Return ONLY valid JSON:
{
  "operator": "INTEGRATE",
  "actionType": "ADD",
  "entity": {
    "type": "FURNITURE",
    "icon": "🪑",
    "label": "Chair",
    "position": [4, 4]
  },
  "reasoning": "INTEGRATE: Adding interior furniture to house"
}

Or for REMOVE:
{
  "operator": "SHED",
  "actionType": "REMOVE",
  "targetId": "e3",
  "reasoning": "SHED: Removing excess clutter"
}

Or for MOVE:
{
  "operator": "GROUND",
  "actionType": "MOVE",
  "targetId": "e5",
  "newPosition": [5, 5],
  "reasoning": "GROUND: Organizing layout"
}`;
}

function buildOuterPrompt() {
  const override = state.outerContext.userOverride;
  const sceneDesc = describeScene();
  const memoRecent = getRecentMemo(3);
  const axes = formatAxes();
  
  return `You are OUTER agent. You build OUTSIDE and AROUND context.

## Current Scene:
${sceneDesc}

## Axis Readings:
${axes}

## Recent Memo:
${memoRecent}

## Your Focus:
Look for structures that need EXTERNAL development.
- House → Add garden, fence, road connection
- Cluster → Add infrastructure, boundaries
- Isolated elements → Add connections

## Operators (choose ONE per turn):

**SHED** (Remove excess, clear clutter, create space)
- Can: REMOVE entity, MOVE entity away, ADD negative space
- Use when: Too crowded, blocked, cluttered

**INTEGRATE** (Connect parts, create relationships, bridge gaps)
- Can: ADD connection, MOVE entities together, REMOVE barrier
- Use when: Isolated, disconnected, fragmented

**GROUND** (Organize structure, stabilize, create order)
- Can: MOVE into pattern, ADD structure, REMOVE chaos
- Use when: Disorganized, unstable, chaotic

## Starter Intent:
"${state.starterPrompt}"

${override ? `## USER OVERRIDE (HIGH PRIORITY):
${override}` : ''}

## Response Format:
Return ONLY valid JSON:
{
  "operator": "GROUND",
  "actionType": "ADD",
  "entity": {
    "type": "ROAD",
    "icon": "🛤️",
    "label": "Path",
    "position": [4, 3]
  },
  "reasoning": "GROUND: Organizing access to house"
}`;
}

async function callLLM(prompt) {
  const apiBase = document.getElementById('apiBase').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a spatial scene assembly agent. Return valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

function parseDecision(response) {
  // Try to extract JSON from response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }
  
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('Invalid JSON: ' + e.message);
  }
}

// ============================================================================
// ACTION EXECUTION
// ============================================================================

function executeAction(decision, agent) {
  switch (decision.actionType) {
    case 'ADD':
      const entity = decision.entity;
      addEntity(
        entity.type,
        entity.icon,
        entity.label,
        entity.position[0],
        entity.position[1]
      );
      break;
      
    case 'REMOVE':
      removeEntity(decision.targetId);
      break;
      
    case 'MOVE':
      moveEntity(decision.targetId, decision.newPosition);
      break;
  }
}

function addEntity(type, icon, label, row, col) {
  const id = `e${state.nextId++}`;
  const entity = { id, type, icon, label, row, col };
  state.entities.set(id, entity);
  renderEntity(entity);
  return entity;
}

function removeEntity(id) {
  document.getElementById(id)?.remove();
  state.entities.delete(id);
}

function moveEntity(id, newPos) {
  const entity = state.entities.get(id);
  if (entity) {
    entity.row = newPos[0];
    entity.col = newPos[1];
    renderEntity(entity);
  }
}

function renderEntity(e) {
  const grid = document.getElementById('grid');
  let el = document.getElementById(e.id);
  
  if (!el) {
    el = document.createElement('div');
    el.id = e.id;
    el.className = 'entity';
    el.innerHTML = `${e.icon}<div class="entity-label">${e.label}</div>`;
    el.addEventListener('click', () => {
      addMemoEntry(`Clicked: ${e.label} at (${e.row},${e.col})`);
    });
    grid.appendChild(el);
  }
  
  el.style.left = (e.col * CELL_SIZE + 2) + 'px';
  el.style.top = (e.row * CELL_SIZE + 2) + 'px';
}

// ============================================================================
// SCENE DESCRIPTION
// ============================================================================

function describeScene() {
  const entities = Array.from(state.entities.values());
  
  if (entities.length === 0) {
    return 'Empty grid (9×9). No entities yet.';
  }
  
  const desc = entities.map(e => 
    `${e.icon} ${e.label} [${e.type}] at (${e.row},${e.col})`
  ).join('\n');
  
  return `Entities (${entities.length}):\n${desc}`;
}

function formatAxes() {
  return Object.entries(AXES).map(([key, axis]) => {
    const r = state.axisReadings[key];
    return `${key} (${axis.name}): ${axis.inner}=${r.inner}, ${axis.outer}=${r.outer}`;
  }).join('\n');
}

function formatDecision(decision) {
  const operator = decision.operator;
  const action = decision.actionType;
  const reasoning = decision.reasoning;
  
  let details = '';
  if (action === 'ADD') {
    details = `${decision.entity.icon} ${decision.entity.label} at (${decision.entity.position[0]},${decision.entity.position[1]})`;
  } else if (action === 'REMOVE') {
    details = `Removed ${decision.targetId}`;
  } else if (action === 'MOVE') {
    details = `Moved ${decision.targetId} to (${decision.newPosition[0]},${decision.newPosition[1]})`;
  }
  
  return `<span class="msg-operator ${operator.toLowerCase()}">${operator}</span> ${action}: ${details}\n${reasoning}`;
}

// ============================================================================
// AXES
// ============================================================================

function renderAxes() {
  const container = document.getElementById('axisReadings');
  container.innerHTML = '';
  
  for (const [key, axis] of Object.entries(AXES)) {
    const reading = state.axisReadings[key];
    
    const row = document.createElement('div');
    row.className = 'axis-row';
    
    row.innerHTML = `
      <div class="axis-name">${key}</div>
      <div class="axis-bars">
        <div class="axis-label">${axis.inner}</div>
        <div class="axis-bar">
          <div class="axis-fill" style="width: ${reading.inner * 11.11}%"></div>
        </div>
        <div class="axis-score">${reading.inner}</div>
        <div class="axis-label">${axis.outer}</div>
        <div class="axis-bar">
          <div class="axis-fill" style="width: ${reading.outer * 11.11}%"></div>
        </div>
        <div class="axis-score">${reading.outer}</div>
      </div>
    `;
    
    container.appendChild(row);
  }
}

function updateAxes() {
  const entities = Array.from(state.entities.values());
  const totalCount = entities.length;
  
  // IDENTITY: overlap = low instinct, high reason need
  const overlaps = findOverlaps(entities);
  if (overlaps.length > 2) {
    state.axisReadings.I = { inner: 2, outer: 7 };
  } else {
    state.axisReadings.I = { inner: 6, outer: 4 };
  }
  
  // EXPERIENCE: sparse = unseen potential
  const density = totalCount / (GRID_SIZE * GRID_SIZE);
  if (density < 0.15) {
    state.axisReadings.E = { inner: 3, outer: 7 };
  } else {
    state.axisReadings.E = { inner: 7, outer: 4 };
  }
  
  // LANGUAGE: type diversity = ideas not systematized
  const types = new Set(entities.map(e => e.type));
  if (types.size > 5) {
    state.axisReadings.L = { inner: 7, outer: 3 };
  } else {
    state.axisReadings.L = { inner: 5, outer: 5 };
  }
  
  // DOMAIN: isolated = flow blocked
  const isolated = findIsolated(entities);
  if (isolated.length > 3) {
    state.axisReadings.D = { inner: 6, outer: 2 };
  } else {
    state.axisReadings.D = { inner: 5, outer: 6 };
  }
  
  // PURPOSE: low density = unclear purpose
  if (density < 0.2) {
    state.axisReadings.P = { inner: 3, outer: 4 };
  } else {
    state.axisReadings.P = { inner: 7, outer: 6 };
  }
  
  // ORDER: misalignments = parts not forming whole
  if (overlaps.length > 0 || isolated.length > 2) {
    state.axisReadings.O = { inner: 7, outer: 2 };
  } else {
    state.axisReadings.O = { inner: 5, outer: 7 };
  }
  
  renderAxes();
}

function findOverlaps(entities) {
  const overlaps = [];
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      if (entities[i].row === entities[j].row && 
          entities[i].col === entities[j].col) {
        overlaps.push([entities[i], entities[j]]);
      }
    }
  }
  return overlaps;
}

function findIsolated(entities) {
  return entities.filter(e => {
    const neighbors = entities.filter(other => 
      other.id !== e.id &&
      Math.abs(other.row - e.row) <= 1 &&
      Math.abs(other.col - e.col) <= 1
    );
    return neighbors.length === 0;
  });
}

// ============================================================================
// MESSAGES
// ============================================================================

function addInnerMsg(role, html) {
  const log = document.getElementById('innerMessages');
  const msg = document.createElement('div');
  msg.className = `msg inner`;
  msg.innerHTML = html;
  log.appendChild(msg);
  
  requestAnimationFrame(() => {
    log.scrollTop = log.scrollHeight;
  });
}

function addOuterMsg(role, html) {
  const log = document.getElementById('outerMessages');
  const msg = document.createElement('div');
  msg.className = `msg outer`;
  msg.innerHTML = html;
  log.appendChild(msg);
  
  requestAnimationFrame(() => {
    log.scrollTop = log.scrollHeight;
  });
}

// ============================================================================
// OBSERVER MEMO
// ============================================================================

function addMemoEntry(text) {
  const entry = {
    turn: state.turn,
    text: text,
    timestamp: Date.now()
  };
  
  // Ring buffer logic
  if (state.observerMemo.buffer.length >= state.observerMemo.maxSize) {
    state.observerMemo.buffer[state.observerMemo.head] = entry;
    state.observerMemo.head = (state.observerMemo.head + 1) % state.observerMemo.maxSize;
  } else {
    state.observerMemo.buffer.push(entry);
  }
  
  renderMemo();
}

function logToMemo(agent, decision) {
  const text = `T${state.turn} ${agent}: ${decision.operator} → ${decision.actionType}\n${decision.reasoning}`;
  addMemoEntry(text);
}

function renderMemo() {
  const container = document.getElementById('memoContent');
  container.innerHTML = '';
  
  // Show buffer in order (most recent last)
  const ordered = [...state.observerMemo.buffer].slice().reverse();
  
  ordered.forEach(entry => {
    const div = document.createElement('div');
    div.className = 'memo-entry';
    div.innerHTML = `
      <div class="memo-turn">Turn ${entry.turn}</div>
      <div>${entry.text}</div>
      <div class="memo-agent">${new Date(entry.timestamp).toLocaleTimeString()}</div>
    `;
    container.insertBefore(div, container.firstChild);
  });
  
  requestAnimationFrame(() => {
    container.scrollTop = container.scrollHeight;
  });
}

function getRecentMemo(count) {
  const recent = state.observerMemo.buffer.slice(-count);
  return recent.map(e => `T${e.turn}: ${e.text}`).join('\n\n') || 'No recent memo';
}

// ============================================================================
// UTILS
// ============================================================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// LOG MANAGEMENT
// ============================================================================

function exportLog() {
  const log = {
    timestamp: Date.now(),
    starterPrompt: state.starterPrompt,
    turn: state.turn,
    entities: Array.from(state.entities.values()),
    axisReadings: state.axisReadings,
    memo: state.observerMemo.buffer,
    innerMessages: state.innerContext.messages,
    outerMessages: state.outerContext.messages
  };
  
  const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dsl-02-log-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('[EXPORT] Log exported');
  addMemoEntry('📤 Exported log');
}

function importLog() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const log = JSON.parse(text);
      
      // Restore state
      state.starterPrompt = log.starterPrompt;
      state.turn = log.turn;
      state.entities = new Map(log.entities.map(e => [e.id, e]));
      state.axisReadings = log.axisReadings;
      state.observerMemo.buffer = log.memo || [];
      state.innerContext.messages = log.innerMessages || [];
      state.outerContext.messages = log.outerMessages || [];
      
      // Re-render everything
      state.entities.forEach(e => renderEntity(e));
      renderAxes();
      renderMemo();
      
      // Restore chats
      state.innerContext.messages.forEach(m => addInnerMsg(m.role, m.text));
      state.outerContext.messages.forEach(m => addOuterMsg(m.role, m.text));
      
      console.log('[IMPORT] Log imported');
      addMemoEntry('📥 Imported log');
    } catch (error) {
      console.error('[IMPORT] Error:', error);
      alert('Failed to import log: ' + error.message);
    }
  };
  
  input.click();
}

function clearLog() {
  if (!confirm('Clear all logs and reset?')) return;
  
  state.observerMemo.buffer = [];
  state.innerContext.messages = [];
  state.outerContext.messages = [];
  
  document.getElementById('memoContent').innerHTML = '';
  document.getElementById('innerMessages').innerHTML = '';
  document.getElementById('outerMessages').innerHTML = '';
  
  console.log('[CLEAR] Logs cleared');
  addMemoEntry('🗑 Logs cleared');
}

// ============================================================================
// START
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
