# TODO: Auto-Unlock Detection Logic

**Status**: Operations are gated but unlock detection is NOT YET automated

---

## What Works Now

✅ Operations start LOCKED  
✅ Trying locked operation shows progress (0/3, 0/2, etc.)  
✅ Player can see what's needed to unlock  
✅ INNER/OUTER/OBSERVER appear in dropdown  
✅ Crowded initial scene loads

---

## What's Missing

❌ **Automatic unlock when thresholds reached**  
❌ **Tracking entity removal/merge/stack actions**  
❌ **Celebration messages when operations unlock**

---

## Implementation Needed

### Location: `sendMessageWithLEGOS()` function

After processing AI response JSON (entity actions), add:

```javascript
// After applying entity actions from AI response
json.entities.forEach(entityAction => {
  if (entityAction.action === 'remove') {
    // Entity cleared!
    if (channel.progressionStats) {
      channel.progressionStats.entitiesCleared++;
      console.log(`✅ Entity cleared! Total: ${channel.progressionStats.entitiesCleared}/3`);
      
      // Check for SHED unlock
      if (channel.progressionStats.entitiesCleared >= 3 && 
          !channel.unlockedOperations.shed) {
        channel.unlockedOperations.shed = true;
        
        addMessage(channel, 'system',
          `🎉 **SHED OPERATION UNLOCKED!**\n\n` +
          `You cleared ${channel.progressionStats.entitiesCleared} entities through conversation.\n\n` +
          `✅ You can now use: @shed [AXIS] [inner/outer]\n\n` +
          `The SHED ring (radius 12m) is now visible on your radar.\n\n` +
          `📊 SHED operations eliminate noise, reduce clutter, strip away excess.`
        );
        renderMessages(channel);
        
        // Visual feedback - flash SHED ring
        flashRing(channel, 'shed');
      }
    }
  }
  
  if (entityAction.action === 'merge') {
    // Entities merged!
    if (channel.progressionStats) {
      channel.progressionStats.entitiesMerged++;
      console.log(`✅ Entity merged! Total: ${channel.progressionStats.entitiesMerged}/2`);
      
      // Check for INTEGRATE unlock
      if (channel.progressionStats.entitiesMerged >= 2 && 
          !channel.unlockedOperations.integrate) {
        channel.unlockedOperations.integrate = true;
        
        addMessage(channel, 'system',
          `🎉 **INTEGRATE OPERATION UNLOCKED!**\n\n` +
          `You merged ${channel.progressionStats.entitiesMerged} entity pairs.\n\n` +
          `✅ You can now use: @integrate [AXIS] [inner/outer]\n\n` +
          `The INTEGRATE ring (radius 20m) is now visible.\n\n` +
          `📊 INTEGRATE operations connect, synthesize, build coherence.`
        );
        renderMessages(channel);
        
        flashRing(channel, 'integrate');
      }
    }
  }
  
  if (entityAction.action === 'stack') {
    // Entities stacked!
    if (channel.progressionStats) {
      channel.progressionStats.entitiesStacked++;
      console.log(`✅ Entity stacked! Total: ${channel.progressionStats.entitiesStacked}/2`);
      
      // Check for GROUND unlock
      if (channel.progressionStats.entitiesStacked >= 2 && 
          !channel.unlockedOperations.ground) {
        channel.unlockedOperations.ground = true;
        
        addMessage(channel, 'system',
          `🎉 **GROUND OPERATION UNLOCKED!**\n\n` +
          `You stacked ${channel.progressionStats.entitiesStacked} entity layers.\n\n` +
          `✅ You can now use: @ground [AXIS] [inner/outer]\n\n` +
          `The GROUND ring (radius 28m) is now visible.\n\n` +
          `📊 GROUND operations stabilize, institutionalize, fix structures.`
        );
        renderMessages(channel);
        
        flashRing(channel, 'ground');
      }
    }
  }
});
```

### Visual Feedback Helper

```javascript
function flashRing(channel, ringName) {
  // Find the ring line in 3D scene
  const ringConfig = TRACK_CONFIGS[ringName];
  if (!channel.scene || !ringConfig) return;
  
  // Flash the ring color brighter for 2 seconds
  channel.scene.traverse((obj) => {
    if (obj.type === 'Line' && obj.material.color.getHex() === ringConfig.color) {
      const originalOpacity = obj.material.opacity;
      obj.material.opacity = 1.0; // Full bright
      
      setTimeout(() => {
        obj.material.opacity = originalOpacity;
      }, 2000);
    }
  });
}
```

---

## Detecting Merge vs Stack

**Current entity actions**: `add`, `remove`, `transform`

**Need to extend AI to output**:
- `{"action": "merge", "sources": ["Traveler", "Merchant"], "result": "Trading Duo"}`
- `{"action": "stack", "base": "Gate", "layer": "Checkpoint"}`

**Alternative**: Detect from label patterns
- Merge: `"Traveler + Merchant"`, `"Combined Unit"`
- Stack: `"Gate [Checkpoint]"`, `"Layered Structure"`

---

## Where to Add This Code

**File**: `func-orb-training.html`  
**Function**: `sendMessageWithLEGOS()` (around line 3000-4000)  
**After**: Entity JSON parsing and grid updates  
**Before**: Final renderMessages call

Look for:
```javascript
// Process entity actions
json.entities.forEach(e => {
  if (e.action === 'add') { ... }
  if (e.action === 'remove') { ... }
  // ADD UNLOCK DETECTION HERE
});
```

---

## Testing After Implementation

1. Start unlock_progression mode
2. Chat: "@Traveler can you leave?"
3. AI responds with `{"action": "remove", ...}` for 3 entities
4. Should see: `🎉 SHED OPERATION UNLOCKED!`
5. Try: `@shed IDENTITY inner`
6. Should work (not locked anymore)

---

## Files to Modify

1. **func-orb-training.html**
   - Add unlock detection in `sendMessageWithLEGOS()`
   - Add `flashRing()` helper function

2. **unlock_progression scenario** (already done)
   - Update AI instructions to output `merge` and `stack` actions

