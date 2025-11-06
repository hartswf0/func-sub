# SHED-INTEGRATE-GROUND UI Integration Guide

## How to Add to Railway Junction

### Step 1: Add the Script

```html
<!-- In railway-junction HTML -->
<script src="SHED-INTEGRATE-GROUND-IMPLEMENTATION.js"></script>
```

### Step 2: Add UI Elements

```html
<!-- Mode Selection Buttons -->
<div id="sig-mode-selector" class="sig-controls">
  <button id="shed-mode-btn" class="sig-mode-btn" data-mode="SHED">
    🗑️ SHED<br><span class="mode-subtitle">Remove excess</span>
  </button>
  <button id="integrate-mode-btn" class="sig-mode-btn" data-mode="INTEGRATE">
    🔗 INTEGRATE<br><span class="mode-subtitle">Connect parts</span>
  </button>
  <button id="ground-mode-btn" class="sig-mode-btn" data-mode="GROUND">
    ⚓ GROUND<br><span class="mode-subtitle">Stabilize order</span>
  </button>
</div>

<!-- Options Panel (hidden by default) -->
<div id="sig-options-panel" class="sig-options hidden">
  <div class="sig-options-header">
    <h3 id="sig-mode-title"></h3>
    <span id="sig-interpretation"></span>
  </div>
  <div id="sig-options-list"></div>
</div>

<!-- CSS -->
<style>
.sig-controls {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.sig-mode-btn {
  flex: 1;
  padding: 15px;
  border: 2px solid #333;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  color: #fff;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.sig-mode-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.sig-mode-btn.active {
  border-color: #569fff;
  background: linear-gradient(135deg, #2a3f5f 0%, #1a2f4f 100%);
}

.sig-mode-btn.shed-active { border-color: #ff5c7c; }
.sig-mode-btn.integrate-active { border-color: #56ff9f; }
.sig-mode-btn.ground-active { border-color: #ffb956; }

.mode-subtitle {
  font-size: 0.8em;
  opacity: 0.7;
}

.sig-options {
  margin: 15px 0;
  padding: 15px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
}

.sig-options.hidden {
  display: none;
}

.sig-options-header h3 {
  margin: 0 0 5px 0;
  color: #569fff;
}

.sig-interpretation {
  font-size: 0.9em;
  color: #888;
  font-style: italic;
}

.sig-option-card {
  margin: 10px 0;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background: #252525;
  cursor: pointer;
  transition: all 0.2s;
}

.sig-option-card:hover {
  border-color: #569fff;
  background: #2a2a2a;
}

.sig-option-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sig-option-action {
  font-weight: bold;
  color: #fff;
}

.sig-option-axis {
  font-size: 0.85em;
  color: #888;
  background: #1a1a1a;
  padding: 3px 8px;
  border-radius: 4px;
}

.sig-option-reasoning {
  font-size: 0.9em;
  color: #bbb;
  margin: 5px 0;
}

.sig-option-preview {
  font-size: 0.85em;
  color: #888;
  font-style: italic;
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid #333;
}

.sig-option-targets {
  color: #56ff9f;
  font-weight: bold;
}
</style>
```

### Step 3: Wire Up Event Handlers

