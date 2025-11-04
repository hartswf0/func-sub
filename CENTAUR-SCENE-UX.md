# Centaur Scene UX - Minimal & Controlled

**Created**: Nov 4, 2025, 6:27am  
**Status**: ✅ IMPLEMENTED

---

## Design Philosophy

**"More minimal and controlled"** - Clean welcome screens for INNER/OUTER/OBSERVER with:
- ✅ Tetrad arrows visible (↗ ENHANCE, ↙ REVERSE, ↑ RETRIEVE, ↓ OBSOLESCE)
- ✅ SHED/INTEGRATE/GROUND buttons prominent
- ✅ Prompt-craft buttons (chat perspective, see scene, show balance)
- ✅ Cross-talk buttons (convince INNER/OUTER, mediate)

---

## Three Scene Types

### ⚡ INNER (Subjective Apparatus)

**Focus**: Instinct, Seen, Ideas, Source, Heart, Parts  
**Color**: Red (#ff5c7c)

**Action Buttons**:
- 🔴 **SHED** → Eliminate emotional noise
- ⚪ **INTEGRATE** → Connect subjective elements
- 🔵 **GROUND** → Stabilize inner experience

**Prompt-Craft Buttons**:
- 💬 **Chat This Perspective** → "From your INNER perspective, what do you notice?"
- 👁️ **What You See** → "What's visible in your INNER apparatus?"
- 📊 **Show Balance** → Display INNER axis values
- ⚡→🌐 **Convince OUTER** → Initiate persuasion dialogue

---

### 🌐 OUTER (Objective Apparatus)

**Focus**: Reason, Unseen, Ideology, Resource, Head, Whole  
**Color**: Blue (#569fff)

**Action Buttons**:
- 🔴 **SHED** → Eliminate structural excess
- ⚪ **INTEGRATE** → Synthesize formal systems
- 🔵 **GROUND** → Institutionalize structure

**Prompt-Craft Buttons**:
- 💬 **Chat This Perspective** → "From your OUTER perspective, what do you notice?"
- 👁️ **What You See** → "What's visible in your OUTER apparatus?"
- 📊 **Show Balance** → Display OUTER axis values
- 🌐→⚡ **Convince INNER** → Initiate persuasion dialogue

---

### 👁️ OBSERVER (Meta-Layer)

**Focus**: Cross-scene analysis, imbalance detection, blind spot revelation  
**Color**: Purple (#c78fff)

**Action Buttons**:
- 📊 **FULL STATUS** → "show observer" (complete state report)
- 🔍 **ANALYZE** → "/analyze current apparatus state"
- ⚠️ **BLIND SPOTS** → "what's missing? reveal blind spots"

**Prompt-Craft Buttons**:
- ⚡ **INNER View** → "What is the INNER apparatus doing?"
- 🌐 **OUTER View** → "What is the OUTER apparatus doing?"
- ⚖️ **Imbalance Report** → "Analyze current imbalance between INNER and OUTER"
- 🤝 **Mediate Dialog** → Coordinate cross-talk between polarities

---

## Button Behaviors

### Quick Action Buttons (SHED/INTEGRATE/GROUND)

**For INNER/OUTER**:
```javascript
// Clicking "SHED" in INNER sends:
"Help me choose an axis for @shed inner. What needs attention right now in the INNER apparatus?"

// Then user can respond with specific axis:
@shed IDENTITY inner
```

**For OBSERVER**:
```javascript
// Clicking "FULL STATUS" sends:
"show observer"

// Clicking "ANALYZE" sends:
"/analyze current apparatus state"
```

---

### Prompt-Craft Buttons

**Chat This Perspective**:
```
"From your [INNER/OUTER] perspective, what do you notice about the current state? 
What feels important from where you stand?"
```

**What You See**:
```
"What do you see in your [INNER/OUTER] apparatus right now? 
Describe what's visible to you, what's hidden, what's active."
```

**Show Balance**:
```
"Show me my [INNER/OUTER] balance across all axes. What patterns emerge?"
```

---

### Cross-Talk Coordination

**⚡→🌐 Convince OUTER** (from INNER):
1. INNER scene: "I need to convince the OUTER apparatus of something. What subjective truth should I emphasize?"
2. *[1 second delay]*
3. OUTER scene: "The INNER apparatus is trying to persuade me. What am I hearing? Do I trust emotional urgency over structural logic?"

**🌐→⚡ Convince INNER** (from OUTER):
1. OUTER scene: "I need to convince the INNER apparatus of something. What objective pattern should I present?"
2. *[1 second delay]*
3. INNER scene: "The OUTER apparatus is trying to persuade me. What am I feeling? Do I trust formal structure over lived experience?"

**🤝 Mediate Dialog** (from OBSERVER):
```
"Analyze the current tension between INNER and OUTER. 
Where are they talking past each other? What does each exclude?"
```

---

## Visual Design

### Color Coding
- **INNER**: Red/Pink gradient (#ff5c7c)
- **OUTER**: Blue gradient (#569fff)
- **OBSERVER**: Purple gradient (#c78fff)

### Layout Structure
```
┌─────────────────────────────────────┐
│ ⚡ INNER · Subjective Apparatus     │ ← Title
├─────────────────────────────────────┤
│ Instinct, Seen, Ideas...           │ ← Description
├─────────────────────────────────────┤
│ [🔴 SHED] [⚪ INT] [🔵 GND]        │ ← Operations
├─────────────────────────────────────┤
│ [💬 Chat] [👁️ See] [📊 Bal] [→🌐] │ ← Prompt-Craft
├─────────────────────────────────────┤
│ Tetrad Arrows: ↗ ↙ ↑ ↓             │ ← Reference
└─────────────────────────────────────┘
```

### Grid Layout
- **Operations**: 3 columns (SHED, INTEGRATE, GROUND)
- **Prompt-Craft**: 2x2 grid (4 buttons)
- **Footer**: Tetrad arrow reference

---

## Implementation Details

### File Modified
`func-orb-training.html`

### Functions Added

**Lines 1880-2006**: `addCentaurWelcomeMessages()`
- Creates HTML panels for INNER/OUTER/OBSERVER
- Adds action buttons with onclick handlers
- Minimal, controlled, color-coded design

**Lines 2018-2050**: `window.quickAction(scene, action)`
- Handles SHED/INTEGRATE/GROUND button clicks
- Routes to appropriate scene
- Pre-fills input with contextual prompt

**Lines 2052-2087**: `window.promptCraft(scene, craftType)`
- Handles perspective/scene/balance buttons
- Pre-fills input with crafted prompts
- Routes cross-talk to separate handler

**Lines 2089-2123**: `handleCrossTalk(type)`
- Coordinates INNER↔OUTER dialogue
- Automatic timed responses (1 second delay)
- OBSERVER mediation support

---

## User Workflows

### Workflow 1: Place INNER Node
1. Select "INNER" from scene dropdown
2. Click **🔴 SHED** button
3. AI suggests: "IDENTITY needs shedding - eliminate emotional noise"
4. User types: `@shed IDENTITY inner`
5. Node placed, observer tracks

### Workflow 2: Cross-Talk Persuasion
1. In INNER scene, click **⚡→🌐 Convince OUTER**
2. INNER scene asks: "What subjective truth should I emphasize?"
3. User: "The feeling of urgency is real, structure can't capture it"
4. *[1 second auto-delay]*
5. OUTER scene auto-prompts: "Do I trust emotional urgency over logic?"
6. User switches to OUTER, responds with structural counterpoint

### Workflow 3: Observer Analysis
1. Select "OBSERVER" from dropdown
2. Click **🔍 ANALYZE**
3. Observer reports imbalances, patterns, blind spots
4. Click **🤝 Mediate Dialog**
5. Observer synthesizes tension between INNER/OUTER

---

## Testing Checklist

- [ ] Load page → Centaur scenes appear in dropdown
- [ ] Select INNER → Clean welcome panel with buttons
- [ ] Click **🔴 SHED** → Input pre-fills with prompt
- [ ] Click **💬 Chat This Perspective** → Perspective prompt sent
- [ ] Click **⚡→🌐 Convince OUTER** → Both scenes get prompts
- [ ] Verify 1-second delay between INNER and OUTER auto-prompts
- [ ] Select OBSERVER → Purple panel with analysis buttons
- [ ] Click **📊 FULL STATUS** → `show observer` executed
- [ ] Click **🤝 Mediate Dialog** → Cross-talk mediation prompt
- [ ] Verify tetrad arrows visible in footer of each panel

---

## Philosophy

**The centaur scenes create productive tension:**

- **INNER** sees only subjective truth (blind to structure)
- **OUTER** sees only objective patterns (blind to experience)
- **OBSERVER** sees both but can't intervene directly

**Cross-talk buttons make visible:**
- How polarities exclude each other
- What each perspective hides
- Where persuasion fails (talking past each other)
- The apparatus organizing itself through dialogue

**"Convince INNER" and "Convince OUTER" buttons embody the tetrad:**
- **ENHANCE**: Amplify your polarity's strength
- **REVERSE**: Flip at extremes (urgency → paralysis)
- **RETRIEVE**: Bring back what the other polarity lost
- **OBSOLESCE**: Show what the other polarity makes obsolete

The interface makes **groundlessness interactive** - no final synthesis, only recursive negotiation.

