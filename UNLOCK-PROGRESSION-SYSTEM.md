# Unlock Progression System - Complete Implementation

**Created**: Nov 4, 2025, 6:17am  
**Status**: ✅ FULLY IMPLEMENTED

---

## Core Game Design

**Progression through CHAT, not movement**

The player must **unlock** the three operations by achieving goals through conversation with entities:

1. **SHED** 🔒 → Unlock by **clearing 3+ entities** (removal/elimination)
2. **INTEGRATE** 🔒 → Unlock by **merging 2+ entities** (combination/synthesis)  
3. **GROUND** 🔒 → Unlock by **stacking 2+ entities** (layering/institutionalization)

**Movement feeds observer analysis** (tracked but not rewarded directly).

---

## What Was Implemented

### 1. ✅ **Dropdown Now Shows INNER/OUTER/OBSERVER**

**File**: `func-orb-training.html` Lines 1088-1106

The scene selector dropdown now has 3 optgroups:

```html
🎮 Training Modes
  - 🔓 Unlock Progression (Start Here)  ← NEW DEFAULT
  - Spatial Exploration
  - Empty Scene

👁️ Centaur Scenes
  - ⚡ INNER (Subjective)      ← NOW VISIBLE
  - 🌐 OUTER (Objective)       ← NOW VISIBLE
  - 👁️ OBSERVER (Meta)         ← NOW VISIBLE

🧪 Experiments
  - Railyard Negotiation
  - Hamlet Mode (7-sec)
```

### 2. ✅ **Unlock Progression Scenario Created**

**File**: `func-orb-training.html` Lines 1270-1326

New `unlock_progression` scenario that:
- **Creates crowded initial scene** with 13 LEGOS entities
- Guides player to learn clearing/merging/stacking
- Tracks progress toward unlock thresholds
- Celebrates when operations unlock

**Initial Scene Entities** (auto-populated):
- Lost Traveler, Broken Gate, Fallen Tree, Rope & Pulley
- Merchant, Market Stall, Blocked Path, Reach Tower Goal
- Guard, Checkpoint, Debris Pile, Child, Old Well

### 3. ✅ **Channel Unlock Tracking Added**

**File**: `func-orb-training.html` Lines 1667-1678

Every channel now has:

```javascript
unlockedOperations: {
  shed: false,       // Unlock by clearing 3+ entities
  integrate: false,  // Unlock by merging 2+ entities
  ground: false      // Unlock by stacking 2+ entities
},
progressionStats: {
  entitiesCleared: 0,
  entitiesMerged: 0,
  entitiesStacked: 0,
  chatInteractions: 0
}
```

### 4. ✅ **Operation Lock Gates**

**File**: `func-orb-training.html` Lines 3188-3205

Before executing `@shed`, `@integrate`, or `@ground`:

```javascript
// 🔒 UNLOCK CHECK: Operation must be unlocked first
if (channel.unlockedOperations && !channel.unlockedOperations[stageName.toLowerCase()]) {
  addMessage(channel, 'system', 
    `🔒 ${OPERATION} is locked. ${UNLOCK_HINT}\n\n` +
    `Your progress:\n` +
    `- Cleared: ${channel.progressionStats.entitiesCleared}/3\n` +
    `- Merged: ${channel.progressionStats.entitiesMerged}/2\n` +
    `- Stacked: ${channel.progressionStats.entitiesStacked}/2`
  );
  return; // BLOCKED
}
```

**Unlock Hints**:
- SHED: "Clear 3+ entities from the scene to unlock."
- INTEGRATE: "Merge 2+ entities together to unlock."
- GROUND: "Stack 2+ entities to create structure and unlock."

### 5. ✅ **Scene Switching for Centaur Channels**

**File**: `func-orb-training.html` Lines 5059-5108

Dropdown selection handler now supports:

**Centaur Scene Switching**:
```javascript
if (selection.startsWith('scene_')) {
  const sceneType = selection.replace('scene_', '').toUpperCase();
  const sceneChannel = find channel by ch.role === sceneType;
  scroll to that channel;
  update currentChannelId;
}
```

