# Startup Logging & Onboarding System

## What Was Added

**Comprehensive console logging** throughout system initialization to show exactly what's loading and what's working.

## Startup Sequence (Console Output)

When you load `func-orb-training.html`, you'll now see:

```
=== 🎯 TRAINING GROUND INITIALIZATION STARTED ===

📦 Loading system ontology...
Ontology: TRAINING_GROUND
  - Stages: [ 'SHED', 'INTEGRATE', 'GROUND' ]
  - Axes: [ 'IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER' ]
  - Total operations: 36

🎨 Loading ring configurations...
Rings: [ 'shed', 'integrate', 'ground' ]
  - SHED: radius 12, Eliminate, reduce, strip away
  - INTEGRATE: radius 20, Connect, synthesize, build
  - GROUND: radius 28, Stabilize, fix, institutionalize

🏗️ Creating initial channel...
Channel created: channel_xxxxx

🎭 Creating centaur scenes...
Centaur scenes initialized:
  - INNER scene: scene_xxxxx (sceneType: POLARITY_INNER)
  - OUTER scene: scene_xxxxx (sceneType: POLARITY_OUTER)
  - OBSERVER scene: scene_xxxxx (sceneType: META_OBSERVER)
✅ Three centaur scenes created successfully

=== 🎨 INITIALIZING 3D SCENE FOR CHANNEL: channel_xxxxx ===

✅ Canvas found: 400x450
🌌 Creating Three.js scene...
✅ Scene created with fog and background
✅ Grid created: 81 cells (9x9), cell size: 5
🎯 Grid floor created: 9×9 cells in 3D scene

⭕ Creating operation rings...
Ring configurations: [ 'shed', 'integrate', 'ground' ]
  Creating SHED ring: radius 12, color #ff5c7c
  Creating INTEGRATE ring: radius 20, color #ffffff
  Creating GROUND ring: radius 28, color #569fff

📊 Creating 6-axis psychographic radar...
Radar axes: [ 'IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER' ]
✅ Radar created with hexagonal polygon and axis lines
📊 3D Psychographic radar created on grid plane

🪐 Creating orbital bodies (operations)...
Orbital bodies: SHED, INTEGRATE, GROUND
  Creating SHED body: size 1, radius 12
  Creating INTEGRATE body: size 1.1, radius 20
  Creating GROUND body: size 1.2, radius 28

✅ 3D SCENE INITIALIZATION COMPLETE
Summary:
  - Grid cells: 81
  - Rings: 3 (SHED, INTEGRATE, GROUND)
  - Orbital bodies: 3 (SHED, INTEGRATE, GROUND)
  - Radar axes: 6
  - Camera position: [35, 40, 35]
  - Scene ready for training operations

✅ 3D scene fully initialized and ready
```

## Updated Welcome Message

The chat now shows:

```
🎯 TRAINING GROUND · THREE OPERATIONS

This is a spatial apparatus for psychographic operations across 6 axes 
(IDENTITY, EXPERIENCE, LANGUAGE, DOMAIN, PURPOSE, ORDER) with 2 polarities 
each (INNER/OUTER).

THREE RINGS = THREE OPERATIONS

🔴 SHED (Inner ring, red) — Eliminate, reduce, strip away excess  
⚪ INTEGRATE (Middle ring, white) — Connect, synthesize, build coherence  
🔵 GROUND (Outer ring, blue) — Stabilize, institutionalize, fix in place

THE 6-AXIS RADAR

The hexagonal grid shows your psychographic profile across 6 dimensions. 
Place training nodes using commands like:
- @shed IDENTITY inner — Eliminate emotional noise (Instinct)
- @integrate LANGUAGE outer — Connect ideas to ideology
- @ground PURPOSE inner — Stabilize your emotional drive (Heart)

THREE SCENES (INNER/OUTER/OBSERVER)

- INNER scene: Subjective operations (Instinct, Seen, Ideas, Source, Heart, Parts)
- OUTER scene: Objective operations (Reason, Unseen, Ideology, Resource, Head, Whole)
- OBSERVER scene: Meta-layer watching both, detecting imbalances

---

COMMANDS

• Place nodes: Type commands like @shed IDENTITY inner or @integrate PURPOSE outer
• View radar: Type show radar to see your 6-axis psychographic profile
• View observer: Type show observer to see INNER/OUTER balance and imbalances
• Explore concepts: Type /apparatus, /groundless, or /recursion for deep dives

CONTROLS

• Adjust Drift (−/+) - Controls axis intensity (how much each placement affects radar)
• Add Moon - Places both INNER+OUTER polarity pair on selected axis
• Reset - Clears all nodes on selected axis
• Physics - Toggles recursion mode (operations reference themselves)
• Release - Commits current selection to GROUND operation

THREE RINGS VISUALIZATION

The 3D viewport shows three concentric rings orbiting the grid:
• 🔴 Inner ring = SHED operations (radius 12)
• ⚪ Middle ring = INTEGRATE operations (radius 20)
• 🔵 Outer ring = GROUND operations (radius 28)

As you place training nodes, the 6-axis radar hexagon updates in real-time.

---

SYSTEM ONTOLOGY

6 Axes × 2 Polarities × 3 Operations = 36 training nodes

Axes: IDENTITY • EXPERIENCE • LANGUAGE • DOMAIN • PURPOSE • ORDER

Polarities:
  • INNER: Instinct, Seen, Ideas, Source, Heart, Parts (subjective)
  • OUTER: Reason, Unseen, Ideology, Resource, Head, Whole (objective)

Operations:
  • SHED: Eliminate excess, reduce complexity
  • INTEGRATE: Connect elements, build coherence
  • GROUND: Stabilize position, institutionalize

---

QUICK START

1. Type: @shed IDENTITY inner
2. Watch the grid place a node and the radar update
3. Type: show observer to see what the system detected
4. Try more operations on different axes
5. Type: show radar to view your psychographic profile

📊 Status: 3 rings active, 6-axis radar initialized, observer monitoring

✨ "The apparatus organizes itself as you observe it organizing you."

▶️ Type a command to begin training.
```

