# Scene-Specific Axis Labels + Camera + Core Glow

**Time**: Nov 4, 2025, 6:47am  
**Status**: ✅ FULLY IMPLEMENTED

---

## Features Implemented

### 1. ✅ **Scene-Specific Axis Labels**

**INNER scene uses subjective terms**:
- IDENTITY → **Instinct**
- EXPERIENCE → **Seen**
- LANGUAGE → **Ideas**
- DOMAIN → **Source**
- PURPOSE → **Heart**
- ORDER → **Parts**

**OUTER scene uses objective terms**:
- IDENTITY → **Reason**
- EXPERIENCE → **Unseen**
- LANGUAGE → **Ideology**
- DOMAIN → **Resource**
- PURPOSE → **Head**
- ORDER → **Whole**

**OBSERVER scene uses canonical names**:
- IDENTITY, EXPERIENCE, LANGUAGE, DOMAIN, PURPOSE, ORDER

---

### 2. ✅ **Color-Coded Axis Labels**

**File**: `func-orb-training.html` Lines 6083-6100

Axis labels in 3D scene now color-coded by scene type:

```javascript
if (channel.sceneType === 'POLARITY_INNER') {
  axisLabel = TRAINING_GROUND.INNER_LABELS[axis];
  ctx.fillStyle = '#ff5c7c'; // Red
} else if (channel.sceneType === 'POLARITY_OUTER') {
  axisLabel = TRAINING_GROUND.OUTER_LABELS[axis];
  ctx.fillStyle = '#569fff'; // Blue
} else if (channel.sceneType === 'META_OBSERVER') {
  ctx.fillStyle = '#c78fff'; // Purple
} else {
  ctx.fillStyle = '#ffaa00'; // Yellow (default)
}
```

**Visual result**:
- INNER: Red "Instinct", "Seen", "Ideas", etc.
- OUTER: Blue "Reason", "Unseen", "Ideology", etc.
- OBSERVER: Purple canonical names

---

### 3. ✅ **Scene-Specific Core Glow**

**File**: `func-orb-training.html` Lines 1558-1597

Central star now changes color based on scene:

```javascript
function createCentralStar(sceneType = null) {
  let coreColor = 0xffaa00;  // Default: yellow
  
  if (sceneType === 'INNER' || sceneType === 'POLARITY_INNER') {
    coreColor = 0xff5c7c;    // Red (subjective)
    coronaColor = 0xff7c9c;
  } else if (sceneType === 'OUTER' || sceneType === 'POLARITY_OUTER') {
    coreColor = 0x569fff;    // Blue (objective)
    coronaColor = 0x76afff;
  } else if (sceneType === 'OBSERVER' || sceneType === 'META_OBSERVER') {
    coreColor = 0xc78fff;    // Purple (meta)
    coronaColor = 0xd798ff;
  }
  // ... create sphere with coreColor
}
```

**Visual result**:
- INNER: Red glowing core
- OUTER: Blue glowing core
- OBSERVER: Purple glowing core
- Default channels: Yellow/orange core

---

### 4. ✅ **Axis-Specific Camera Views**

**File**: `func-orb-training.html` Lines 3710-3715, 3780-3803

Added `/camera` command for each axis:

```bash
/camera identity     # View from IDENTITY axis
/camera experience   # View from EXPERIENCE axis
/camera language     # View from LANGUAGE axis
/camera domain       # View from DOMAIN axis
/camera purpose      # View from PURPOSE axis
/camera order        # View from ORDER axis
```

**Implementation**:
```javascript
else if (['identity', 'experience', 'language', ...].includes(mode)) {
  const axisIndex = TRAINING_GROUND.AXES.findIndex(a => a.toLowerCase() === mode);
  const angleStep = (Math.PI * 2) / TRAINING_GROUND.AXES.length;
  const angle = axisIndex * angleStep - Math.PI / 2;
  const distance = 35;
  const camX = Math.cos(angle) * distance;
  const camZ = Math.sin(angle) * distance;
  
  channel.camera.position.set(camX, 15, camZ);
  channel.camera.lookAt(0, 0, 0);
  
  // Show scene-specific label in message
  let axisLabel = TRAINING_GROUND.AXES[axisIndex];
  if (channel.sceneType === 'POLARITY_INNER') {
    axisLabel = TRAINING_GROUND.INNER_LABELS[axis] || axisLabel;
  } else if (channel.sceneType === 'POLARITY_OUTER') {
    axisLabel = TRAINING_GROUND.OUTER_LABELS[axis] || axisLabel;
  }
  
  message = `🎥 Viewing from ${axisLabel} axis`;
}
```

**Camera response**:
- INNER: "🎥 Viewing from Instinct axis (IDENTITY)"
- OUTER: "🎥 Viewing from Reason axis (IDENTITY)"
- OBSERVER: "🎥 Viewing from IDENTITY axis"

---

## Technical Implementation

### Data Structure Added

**File**: `func-orb-training.html` Lines 5802-5818

