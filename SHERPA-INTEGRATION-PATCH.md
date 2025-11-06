# SHERPA Integration Patch
## How to Add SHED-INTEGRATE-GROUND to func-sherpa.html

## Step 1: Add Script Include (in `<head>`)

```html
<!-- After existing script includes -->
<script src="SHED-INTEGRATE-GROUND-IMPLEMENTATION.js"></script>
```

## Step 2: Add SIG UI Controls (replace scene mode tabs)

Find the section with channel tabs/controls and add:

```html
<!-- SIG MODE SELECTOR -->
<div class="sig-control-bar" style="display: flex; gap: 8px; padding: 12px; background: var(--panel-dark); border-bottom: 1px solid var(--border);">
  <button class="sig-mode-btn" id="shedModeBtn" data-mode="SHED" style="flex: 1; padding: 12px; border: 2px solid var(--border); background: #1a1e24; color: var(--text); cursor: pointer; border-radius: 6px; font-size: 12px;">
    🗑️ <b>SHED</b><br><span style="font-size: 10px; opacity: 0.7;">Remove excess</span>
  </button>
  <button class="sig-mode-btn" id="integrateModeBtn" data-mode="INTEGRATE" style="flex: 1; padding: 12px; border: 2px solid var(--border); background: #1a1e24; color: var(--text); cursor: pointer; border-radius: 6px; font-size: 12px;">
    🔗 <b>INTEGRATE</b><br><span style="font-size: 10px; opacity: 0.7;">Connect parts</span>
  </button>
  <button class="sig-mode-btn" id="groundModeBtn" data-mode="GROUND" style="flex: 1; padding: 12px; border: 2px solid var(--border); background: #1a1e24; color: var(--text); cursor: pointer; border-radius: 6px; font-size: 12px;">
    ⚓ <b>GROUND</b><br><span style="font-size: 10px; opacity: 0.7;">Stabilize order</span>
  </button>
</div>

<!-- SIG OPTIONS PANEL (hidden by default) -->
<div class="sig-options-panel" id="sigOptionsPanel" style="display: none; padding: 15px; background: var(--panel); border-bottom: 1px solid var(--border);">
  <div style="font-size: 12px; color: var(--success); font-style: italic; margin-bottom: 10px; padding: 8px; background: rgba(86, 255, 159, 0.05); border-left: 3px solid var(--success); border-radius: 4px;" id="sigInterpretation"></div>
  <div id="sigOptionsList"></div>
</div>
```

## Step 3: Add CSS for SIG Modes

```css
/* Add to existing <style> */

.sig-mode-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.sig-mode-btn.active {
  background: #2a3f5f !important;
}

.sig-mode-btn.shed-active {
  border-color: var(--danger) !important;
  box-shadow: 0 0 12px rgba(255, 92, 124, 0.3);
}

.sig-mode-btn.integrate-active {
  border-color: var(--success) !important;
  box-shadow: 0 0 12px rgba(86, 255, 159, 0.3);
}

.sig-mode-btn.ground-active {
  border-color: #ffb956 !important;
  box-shadow: 0 0 12px rgba(255, 185, 86, 0.3);
}

.sig-option-card {
  margin: 8px 0;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #1a1e24;
  cursor: pointer;
  transition: all 0.2s;
}

.sig-option-card:hover {
  border-color: var(--success);
  background: #2a2e34;
}

.sig-option-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.sig-option-action {
  font-weight: bold;
  font-size: 12px;
}

.sig-option-axis {
  font-size: 10px;
  color: var(--text-muted);
  background: #0e1116;
  padding: 2px 6px;
  border-radius: 3px;
}

.sig-option-targets {
  color: var(--success);
  font-weight: bold;
  font-size: 11px;
}

.sig-option-reasoning {
  font-size: 11px;
  color: var(--text-muted);
  margin: 4px 0;
}

.sig-option-preview {
  font-size: 10px;
  color: var(--text-muted);
  font-style: italic;
  padding-top: 4px;
  margin-top: 4px;
  border-top: 1px solid var(--border);
}
```

## Step 4: Wire Up SIG Mode Handlers

Add this to your JavaScript initialization:

```javascript
// SIG STATE
let currentSIGMode = null;

// Mode button click handlers
document.querySelectorAll('.sig-mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    
    if (currentSIGMode === mode) {
      // Deactivate
      currentSIGMode = null;
      btn.classList.remove('active', `${mode.toLowerCase()}-active`);
      document.getElementById('sigOptionsPanel').style.display = 'none';
    } else {
      // Activate
      document.querySelectorAll('.sig-mode-btn').forEach(b => {
        b.classList.remove('active', 'shed-active', 'integrate-active', 'ground-active');
      });
      
      currentSIGMode = mode;
      btn.classList.add('active', `${mode.toLowerCase()}-active`);
      
      // Show info
      const info = {
        'SHED': 'Describe what to remove (e.g., "they sold out of bread")',
        'INTEGRATE': 'Describe what to connect (e.g., "bring dock together")',
        'GROUND': 'Describe desired structure (e.g., "organize the village")'
      };
      
      document.getElementById('sigInterpretation').textContent = info[mode];
      document.getElementById('sigOptionsPanel').style.display = 'block';
      document.getElementById('sigOptionsList').innerHTML = '<div style="color: var(--text-muted); font-size: 11px;">Type your intent and send message</div>';
    }
  });
});
```

