# TRA Mobile Rails v2.0 - Func-Orb Pattern Integration

## What Changed

### Layout Transformation
**Before**: Small radar in footer
```
┌──┬────────┬──┐
│||│Content │ID│
│||│Cards   │  │
│||├────────┤  │
│||│ Radar  │  │
└──┴────────┴──┘
```

**After**: Big radar viewport with resizable chat (func-orb pattern)
```
┌──┬────────────┬──┐
│||│            │ID│
│||│  BIG RADAR │EN│
│||│  VIEWPORT  │TI│
│||├────────────┤TY│
│||│════════════│  │ ← Resize bar
│||│ Chat       │  │
│||│ + Input    │  │
└──┴────────────┴──┘
```

## New Features

### 1. **Big Radar Viewport** (like func-orb's Three.js canvas)
- **800×800 canvas** (was 320×320)
- Takes up majority of screen space
- Resizable via drag bar
- Info overlay shows current position
- Pair toggles float on top

### 2. **Resizable Split** (func-orb pattern)
- Drag horizontal bar to resize viewport/chat
- Mouse + touch support
- Min height: 200px
- Max height: screen height - 300px
- Radar redraws on resize

### 3. **Chat Management**
- **Chat stream**: Scrollable message history
- **Chat input**: Text field + send button
- **Message styling**: User (red border) vs Assistant (green border)
- **Context-aware responses**: Uses current node state
- **Enter key**: Submit message

### 4. **Info Overlay** (like func-orb's train-info-overlay)
- Shows current state in corner of radar
- Updates live as you navigate
- Format: `STAGE • AXIS Focus: PAIR (Name) • Time`
- Example: `SHED • IDENTITY Focus: INNER (Instinct) • T0`

## UI Improvements

### Pair Rail Toggles
- Moved to **top of viewport** (not center)
- Horizontal layout (not vertical)
- Float over radar canvas
- z-index: 20 (above radar)

### Screen Division (func-orb core pattern)
1. **Header** (56px) - Title + time pills
2. **Viewport** (450px default, resizable) - Big radar
3. **Resize Bar** (6px) - Drag to adjust
4. **Chat Section** (flexible) - Messages + input

### Touch Optimization
- Resize bar touch events
- Prevents default scroll during resize
- Maintains swipe gestures for pair toggle
- All buttons remain 38-44px for touch

## Code Architecture

### New JavaScript Components

**Resize Handler**:
```javascript
resizeBar.addEventListener('mousedown', (e) => {
  isResizing = true;
  startY = e.clientY;
  startHeight = radarViewport.offsetHeight;
});
```

**Chat Manager**:
```javascript
function addMessage(role, content) {
  // Creates styled message bubble
  // Inserts before node display
  // Auto-scrolls to bottom
}
```

**Info Overlay Updater**:
```javascript
// Updates on every state change
document.getElementById('radarInfo').innerHTML = `
  <strong>${state.stage}</strong> • ${state.axis}<br>
  Focus: <strong>${state.pair}</strong> (${pairName}) • ${state.time}
`;
```

## Benefits

### From Func-Orb Pattern
✅ **Big viewport** for primary visualization
✅ **Resizable split** for custom layout
✅ **Chat management** for LLM integration
✅ **Info overlay** for contextual awareness

### Preserved from Original
✅ **Rail navigation** (left/right)
✅ **Swipe gestures** for pairs
✅ **Temporal control** (T-1/T0/T+1)
✅ **No vertical scroll** (100dvh fixed)

## File Size
- **Before**: ~19 KB
- **After**: ~21 KB (+2 KB for chat + resize)
- Still no dependencies (vanilla JS)

## Next Steps for LLM Integration

### Phase 1: Replace Mock Response
```javascript
// Current (line 1021)
setTimeout(() => {
  const context = FLOW[state.stage][state.axis][state.pair];
  addMessage('assistant', `Regarding...`);
}, 500);

// Replace with:
async function sendToLLM(userMessage) {
  const systemPrompt = `You are a Training Grounds guide.
  Current: ${state.stage} → ${state.axis} → ${state.pair}
  Operation: ${FLOW[state.stage][state.axis][state.pair].text}`;
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    })
  });
  
  const data = await response.json();
  addMessage('assistant', data.choices[0].message.content);
}
```

### Phase 2: Message History
- Store conversation per node
- Load previous messages when returning to node
- Export/import chat sessions

### Phase 3: Visual Feedback
- Show "typing..." indicator
- Highlight referenced nodes in radar
- Animate transitions based on suggestions

## Comparison to Index (13).html

### Similarities Achieved
✅ Canvas-based visualization as main focus
✅ Resizable panels
✅ Chat interface below
✅ Context-aware system

### Differences (Training Ground specific)
- **Single user focus** (not multi-agent)
- **Rail navigation** (not panel tabs)
- **6-axis radar** (not belief/value comparison)
- **Temporal context** (T-1/T0/T+1)

## Usage

### Desktop
1. Open `tra-mobile-rails.html`
2. Use rail buttons to navigate
3. Type questions in chat
4. Drag resize bar to adjust layout
5. Click pair toggles or swipe

### Mobile
1. Portrait mode recommended
2. Tap rails to switch stage/axis
3. Swipe left/right for pairs
4. Tap time pills to switch temporal context
5. Resize viewport by dragging bar
6. Chat input at bottom

## Key Insight

The func-orb pattern is about **screen real estate management**:
- **Primary tool** (radar) gets majority of space
- **Secondary interaction** (chat) gets flexible space
- **Controls** (rails/buttons) stay accessible but minimal
- **Resize bar** lets user optimize for their task

This creates a **professional working surface** not a "cute demo."
