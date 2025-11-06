# Forensic Summary: CB vs ORB Evidence

## What I Built

Created 4 code-evidence documents:

1. **forensic-cb-evidence.md** - CB.HTML actual functions, variables, API calls
2. **forensic-orb-evidence.md** - ORB actual code (reveals NO LLM integration)
3. **comparative-evidence-table.md** - Side-by-side comparison from real code
4. **test-harness.md** - Runnable test code to validate all claims

## Key Findings from Actual Code

### CB.HTML Reality

**LLM Integration:** 3 distinct API functions
- `llmReply()` (line 2551) - Main agent speech
- `callModeler()` (line 2630) - Belief inference  
- `callStrategyPlanner()` (line 2808) - Option generation

**State:** Global `orchestratorState` object with:
- `beliefs` object (44 numeric values across 4 profiles)
- `log` array (append-only event history)
- `memo` string (Observer's summary)

**Agents:** NOT objects/classes - just role strings ('ALLY', 'KEEPER')

**Orchestration:** `Sequencer` class with 7 phases (MEMO → OBSERVE → MODEL → PLAN → DRAFT → SPEAK → SEND)

**Prompt Construction:** `buildSystemPrompt()` embeds beliefs as JSON strings

**Data Flow:**
```
ALLY speaks → callModeler() → beliefs updated → 
buildSystemPrompt('KEEPER') → beliefOfAlly embedded → 
KEEPER's LLM sees model → completion influenced → repeat
```

### FUNC-ORB Reality

**LLM Integration:** NONE in core loop

**State:** Global `appState` with:
- `channels` Map (3D scenes)
- `gridEntities` Map (entity positions)
- `observerState` object (stats, NOT used in decisions)

**Agents:** Channels (UI viewports), not conversational agents

**Orchestration:** Event-driven keyboard handlers (no central sequencer)

**"Prompt" Fields:** Documentation strings, never sent to API

**Data Flow:**
```
User presses key → avatar.row updated → 
position lookup in dataset → radar values assigned → 
canvas redrawn → NO FEEDBACK LOOP
```

## The Critical Difference

**CB:** Observer's models ENTER agent prompts → recursive causality  
**ORB:** Observer's stats DISPLAY to user → linear visualization

**CB is generative (LLM creates text).  
ORB is representational (data lookups).**

They share surface patterns (3 agents, radars, phases) but are fundamentally different software types.

## Run The Tests

All claims validated with executable console code in `test-harness.md`.

## Files Created

- `forensic-cb-evidence.md` (comprehensive)
- `forensic-orb-evidence.md` (comprehensive)
- `comparative-evidence-table.md` (detailed comparison)
- `test-harness.md` (runnable tests)
- `FORENSIC-SUMMARY.md` (this file)
