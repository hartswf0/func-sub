# Information Foraging Framework for Multi-Agent Code Tracing

## Patch Model Architecture

**Information Foraging Theory Applied to Code Analysis:**
- **Patches**: Modules, functions, event handlers (information-rich zones)
- **Foraging**: Systematic exploration within patches until diminishing returns
- **Scent**: Code signatures (function names, event types) that predict information gain
- **Between-patch transitions**: Following data flows across module boundaries
- **Enrichment metric**: Number of hidden dependencies/state changes revealed per query

---

## Phase 1: Entry Point Discovery

### Prompt Series A: Input Origins

**A1. Primary Input Creation**
```
Q: List every location where user input or system-generated prompts are CREATED (not just passed).
Include: Variable declarations, form handlers, default values, initialization functions.
Format: {file, line, variable_name, creation_context, initial_value_source}
```

**A2. Input Transformation Chain**
```
Q: For each input from A1, trace its transformation path to API submission.
At each step, identify: sanitization, wrapping, concatenation, template insertion.
Format: {input_id, step_number, function_name, transformation_type, code_snippet}
```

**A3. Hidden Input Mutations**
```
Q: What implicit mutations occur to inputs?
Search for: event.preventDefault(), input.value modifications, localStorage reads, closure captures.
Reveal: Silent state that enters prompts without explicit user action.
```

---

## Phase 2: Token & Word Granularity Tracing

### Prompt Series B: Token-Level Tracking

**B1. Token Count Locations**
```
Q: Where are tokens counted, logged, or displayed?
Search for: 'token', 'max_tokens', 'length', '.split()', response.usage
Map: {location, count_type (request/response/display), aggregation_logic}
```

**B2. Word-Level Data Structures**
```
Q: Which data structures store per-word or per-token metadata?
Look for: arrays of word objects, token annotations, position tracking, timing data.
Format: {structure_name, fields, update_frequency, consumers}
```

**B3. Token Flow Events**
```
Q: What events are triggered by token state changes?
Trace: typing indicators, progress bars, character count updates, cost calculations.
Chain: event_name → handler → state_update → UI_render
```

### Execution on CB.HTML

**B1 Execution:**