## Step 5: Modify Message Send Handler

Find your existing `sendMessageWithLEGOS` or similar function and wrap it:

```javascript
async function sendMessageSIG(messageText) {
  const channel = appState.channels.get(appState.currentChannelId);
  
  // If SIG mode active, call composer
  if (currentSIGMode) {
    addMessage(channel, 'system', `🔮 Analyzing scene for ${currentSIGMode} operations...`);
    
    try {
      let result;
      
      if (currentSIGMode === 'SHED') {
        result = await shedComposer(messageText, appState, apiBase.value, apiKey.value);
      } else if (currentSIGMode === 'INTEGRATE') {
        result = await integrateComposer(messageText, appState, apiBase.value, apiKey.value);
      } else if (currentSIGMode === 'GROUND') {
        result = await groundComposer(messageText, appState, apiBase.value, apiKey.value);
      }
      
      displaySIGOptions(result, currentSIGMode, channel);
      
    } catch (error) {
      addMessage(channel, 'system', `❌ Error: ${error.message}`);
    }
  } else {
    // Normal message handling
    await sendMessageWithLEGOS(messageText);
  }
}

// Update your input event listener to call sendMessageSIG instead
```

## Step 6: Display Options Function

```javascript
function displaySIGOptions(result, mode, channel) {
  const panel = document.getElementById('sigOptionsPanel');
  const interp = document.getElementById('sigInterpretation');
  const list = document.getElementById('sigOptionsList');
  
  interp.textContent = `💡 ${result.interpretation}`;
  list.innerHTML = '';
  
  result.options.forEach((option, index) => {
    const card = document.createElement('div');
    card.className = 'sig-option-card';
    
    let actionText = '';
    let targetText = '';
    
    if (option.action === 'remove_entities' || option.action === 'remove_type') {
      actionText = 'Remove';
      targetText = option.targets?.join(', ') || option.target_type;
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
    
    card.addEventListener('click', () => {
      executeSIGOption(option, mode, channel);
    });
    
    list.appendChild(card);
  });
  
  panel.style.display = 'block';
}

function executeSIGOption(option, mode, channel) {
  let resultMsg = '';
  
  try {
    if (mode === 'SHED') {
      resultMsg = executeShed(option, appState);
    } else if (mode === 'INTEGRATE') {
      resultMsg = executeIntegrate(option, appState);
    } else if (mode === 'GROUND') {
      resultMsg = executeGround(option, appState);
    }
    
    addMessage(channel, 'system', `✅ ${mode}: ${resultMsg}`);
    
    // Update grid display
    updateAllChannels();
    
    // Clear mode
    document.getElementById('sigOptionsPanel').style.display = 'none';
    document.querySelectorAll('.sig-mode-btn').forEach(b => {
      b.classList.remove('active', 'shed-active', 'integrate-active', 'ground-active');
    });
    currentSIGMode = null;
    
  } catch (error) {
    addMessage(channel, 'system', `❌ Execution error: ${error.message}`);
  }
}
```

## Step 7: Test Examples

Once integrated, test with:

### SHED Example
1. Add some entities via UI
2. Click **SHED** button
3. Type: `"they sold out of bread"` (if you have a bread entity)
4. Or: `"clear the clutter"`
5. System shows removal options
6. Click option to execute

### INTEGRATE Example
1. Add scattered entities
2. Click **INTEGRATE** button
3. Type: `"bring the dock together"` (if you have dock-related entities)
4. Or: `"connect farm to market"`
5. System shows grouping options
6. Click option to group entities

### GROUND Example
1. Add random entities with overlaps
2. Click **GROUND** button
3. Type: `"organize this village"`
4. Or: `"make the farm look structured"`
5. System shows spatial ordering options
6. Click option to stabilize layout

---

## Quick Start Integration Checklist

- [ ] Copy `func-orb-training.html` to `func-sherpa.html`
- [ ] Add `SHED-INTEGRATE-GROUND-IMPLEMENTATION.js` script tag
- [ ] Add SIG mode buttons HTML
- [ ] Add SIG CSS styles
- [ ] Add mode click handlers
- [ ] Modify message send to call `sendMessageSIG`
- [ ] Add `displaySIGOptions` function
- [ ] Add `executeSIGOption` function
- [ ] Test with entities on grid
- [ ] Verify each mode works

---

## File Structure

```
/Users/gaia/FUNC-SUB/
├── func-sherpa.html (main file - modified from func-orb-training.html)
├── SHED-INTEGRATE-GROUND-IMPLEMENTATION.js (composer functions)
├── SHERPA-INTEGRATION-PATCH.md (this file - integration guide)
└── SIG-UI-INTEGRATION-GUIDE.md (detailed examples)
```

---

Ready to integrate! The code is modular and non-invasive - it adds functionality without breaking existing features.
