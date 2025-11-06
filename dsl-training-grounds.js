// ============================================================================
// DSL-01 TRAINING GROUNDS
// 6-Axis Scene Composition with SHED-INTEGRATE-GROUND
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
  S: { name: 'Shed', action: 'remove', color: '#ff5c7c' },
  I: { name: 'Integrate', action: 'connect', color: '#56ff9f' },
  G: { name: 'Ground', action: 'stabilize', color: '#ffb956' },
  F: { name: 'Free', action: 'assemble', color: '#9966ff' },
  R: { name: 'Router', action: 'route', color: '#56a9ff' }
};

const state = {
  entities: new Map(),
  messages: [],
  currentMode: null,
  nextId: 1,
  axisReadings: {
    I: { inner: 5, outer: 5 },
    E: { inner: 5, outer: 5 },
    L: { inner: 5, outer: 5 },
    D: { inner: 5, outer: 5 },
    P: { inner: 5, outer: 5 },
    O: { inner: 5, outer: 5 }
  }
};

const GRID_SIZE = 9;
const CELL_SIZE = 60;

// ============================================================================
// INIT
// ============================================================================

function init() {
  createGrid();
  renderAxisReadings();
  wireUpEvents();
  addMsg('system', '🎯 DSL-01 initialized. Add entities or select a SIG mode.');
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
      cell.dataset.row = r;
      cell.dataset.col = c;
      grid.appendChild(cell);
    }
  }
}

function wireUpEvents() {
  document.querySelectorAll('.sig-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleMode(btn.dataset.mode));
  });

  document.getElementById('sendBtn').addEventListener('click', handleSend);
  document.getElementById('userInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSend();
  });

  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = Math.floor(Math.random() * GRID_SIZE);
      const c = Math.floor(Math.random() * GRID_SIZE);
      addEntity(btn.dataset.type, btn.dataset.icon, btn.textContent, r, c);
      addMsg('system', `Added ${btn.dataset.icon} ${btn.textContent} at (${r},${c})`);
      updateReadings();
    });
  });

  // Export button
  document.getElementById('exportBtn').addEventListener('click', exportChat);

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', resetChat);
}

// ============================================================================
// ENTITIES
// ============================================================================

function addEntity(type, icon, label, row, col, scale = 1.0) {
  const id = `e${state.nextId++}`;
  const entity = { id, type, icon, label, row, col, scale };
  state.entities.set(id, entity);
  renderEntity(entity);
  return entity;
}

function renderEntity(e) {
  const grid = document.getElementById('grid');
  let el = document.getElementById(e.id);
  if (!el) {
    el = document.createElement('div');
    el.id = e.id;
    el.className = 'entity';
    el.innerHTML = `<span style="font-size:14px">${e.icon}</span><span>${e.label}</span>`;
    el.addEventListener('click', () => {
      addMsg('system', `Clicked: ${e.label} [${e.type}] at (${e.row},${e.col})`);
    });
    grid.appendChild(el);
  }
  el.style.left = (e.col * CELL_SIZE + 5) + 'px';
  el.style.top = (e.row * CELL_SIZE + 5) + 'px';
  el.style.transform = `scale(${e.scale})`;
}

function removeEntity(id) {
  document.getElementById(id)?.remove();
  state.entities.delete(id);
}

// ============================================================================
// AXIS READINGS
// ============================================================================

function renderAxisReadings() {
  const container = document.getElementById('axisReadings');
  container.innerHTML = '';
  
  for (const [key, axis] of Object.entries(AXES)) {
    const reading = state.axisReadings[key];
    
    const row = document.createElement('div');
    row.className = 'axis-row';
    
    row.innerHTML = `
      <div class="axis-label">${key}</div>
      <div class="axis-bars">
        <div class="bar-container">
          <div class="bar-label">${axis.inner}</div>
          <div class="bar" style="width: ${reading.inner * 11.11}%"></div>
        </div>
        <div class="score">${reading.inner}</div>
        <div class="bar-container">
          <div class="bar-label">${axis.outer}</div>
          <div class="bar" style="width: ${reading.outer * 11.11}%"></div>
        </div>
        <div class="score">${reading.outer}</div>
      </div>
    `;
    
    container.appendChild(row);
  }
}

