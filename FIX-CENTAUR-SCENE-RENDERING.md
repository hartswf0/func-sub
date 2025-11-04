# Fix: Centaur Scene Rendering Error

**Error**: `Cannot read properties of null (reading 'messageList')`  
**When**: Switching to INNER/OUTER/OBSERVER from dropdown  
**Time**: Nov 4, 2025, 6:33am

---

## Root Cause

**Three issues**:

1. **Duplicate event listeners** on `globalScenarioSelect`
   - Line 5307: Primary handler (scene + scenario)
   - Line 5615: Old handler (scenario only)
   - Both firing, second one trying to render uninitialized channel

2. **Centaur scenes not rendered on creation**
   - INNER/OUTER/OBSERVER created as channel objects
   - Welcome messages added
   - But `renderChannel()` never called
   - No DOM elements created

3. **renderMessages missing null check**
   - Tried to access `channel.dom.messageList` directly
   - Crashed when `channel.dom` was null

---

## Fixes Applied

### Fix 1: Safety Check in renderMessages()

**File**: `func-orb-training.html` Line 3334

**Before**:
```javascript
function renderMessages(channel) {
  const messageList = channel.dom.messageList; // CRASHES if channel.dom is null
  const messageDotRail = channel.dom.messageDotRail;
  if (!messageList) return;
```

**After**:
```javascript
function renderMessages(channel) {
  // Safety check: DOM must exist before rendering
  if (!channel.dom || !channel.dom.messageList) {
    console.warn('renderMessages: channel.dom not initialized for', channel.name);
    return;
  }
  
  const messageList = channel.dom.messageList;
  const messageDotRail = channel.dom.messageDotRail;
```

---

### Fix 2: Remove Duplicate Listener

**File**: `func-orb-training.html` Line 5612

**Before**:
```javascript
// Global Scenario Selector
const globalScenarioSelect = document.getElementById('globalScenarioSelect');
if (globalScenarioSelect) {
  globalScenarioSelect.addEventListener('change', () => {
    const scenarioId = globalScenarioSelect.value;
    // ... tries to render current channel
    renderMessages(channel); // CRASHES on centaur scenes
  });
}
```

**After**:
```javascript
// Global Scenario Selector - REMOVED: Duplicate listener
// The main scenario selector handler is at line ~5307
// This was causing double-firing and trying to render uninitialized centaur scenes
TestSuite.log('✅', TestSuite.stage, 'Global scenario selector bound (primary handler at line 5307)');
```

---

### Fix 3: Auto-Render Centaur Scenes

**File**: `func-orb-training.html` Line 5316

**Before**:
```javascript
if (selection.startsWith('scene_')) {
  const sceneType = selection.replace('scene_', '').toUpperCase();
  const sceneChannel = Array.from(appState.channels.values()).find(ch => ch.role === sceneType);
  
  if (sceneChannel) {
    appState.currentChannelId = sceneChannel.id;
    // Try to scroll to element that doesn't exist yet
    const columnElement = document.querySelector(`.channel-column[data-channel-id="${sceneChannel.id}"]`);
    // ...
  }
}
```

**After**:
```javascript
if (selection.startsWith('scene_')) {
  const sceneType = selection.replace('scene_', '').toUpperCase();
  const sceneChannel = Array.from(appState.channels.values()).find(ch => ch.role === sceneType);
  
  if (sceneChannel) {
    // If scene doesn't have DOM yet, render it
    if (!sceneChannel.dom) {
      console.log(`📺 Rendering ${sceneType} centaur scene for first time...`);
      renderChannel(sceneChannel);
    }
    
    appState.currentChannelId = sceneChannel.id;
    const columnElement = document.querySelector(`.channel-column[data-channel-id="${sceneChannel.id}"]`);
    // Now element exists, can scroll to it
  }
}
```

---

## How It Works Now

### Scene Switching Flow

1. **User selects "INNER" from dropdown**

2. **Handler checks if scene exists**:
   ```javascript
   const sceneChannel = find channel where ch.role === 'INNER'
   ```

3. **If no DOM, render it**:
   ```javascript
   if (!sceneChannel.dom) {
     renderChannel(sceneChannel); // Creates DOM, renders messages, attaches handlers
   }
   ```

4. **Set as current channel**:
   ```javascript
   appState.currentChannelId = sceneChannel.id;
   ```

5. **Scroll to it**:
   ```javascript
   columnElement.scrollIntoView({ behavior: 'smooth' });
   ```

---

## What Gets Created on First Render

When `renderChannel(innerScene)` is called:

1. **DOM Structure**:
   ```
   <div class="channel-column" data-channel-id="[id]">
     <div class="channel-header">INNER</div>
     <canvas class="train-canvas"></canvas>
     <div class="message-list">
       <!-- Welcome panel with buttons -->
     </div>
     <input class="message-input">
   </div>
   ```

2. **Welcome Panel** (from `addCentaurWelcomeMessages()`):
   - Operation buttons (SHED/INTEGRATE/GROUND)
   - Prompt-craft buttons (Chat/See/Balance/Convince)
   - Tetrad arrow reference

3. **Event Handlers**:
   - Input keydown listener
   - Button click handlers
   - Camera mode switchers

---

## Testing Checklist

- [x] Load page → No errors
- [x] Select "INNER" from dropdown → Renders cleanly
- [x] Select "OUTER" from dropdown → Renders cleanly
- [x] Select "OBSERVER" from dropdown → Renders cleanly
- [x] Welcome panels visible with all buttons
- [x] No duplicate listeners firing
- [x] No null reference errors

---

## Files Modified

1. **func-orb-training.html**
   - Line 3334: Added null check in `renderMessages()`
   - Line 5316: Auto-render centaur scenes on first access
   - Line 5612: Removed duplicate event listener

---

## Prevention

**This fix prevents**:
- Null reference crashes
- Duplicate event handlers
- Accessing uninitialized DOM
- Rendering channels without creating their UI first

**Pattern established**:
```javascript
// Always check DOM exists before rendering
if (!channel.dom) {
  renderChannel(channel);
}
```

This pattern should be used anywhere we programmatically switch channels.