```javascript
// Add to railway junction initialization

let currentSIGMode = null;
let currentSIGOptions = null;

// Mode button handlers
document.querySelectorAll('.sig-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    
    // Toggle mode
    if (currentSIGMode === mode) {
      currentSIGMode = null;
      btn.classList.remove('active');
      document.getElementById('sig-options-panel').classList.add('hidden');
    } else {
      // Clear previous
      document.querySelectorAll('.sig-mode-btn').forEach(b => b.classList.remove('active'));
      
      // Set new
      currentSIGMode = mode;
      btn.classList.add('active');
      
      // Show info
      showModeInfo(mode);
    }
  });
});

function showModeInfo(mode) {
  const panel = document.getElementById('sig-options-panel');
  const title = document.getElementById('sig-mode-title');
  
  const info = {
    'SHED': {
      title: '🗑️ SHED Mode Active',
      desc: 'Type what you want removed. Example: "they sold out of bread" or "clear the clutter"'
    },
    'INTEGRATE': {
      title: '🔗 INTEGRATE Mode Active',
      desc: 'Describe what to connect. Example: "bring the dock together" or "connect farm to market"'
    },
    'GROUND': {
      title: '⚓ GROUND Mode Active',
      desc: 'Describe desired structure. Example: "organize the village" or "make this look like a real farm"'
    }
  };
  
  title.textContent = info[mode].title;
  document.getElementById('sig-interpretation').textContent = info[mode].desc;
  panel.classList.remove('hidden');
}

// Modify existing send message handler
async function sendMessageWithSIG(messageText) {
  // If SIG mode is active, call composer instead of normal message
  if (currentSIGMode) {
    await handleSIGComposition(messageText, currentSIGMode);
  } else {
    // Normal message handling
    await sendMessageNormal(messageText);
  }
}

async function handleSIGComposition(userText, mode) {
  const channel = appState.channels.get(appState.currentChannelId);
  
  // Show loading
  addMessage(channel, 'system', `🔮 Analyzing scene for ${mode} operations...`);
  
  try {
    let result;
    
    if (mode === 'SHED') {
      result = await shedComposer(userText, appState, apiBase, apiKey);
    } else if (mode === 'INTEGRATE') {
      result = await integrateComposer(userText, appState, apiBase, apiKey);
    } else if (mode === 'GROUND') {
      result = await groundComposer(userText, appState, apiBase, apiKey);
    }
    
    // Display options
    displaySIGOptions(result, mode);
    
  } catch (error) {
    addMessage(channel, 'system', `❌ Error: ${error.message}`);
    console.error('SIG composer error:', error);
  }
}

function displaySIGOptions(result, mode) {
  const optionsList = document.getElementById('sig-options-list');
  optionsList.innerHTML = '';
  
  // Update interpretation
  document.getElementById('sig-interpretation').textContent = 
    `💡 ${result.interpretation}`;
  
  // Create option cards
  result.options.forEach((option, index) => {
    const card = document.createElement('div');
    card.className = 'sig-option-card';
    card.dataset.optionIndex = index;
    
    // Determine what to display based on action
    let actionText = '';
    let targetText = '';
    
    if (option.action === 'remove_entities') {
      actionText = 'Remove';
      targetText = option.targets.join(', ');
    } else if (option.action === 'remove_type') {
      actionText = 'Remove All';
      targetText = option.target_type;
    } else if (option.action === 'group_spatial') {
      actionText = 'Group';
      targetText = option.targets.join(', ');
    } else if (option.action === 'arrange_pattern') {
      actionText = `Arrange in ${option.pattern}`;
      targetText = option.targets.join(', ');
    } else if (option.action === 'normalize_scale') {
      actionText = 'Normalize Scales';
      targetText = option.rules.map(r => r.type).join(', ');
    } else {
      actionText = option.action;
      targetText = '';
    }
    
    card.innerHTML = `
      <div class="sig-option-header">
        <span class="sig-option-action">${actionText}</span>
        <span class="sig-option-axis">${option.axis_detail || mode}</span>
      </div>
      ${targetText ? `<div class="sig-option-targets">${targetText}</div>` : ''}
      <div class="sig-option-reasoning">${option.reasoning}</div>
      <div class="sig-option-preview">Preview: ${option.preview}</div>
    `;
    
    // Click handler
    card.addEventListener('click', () => executeSIGOption(option, mode, result));
    
    optionsList.appendChild(card);
  });
  
  // Store current options
  currentSIGOptions = {result, mode};
}

function executeSIGOption(option, mode, fullResult) {
  const channel = appState.channels.get(appState.currentChannelId);
  
  let resultMsg = '';
  
  try {
    if (mode === 'SHED') {
      resultMsg = executeShed(option, appState);
    } else if (mode === 'INTEGRATE') {
      resultMsg = executeIntegrate(option, appState);
    } else if (mode === 'GROUND') {
      resultMsg = executeGround(option, appState);
    }
    
    // Log action
    addMessage(channel, 'system', `✅ ${mode}: ${resultMsg}`);
    
    // Update grid display
    updateGridDisplay();
    
    // Clear options
    document.getElementById('sig-options-panel').classList.add('hidden');
    document.querySelectorAll('.sig-mode-btn').forEach(b => b.classList.remove('active'));
    currentSIGMode = null;
    
  } catch (error) {
    addMessage(channel, 'system', `❌ Execution error: ${error.message}`);
    console.error('SIG execution error:', error);
  }
}
```

### Step 4: Auto-Detect Mode (Optional)

```javascript
// Automatically detect mode from user input
async function smartSendMessage(messageText) {
  const detectedMode = detectMode(messageText);
  
  if (detectedMode) {
    // Auto-activate mode and compose
    currentSIGMode = detectedMode;
    document.querySelector(`[data-mode="${detectedMode}"]`).classList.add('active');
    await handleSIGComposition(messageText, detectedMode);
  } else {
    // Normal message
    await sendMessageNormal(messageText);
  }
}
```

---

## Usage Examples

### Example 1: User types "they sold out of bread"