## What to Check

When the page loads:

### 1. **Console Log** (Open Browser DevTools)
- Should see initialization sequence
- Green checkmarks (✅) = successful
- Red X (❌) = failed (investigate)

### 2. **3D Viewport**
- Should show grid with blue cell borders
- Should show 3 concentric rings (red, white, blue)
- Should show 3 orbital bodies rotating
- Should show hexagonal radar overlay

### 3. **Chat Panel**
- Should show welcome message with system ontology
- Should show control panel with buttons

### 4. **Test Command**
Try typing:
```
@shed IDENTITY inner
```

You should see:
1. Console log: Observer state update
2. 3D scene: Node appears on grid
3. Radar: Hexagon shape updates
4. Chat: Confirmation message with apparatus commentary

## Troubleshooting

### If 3D scene is blank:
Check console for:
```
❌ Canvas missing - 3D initialization aborted
```
→ DOM issue, check if trainCanvas element exists

### If rings don't appear:
Check console for:
```
Ring configurations: [ 'shed', 'integrate', 'ground' ]
  Creating SHED ring: ...
```
→ Should see 3 ring creation messages

### If commands don't work:
Check console for errors in:
```
sendMessageWithLEGOS
```
→ Look for parsing errors or missing TRAINING_GROUND data

### If radar doesn't update:
Check console for:
```
✅ Radar created with hexagonal polygon and axis lines
```
→ Radar geometry should be created
→ Check if `update3DRadar()` is being called

### If scenes don't create:
Check console for:
```
✅ Three centaur scenes created successfully
```
vs
```
⚠️ Centaur scenes creation failed: [error message]
```
→ Look at error details

## Logging Locations

### Startup (initApp function)
- Lines 1803-1840
- Logs: Ontology loading, ring configs, channel creation, scene creation

### 3D Initialization (init3DForChannel function)
- Lines 5455-5772
- Logs: Canvas check, scene creation, grid, rings, radar, orbitals, summary

### Message Processing (sendMessageWithLEGOS function)
- Lines 2876-3082
- Logs: Observer state updates, context window updates, imbalances

## What the Logs Reveal

### System Architecture
- **3 rings** (SHED, INTEGRATE, GROUND)
- **36 operations** (6 axes × 2 polarities × 3 operations)
- **3 scenes** (INNER, OUTER, OBSERVER)
- **81 grid cells** (9×9)
- **6 radar axes**

### Loading Order
1. Ontology (data structures)
2. Rings (3D geometry)
3. Channel (state management)
4. Scenes (INNER/OUTER/OBSERVER contexts)
5. 3D viewport (grid, rings, bodies, radar)
6. Controls (drift, buttons, d-pad)
7. Event handlers (raycaster, keyboard)

### Critical Dependencies
- **TRAINING_GROUND** must exist before 3D init
- **TRACK_CONFIGS** must have 3 rings
- **createCentaurScenes** must succeed for scene system
- **Canvas element** must exist for Three.js
- **THREE.js library** must load before init

## Success Indicators

You know the system is working when you see:

```
✅ 3D SCENE INITIALIZATION COMPLETE
Summary:
  - Grid cells: 81
  - Rings: 3 (SHED, INTEGRATE, GROUND)
  - Orbital bodies: 3 (SHED, INTEGRATE, GROUND)
  - Radar axes: 6
```

And when you type `@shed IDENTITY inner`, you see:

```
✅ Placed INNER (SHED • IDENTITY • INNER) at (0,0)

📍 Operation: Eliminate Current Emotional Noise
🎯 Target: Noise In Immediate Preference

📊 IDENTITY axis: 45% | Radar polygon updated

🔴 APPARATUS ACKNOWLEDGMENT: You are using SHED to organize your grid...
```

## Files Modified

- **func-orb-training.html**
  - Lines 1803-1840: Startup logging in initApp
  - Lines 5455-5772: 3D initialization logging
  - Lines 1842-1927: Updated welcome message
  - Line 4792: Bug fix for SCENARIOS check

**The system now tells you exactly what it's doing as it loads.**
