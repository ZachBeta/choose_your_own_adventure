# Dialog Endpoint API Spec & Core Classes

## Endpoint: `/api/dialog`
**Method:** POST  
**Description:** Returns dialog options, thought cabinet lines, and monologue for the player's current scene, using d20 skill checks, "Parts" (Joy, Sadness, etc.), and LLM-generated content.

## API Usage

### 1. Start Scene
**Request:**
```json
{
  "playerId": "string",
  "sceneId": "string"   // or "start": true to begin a new run
}
```

### 2. Choose Dialog Option
**Request:**
```json
{
  "playerId": "string",
  "optionId": "string"
}
```

**Note:**
- The client only sends the player/session ID and either a scene to start or a dialog option to select.
- All skill checks, d20 rolls, player state, and LLM calls are handled server-side.
- The client does NOT send part scores, history, or roll results.


### Response
```json
{
  "monologue": "string",
  "thoughtCabinet": [{ "part": "Joy", "text": "..." }, ...],
  "dialog": [
    {
      "id": "string",
      "text": "string",
      "skillCheck": { "part": "Joy", "dc": 12 }
    }
  ],
  "llmLines": [ "string", ... ],
  "skillCheckResult": {
    "optionId": "string",
    "roll": 14,
    "part": "Joy",
    "partScore": 2,
    "dc": 12,
    "success": true,
    "critical": false,
    "outcomeText": "string"
  }
}
```

---

## Core Classes & Types

### `Part` (Type)
```ts
type Part = 'Joy' | 'Sadness' | 'Anger' | 'Fear' | 'Disgust';
```

### `DialogOption`
```ts
interface DialogOption {
  id: string;
  text: string;
  skillCheck?: {
    part: Part;
    dc: number;
  };
}
```

### `ThoughtCabinetLine`
```ts
interface ThoughtCabinetLine {
  part: Part;
  text: string;
}
```

### `Scene`
```ts
interface Scene {
  monologue: string;
  thoughtCabinet: ThoughtCabinetLine[];
  dialog: DialogOption[];
}
```

### `SkillCheckResult`
```ts
interface SkillCheckResult {
  optionId: string;
  roll: number;
  part: Part;
  partScore: number;
  dc: number;
  success: boolean;
  critical: boolean;
  outcomeText: string;
}
```

### `PlayerState`
```ts
interface PlayerState {
  partsState: Record<Part, number>;
  history: any[];
}
```

### `LLMClient`
- Abstraction for calling the LLM (Ollama Gemma3:12b or other models)
- Handles prompt construction and API calls

### `DialogService`
- Orchestrates dialog/scene generation, skill checks, and LLM calls
- Main entry point for `/api/dialog` logic

---

## Notes
- All endpoint fields and types are subject to extension as narrative and gameplay evolve.
- LLM integration should be abstracted for easy swapping/mocking in tests.
- d20 skill checks use standard RPG rules: 20 always succeeds, 1 always fails.

_Last updated: 2025-04-16_