**Flow:**
1. System detects "sold out" → auto-activates SHED mode
2. Calls `shedComposer("they sold out of bread", appState)`
3. LLM returns:
```json
{
  "interpretation": "User indicates bread item is depleted",
  "shed_axis": "DOMAIN/RESOURCE",
  "options": [
    {
      "action": "remove_entities",
      "targets": ["Fresh Breads and Pastries"],
      "axis_detail": "DOMAIN/RESOURCE → Discard Depleted Assets",
      "reasoning": "Item sold out, no longer available",
      "preview": "Bread stand removed from market"
    },
    {
      "action": "remove_type",
      "target_type": "FOOD",
      "axis_detail": "DOMAIN/RESOURCE → Clear Depleted Category",
      "reasoning": "Remove all food items if market closed",
      "preview": "All food vendors removed"
    }
  ]
}
```
4. UI shows 2 option cards
5. User clicks "Remove Fresh Breads and Pastries"
6. `executeShed()` removes entity from grid
7. Message: "✅ SHED: Removed Fresh Breads and Pastries"

### Example 2: User types "bring the dock together"

**Flow:**
1. System detects "bring together" → auto-activates INTEGRATE mode
2. Calls `integrateComposer("bring the dock together", appState)`
3. LLM analyzes scene, finds "Dock" at (1,2), "Pier" at (6,7), "Boat" at (3,4)
4. Returns options:
```json
{
  "interpretation": "User wants dock-related entities grouped",
  "integrate_axis": "ORDER/PARTS",
  "options": [
    {
      "action": "group_spatial",
      "targets": ["Dock", "Pier", "Boat"],
      "center": {"row": 4, "col": 4},
      "radius": 1,
      "reasoning": "Bring scattered dock elements to central location",
      "preview": "All dock elements adjacent at center"
    }
  ]
}
```
5. User clicks option
6. `executeIntegrate()` moves entities to (4,4), (4,5), (5,4)
7. Grid updates with grouped entities

### Example 3: User types "make this village look organized"

**Flow:**
1. System detects "organized" → auto-activates GROUND mode
2. Calls `groundComposer("make this village look organized", appState)`
3. LLM detects pathologies: overlapping houses, inconsistent scales, random positions
4. Returns options:
```json
{
  "interpretation": "User wants structured village layout",
  "ground_axis": "ORDER/WHOLE",
  "pathology_assessment": "Entities randomly placed, scale inconsistency detected",
  "options": [
    {
      "action": "normalize_scale",
      "rules": [
        {"type": "BUILDING", "scale": 1.5},
        {"type": "HUMAN", "scale": 1.0},
        {"type": "TREE", "scale": 2.0}
      ],
      "reasoning": "Create visual hierarchy with appropriate sizing",
      "addresses": "scale inconsistency",
      "preview": "Buildings 1.5x, people 1.0x, trees 2.0x"
    },
    {
      "action": "arrange_pattern",
      "pattern": "grid",
      "targets": ["House 1", "House 2", "House 3"],
      "center": {"row": 2, "col": 2},
      "spacing": 2,
      "reasoning": "Grid layout shows planned village structure",
      "addresses": "random positioning",
      "preview": "Houses at (2,2), (2,4), (2,6), (4,2)..."
    }
  ]
}
```
5. User can choose scale normalization OR grid arrangement
6. System executes chosen operation
7. Grid updates with organized layout

---

## Configuration Options

```javascript
// Add to railway junction config

const SIG_CONFIG = {
  // Auto-detect mode from user input?
  autoDetectMode: true,
  
  // Show all 3 mode buttons or just "Compose" button?
  showModePicker: true,
  
  // API settings
  apiModel: 'gpt-4o-mini',
  apiTemperature: {
    shed: 0.7,
    integrate: 0.7,
    ground: 0.6
  },
  
  // Max options to show
  maxOptions: 3,
  
  // Animation speed for entity movements (ms)
  animationSpeed: 300
};
```

---

## Testing Checklist

- [ ] SHED mode removes single entity
- [ ] SHED mode removes multiple entities
- [ ] SHED mode removes by type
- [ ] INTEGRATE mode groups spatially
- [ ] INTEGRATE mode creates relationships
- [ ] GROUND mode normalizes scales
- [ ] GROUND mode arranges in circle
- [ ] GROUND mode arranges in grid
- [ ] GROUND mode formalizes spatial relationships
- [ ] Auto-detect recognizes SHED keywords
- [ ] Auto-detect recognizes INTEGRATE keywords
- [ ] Auto-detect recognizes GROUND keywords
- [ ] Options display correctly
- [ ] Options execute without errors
- [ ] Grid updates after execution
- [ ] Messages log correctly

---

## Next Steps

1. **Add to railway junction** - Copy code sections above
2. **Test with simple scene** - Create 5-6 entities, try each mode
3. **Refine prompts** - Adjust system prompts based on results
4. **Add animations** - Smooth entity movements during INTEGRATE/GROUND
5. **Add undo** - Store scene state before each operation
6. **Add visual feedback** - Highlight entities being operated on
