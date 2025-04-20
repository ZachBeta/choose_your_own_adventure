# Experience Node Schema

This document defines the core data structure for narrative nodes in our Choose Your Own Adventure game. Each node represents a moment in the story, capturing sensory details, internal voices, and possible choices.

## Core Structure

```json
{
  "scene": "string",
  "senses": {
    "visual": "string | null",
    "auditory": "string | null",
    "tactile": "string | null",
    "olfactory": "string | null",
    "taste": "string | null"
  },
  "voices": [
    {
      "part": "string",
      "strength": "string",
      "dialogue": "string"
    }
  ],
  "choices": [
    {
      "action": "string",
      "difficulty": "string",
      "dominantVoice": "string"
    }
  ]
}
```

## Field Descriptions

### Scene
A brief description of the current narrative moment or setting (e.g., "Waking up in a strange place", "Deep in a misty forest").

### Senses
Captures the sensory experience of the current moment. Any sense can be null if not relevant.
- `visual`: What the character sees
- `auditory`: What the character hears
- `tactile`: What the character feels
- `olfactory`: What the character smells
- `taste`: What the character tastes

### Voices
Array of internal voices/parts that comment on or react to the current situation.
- `part`: The type of voice (e.g., "Protector", "Dreamer", "Rebel")
- `strength`: How strongly this voice feels about the situation (e.g., "Whisper", "Clear", "Shouting", "Overwhelming")
- `dialogue`: What the voice is saying to the character

### Choices
Array of possible actions or decisions the player can make.
- `action`: Description of what the player can do
- `difficulty`: Plain text description of the choice's difficulty (e.g., "Easy", "Risky", "Dangerous")
- `dominantVoice`: Which internal voice most strongly advocates for this choice

## Example Node

```json
{
  "scene": "Waking up in a strange, liminal space between consciousness and dreams",
  "senses": {
    "visual": "Darkness. Then, slowly, shapes emerge in the haze.",
    "auditory": "Distant echoes, like voices underwater.",
    "tactile": "Weightlessness, then gradually, sensation returns.",
    "olfactory": null,
    "taste": null
  },
  "voices": [
    {
      "part": "Protector",
      "strength": "Urgent",
      "dialogue": "Careful now. We need to assess the situation."
    },
    {
      "part": "Dreamer",
      "strength": "Gentle",
      "dialogue": "What wonders might await? Let's find out!"
    }
  ],
  "choices": [
    {
      "action": "Stay still and observe your surroundings",
      "difficulty": "Safe",
      "dominantVoice": "Protector"
    },
    {
      "action": "Reach out toward the light",
      "difficulty": "Risky",
      "dominantVoice": "Dreamer"
    }
  ]
}
```

## History Tracking

The game maintains a rolling window of the 10 most recent nodes, storing:
1. The complete node data
2. Which choice was selected

This history provides context for narrative continuity and character development without maintaining complex ID relationships.

## Notes
- No complex ID system needed - choices are tracked by their full text
- Difficulty and voice strength are expressed in plain language for clarity
- Voice strengths can evolve naturally through gameplay
- Scene descriptions provide immediate context without needing identifiers 