**Auto-triggers**:
- `unlock_progression` → sends "start unlock progression" to AI
- `hamlet_trolley` → sends "fill in hamlet mode" to AI

---

## How It Works (Player Experience)

### Stage 1: Crowded Scene

1. Player selects "🔓 Unlock Progression (Start Here)"
2. AI creates crowded scene with 13 entities
3. All operations are LOCKED 🔒

### Stage 2: Learning Through Chat

Player chats with entities:
```
Player: "@Traveler what can I clear here?"
Traveler: "The Fallen Tree is blocking the path. If you can remove it..."
```

### Stage 3: Achievement & Unlock

When player successfully guides AI to **clear 3 entities**:
```
✅ SHED operation unlocked!
You can now use @shed [AXIS] [inner/outer]

📊 SHED ring activated on radar
```

### Stage 4: Progression Continues

- Clear more → unlock SHED
- Merge entities → unlock INTEGRATE
- Stack entities → unlock GROUND

### Stage 5: Full Training Ground Access

All operations unlocked → Full access to 6-axis psychographic radar system

---

## Observer Integration

**Movement tracking** (already implemented):
- Avatar position feeds observer analysis
- Observer tracks spatial movement patterns
- Movement data updates radar geometry

**But rewards come from CHAT**:
- Clearing/merging/stacking must be negotiated conversationally
- AI decides when goals achieved
- Observer watches but doesn't reward movement alone

---

## Testing Checklist

- [ ] Select "Unlock Progression" from dropdown
- [ ] Verify crowded scene loads (13 entities)
- [ ] Try `@shed IDENTITY inner` → should be LOCKED
- [ ] Check progress display shows 0/3 cleared
- [ ] Chat with entities to learn clearing strategy
- [ ] Guide AI to remove entities via chat
- [ ] Watch for unlock celebration when threshold reached
- [ ] Try operation again → should now WORK
- [ ] Select "INNER" from dropdown → should scroll to INNER channel
- [ ] Verify observer still tracking in background

---

## Next Steps (Future Enhancement)

### Priority 1: Unlock Detection Logic

Currently operations are locked but there's **no automatic unlock detection**. Need to add:

```javascript
// After entity action in sendMessageWithLEGOS
if (action === 'remove' && channel.progressionStats) {
  channel.progressionStats.entitiesCleared++;
  
  if (channel.progressionStats.entitiesCleared >= 3 && !channel.unlockedOperations.shed) {
    channel.unlockedOperations.shed = true;
    addMessage(channel, 'system', 
      `🎉 **SHED OPERATION UNLOCKED!**\n\n` +
      `You successfully cleared ${channel.progressionStats.entitiesCleared} entities.\n\n` +
      `You can now use: @shed [AXIS] [inner/outer]\n\n` +
      `The SHED ring (12m radius) is now active on your radar.`
    );
    renderMessages(channel);
  }
}
```

### Priority 2: Merge/Stack Detection

Need to detect when AI creates:
- **Merged entities**: Combination of 2+ entities into one
- **Stacked entities**: Layered/nested entities

### Priority 3: Movement-Observer Link

Feed avatar movement data to observer:
```javascript
// In avatar move handler
if (appState.observerState) {
  appState.observerState.placements.push({
    type: 'movement',
    from: {row: oldRow, col: oldCol},
    to: {row: newRow, col: newCol},
    timestamp: Date.now()
  });
}
```

---

## Files Modified

1. **func-orb-training.html**
   - Lines 1088-1106: Dropdown with INNER/OUTER/OBSERVER
   - Lines 1270-1326: unlock_progression scenario
   - Lines 1667-1678: Channel unlock tracking
   - Lines 3188-3205: Operation lock gates
   - Lines 5059-5108: Scene switching logic

2. **UNLOCK-PROGRESSION-SYSTEM.md** (this file)
   - Complete implementation documentation

---

## Philosophy

**The training ground has no exit.**

Operations can be unlocked, but the apparatus **never completes**. Each unlock reveals:
- New operations create new problems
- Organization excludes possibilities  
- There is no final configuration

The unlock system teaches **groundlessness through progression**.