function updateReadings() {
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
  
  // Recommend operator
  const imbalances = Object.entries(state.axisReadings)
    .map(([axis, r]) => ({ axis, imbalance: Math.abs(r.inner - r.outer) }))
    .sort((a, b) => b.imbalance - a.imbalance);
  
  let recommendation = null;
  if (totalCount > 12) {
    recommendation = 'S (SHED): High entity count suggests removal needed';
  } else if (imbalances[0]?.imbalance > 3) {
    const axis = imbalances[0].axis;
    if (axis === 'D' || axis === 'O') {
      recommendation = 'I (INTEGRATE): Fragmentation detected';
    } else {
      recommendation = 'G (GROUND): Structural instability';
    }
  }
  
  renderAxisReadings();
  
  const signalEl = document.getElementById('operatorSignal');
  if (recommendation) {
    signalEl.textContent = `💡 ${recommendation}`;
    signalEl.style.display = 'block';
  } else {
    signalEl.style.display = 'none';
  }
}

function findOverlaps(entities) {
  const overlaps = [];
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      if (entities[i].row === entities[j].row && 
          entities[i].col === entities[j].col) {
        overlaps.push([entities[i].label, entities[j].label]);
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
// SIG MODES
// ============================================================================

function toggleMode(mode) {
  if (state.currentMode === mode) {
    state.currentMode = null;
    document.querySelectorAll('.sig-btn').forEach(b => {
      b.classList.remove('active', 'shed-active', 'integrate-active', 'ground-active', 'free-active', 'router-active');
    });
    addMsg('system', `${OPERATORS[mode].name} mode deactivated`);
  } else {
    state.currentMode = mode;
    document.querySelectorAll('.sig-btn').forEach(b => {
      b.classList.remove('active', 'shed-active', 'integrate-active', 'ground-active', 'free-active', 'router-active');
    });
    const btn = document.querySelector(`[data-mode="${mode}"]`);
    btn.classList.add('active', `${OPERATORS[mode].name.toLowerCase()}-active`);
    
    const modeDescriptions = {
      S: 'Describe what to remove from the scene',
      I: 'Describe what to connect or group together',
      G: 'Describe how to stabilize and organize',
      F: 'Freely describe scene to assemble',
      R: 'Describe intent - router will choose best agent'
    };
    
    addMsg('system', `🎯 ${OPERATORS[mode].name} mode activated. ${modeDescriptions[mode]}.`);
  }
}

async function handleSend() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  
  input.value = '';
  addMsg('user', text);
  
  if (!state.currentMode) {
    addMsg('system', 'Please select a SIG mode (SHED/INTEGRATE/GROUND) first.');
    return;
  }
  
  await handleSIGMode(text, state.currentMode);
}

async function handleSIGMode(userText, mode) {
  const apiBase = document.getElementById('apiBase').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  
  if (!apiKey) {
    addMsg('system', '❌ Please set API key in top bar');
    return;
  }
  
  addMsg('system', `🔮 Analyzing scene for ${OPERATORS[mode].name}...`);
  
  try {
    const sceneData = buildSceneData();
    const prompt = buildPrompt(userText, sceneData, mode);
    
    const response = await callOpenAI(apiBase, apiKey, prompt);
    
    addMsg('assistant', response);
    
    // Try to parse as JSON for structured display
    try {
      const parsed = JSON.parse(response);
      if (parsed.interpretation) {
        addMsg('system', `💡 ${parsed.interpretation}`);
      }
      if (parsed.axis_detail) {
        addMsg('system', `📊 Axis: ${parsed.axis_detail}`);
      }
    } catch (e) {
      // Not JSON, already displayed as text
    }
    
    updateReadings();
    
  } catch (error) {
    addMsg('system', `❌ Error: ${error.message}`);
  }
}

function buildSceneData() {
  const entities = Array.from(state.entities.values());
  return {
    entities: entities.map(e => ({
      label: e.label,
      type: e.type,
      position: `(${e.row},${e.col})`,
      scale: e.scale
    })),
    totalCount: entities.length,
    overlaps: findOverlaps(entities),
    isolated: findIsolated(entities),
    axisReadings: state.axisReadings
  };
}

function buildPrompt(userText, sceneData, mode) {
  const modeInfo = OPERATORS[mode];
  
  const axisInfo = Object.entries(AXES).map(([key, axis]) => {
    const r = state.axisReadings[key];
    return `${key} (${axis.name}): ${axis.inner}=${r.inner}, ${axis.outer}=${r.outer}`;
  }).join('\n');
  
  const entityList = sceneData.entities.length > 0
    ? sceneData.entities.map(e => `${e.label} [${e.type}] at ${e.position}`).join(', ')
    : 'Empty grid';
  
  // Mode-specific system instructions
  if (mode === 'F') {
    return `You are a FREE scene composer. User describes a scene, you assemble entities.

## Current Grid:
- Empty cells available
- Current entities: ${entityList}

## User Intent:
"${userText}"

## Task:
Interpret the user's scene description and suggest:
1. What entities to add
2. Where to place them (row, col)
3. Why this composition works

Be creative and spatial.`;
  }
  
  if (mode === 'R') {
    return `You are a ROUTER agent. Analyze user intent and recommend best operator.

## Available Operators:
- SHED: Remove excess
- INTEGRATE: Connect parts
- GROUND: Stabilize order
- FREE: Assemble scene

## Scene State:
${axisInfo}

Entities: ${entityList}

## User Intent:
"${userText}"

## Task:
Recommend which operator to use and why. Be brief.`;
  }
  
  return `You are a ${modeInfo.name} operator analyzing spatial scene composition.

## 6-Axis Readings (1-9 scale):
${axisInfo}

## Current Scene (T0):
- Total entities: ${sceneData.totalCount}
- Overlaps: ${sceneData.overlaps.length}
- Isolated: ${sceneData.isolated.length}
- Entities: ${entityList}

## User Intent:
"${userText}"

## Task:
Analyze the spatial entropy and user intent. Provide:
1. Interpretation (1 sentence)
2. Primary axis affected (I/E/L/D/P/O)
3. Recommended operations (2-3)

Be concise. Focus on ${modeInfo.action} operations.`;
}

async function callOpenAI(apiBase, apiKey, prompt) {
  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a spatial scene analyst using DSL framework.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// ============================================================================
// MESSAGES
// ============================================================================

function addMsg(role, text) {
  const log = document.getElementById('messages');
  const msg = document.createElement('div');
  msg.className = `msg ${role}`;
  msg.textContent = text;
  log.appendChild(msg);
  
  // Stable scroll - always go to bottom
  requestAnimationFrame(() => {
    log.scrollTop = log.scrollHeight;
  });
  
  state.messages.push({ role, text, timestamp: Date.now() });
}

function exportChat() {
  const data = {
    messages: state.messages,
    entities: Array.from(state.entities.values()),
    axisReadings: state.axisReadings,
    currentMode: state.currentMode,
    timestamp: Date.now()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dsl-01-session-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  addMsg('system', '📥 Chat log exported!');
}

function resetChat() {
  if (!confirm('Reset chat and clear all messages?\n\nEntities will remain on grid.')) {
    return;
  }
  
  state.messages = [];
  document.getElementById('messages').innerHTML = '';
  
  // Deactivate mode
  if (state.currentMode) {
    document.querySelectorAll('.sig-btn').forEach(b => {
      b.classList.remove('active', 'shed-active', 'integrate-active', 'ground-active', 'free-active', 'router-active');
    });
    state.currentMode = null;
  }
  
  addMsg('system', '↺ Chat reset. Grid entities preserved.');
}

// ============================================================================
// START
// ============================================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