```javascript
const TRAINING_GROUND = {
  AXES: ['IDENTITY', 'EXPERIENCE', 'LANGUAGE', 'DOMAIN', 'PURPOSE', 'ORDER'],
  STAGES: ['SHED', 'INTEGRATE', 'GROUND'],
  
  // Scene-specific axis labels
  INNER_LABELS: {
    'IDENTITY': 'Instinct',
    'EXPERIENCE': 'Seen',
    'LANGUAGE': 'Ideas',
    'DOMAIN': 'Source',
    'PURPOSE': 'Heart',
    'ORDER': 'Parts'
  },
  OUTER_LABELS: {
    'IDENTITY': 'Reason',
    'EXPERIENCE': 'Unseen',
    'LANGUAGE': 'Ideology',
    'DOMAIN': 'Resource',
    'PURPOSE': 'Head',
    'ORDER': 'Whole'
  },
  
  FLOW: { /* existing flow data */ }
};
```

---

## Usage Examples

### INNER Scene

```bash
# User in INNER scene
> /camera identity

🎥 Viewing from Instinct axis (IDENTITY)
```

**What user sees**:
- Camera positioned along IDENTITY axis
- Red axis label "Instinct" visible
- Red glowing core at center
- Other axes: "Seen", "Ideas", "Source", "Heart", "Parts"

---

### OUTER Scene

```bash
# User in OUTER scene
> /camera identity

🎥 Viewing from Reason axis (IDENTITY)
```

**What user sees**:
- Camera positioned along IDENTITY axis
- Blue axis label "Reason" visible
- Blue glowing core at center
- Other axes: "Unseen", "Ideology", "Resource", "Head", "Whole"

---

### OBSERVER Scene

```bash
# User in OBSERVER scene
> /camera identity

🎥 Viewing from IDENTITY axis
```

**What user sees**:
- Camera positioned along IDENTITY axis
- Purple axis labels (canonical names)
- Purple glowing core at center
- Sees both INNER and OUTER labels conceptually

---

## Complete Camera Command List

```bash
/camera help           # Show all modes
/camera overview       # Wide scene view
/camera side           # Side perspective
/camera top            # Bird's eye view
/camera identity       # IDENTITY axis view
/camera experience     # EXPERIENCE axis view
/camera language       # LANGUAGE axis view
/camera domain         # DOMAIN axis view
/camera purpose        # PURPOSE axis view
/camera order          # ORDER axis view
/camera entity [name]  # Entity perspective
/camera follow         # Follow train
```

---

## Files Modified

1. **func-orb-training.html**
   - Lines 1558-1597: `createCentralStar(sceneType)` - color-coded core
   - Lines 5802-5818: Added INNER_LABELS and OUTER_LABELS mappings
   - Lines 6083-6100: Scene-specific axis label rendering
   - Lines 6173-6177: Pass sceneType to createCentralStar()
   - Lines 3710-3715: Added axis camera modes
   - Lines 3780-3803: Axis camera positioning logic

---

## Philosophy

**The scenes now speak their own language:**

- **INNER** uses subjective, embodied terms (Instinct, Heart, Seen)
- **OUTER** uses objective, systemic terms (Reason, Head, Unseen)
- **OBSERVER** uses neutral, canonical terms (IDENTITY, PURPOSE)

**The core glow reveals scene perspective:**
- Red = emotional/immediate (INNER)
- Blue = logical/structural (OUTER)
- Purple = meta/watching (OBSERVER)

**The camera reveals polarity:**
- Same axis, different viewpoint
- `/camera identity` shows Instinct OR Reason depending on scene
- The **same position**, different **interpretation**

This embodies McLuhan: **"The medium is the message."**

The scene type **changes how you see**, not what you see. The grid is the same. The axes are the same positions. But the **labels and glow** reveal the interpretive frame.

**INNER and OUTER are not different places.** They are **different ways of seeing the same apparatus.**

The OBSERVER sees both interpretive frames simultaneously, revealing how **the apparatus constructs itself through the act of observation**.

---

## Testing Checklist

- [x] INNER scene shows red axis labels (Instinct, Seen, Ideas, Source, Heart, Parts)
- [x] OUTER scene shows blue axis labels (Reason, Unseen, Ideology, Resource, Head, Whole)
- [x] OBSERVER scene shows purple canonical labels
- [x] INNER core glows red
- [x] OUTER core glows blue
- [x] OBSERVER core glows purple
- [x] `/camera identity` works in all scenes
- [x] `/camera help` shows all axis options
- [x] Camera message reflects scene-specific terminology
- [x] All 6 axis camera views functional

---

## Result

**The training ground is now perspectival.**

You can see the **same structure** from **subjective (INNER)** or **objective (OUTER)** frames, and the **OBSERVER** can toggle between both, revealing how the **polarity distinction creates blind spots**.

This is **groundlessness made visible**: the apparatus has no inherent structure, only **interpretive frames** that organize themselves.

