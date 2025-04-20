# Wake Up Node & Experience History Schema

This document defines the data structure for the character creation "wake up" sequence and the ongoing experience history for the Choose Your Own Adventure game.

## Experience Node Schema

Each node in the experience tree represents a moment in the narrative, whether internal (character thoughts) or external (world events).

```json
{
  "nodeId": "string",
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
      "strength": "number",
      "text": "string"
    }
  ],
  "choices": [
    {
      "id": "string",
      "text": "string",
      "dominantVoice": "string",
      "leadingTo": "string"
    }
  ]
}
```

note: love this

## Wake Up Sequence

The character creation process begins with the "wake up" sequence - a series of internal dialogue nodes that establish the character's dominant voices/archetypes.

### Initial Wake Up Node

```json
{
  "nodeId": "wake_up_1",
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
      "strength": 1,
      "text": "Careful now. We need to assess the situation."
    },
    {
      "part": "Dreamer",
      "strength": 1,
      "text": "What wonders might await? Let's find out!"
    },
    {
      "part": "Rebel",
      "strength": 1,
      "text": "Whatever the rules are here, I say we break them."
    }
  ],
  "choices": [
    {
      "id": "choice_protector_1",
      "text": "Stay alert. We should be cautious.",
      "dominantVoice": "Protector",
      "leadingTo": "wake_up_2a"
    },
    {
      "id": "choice_dreamer_1",
      "text": "Reach out toward the light.",
      "dominantVoice": "Dreamer",
      "leadingTo": "wake_up_2b"
    },
    {
      "id": "choice_rebel_1",
      "text": "Push against whatever's containing us.",
      "dominantVoice": "Rebel",
      "leadingTo": "wake_up_2c"
    }
  ]
}
```

note: this should be generated fresh every new game - maybe use scene ID if we want to cache things

Each choice during the wake-up sequence:
1. Strengthens the associated voice
2. Leads to a new node with more internal dialogue
3. Eventually establishes the character's dominant archetypes

## Player History Structure

The player's history is a record of their journey through the experience tree:

```json
{
  "playerId": "string",
  "characterState": {
    "parts": {
      "Protector": "number",
      "Dreamer": "number",
      "Rebel": "number",
      "Analyst": "number",
      "Caretaker": "number"
    },
    "dominantArchetype": "string"
  },
  "gameState": {
    "currentNodeId": "string",
    "pathTaken": ["string"]
  },
  "mechanicsState": {
    "currentTemperature": "number"
  },
  "narrativeContext": {
    "keyMemories": ["string"]
  }
}
```

so it sounds like this is a concrete and separate thing from the existing structure, I think maybe we don't use this yet

## Memory Export/Import

Players can export their state as a `memories.json` file with the following structure:

```json
{
  "characterState": {
    "parts": {
      "Protector": 3,
      "Dreamer": 1,
      "Rebel": 2,
      "Analyst": 0,
      "Caretaker": 1
    },
    "dominantArchetype": "Protector-Rebel"
  },
  "gameState": {
    "currentNodeId": "scene_127",
    "pathTaken": ["wake_up_1", "wake_up_2a", "wake_up_3b", "scene_1", "scene_45", "scene_127"]
  },
  "mechanicsState": {
    "currentTemperature": 0.5
  },
  "narrativeContext": {
    "keyMemories": [
      "Chose self-preservation at the river crossing",
      "Challenged authority in the market square"
    ]
  }
}
```

note: skip for now

## Context Window

For narrative continuity, the game maintains a sliding context window of recent nodes:

```javascript
// Context structure for current scene
{
  "currentNode": { /* full current node */ },
  "recentContext": [
    {
      "senses": "Summary of sensory information",
      "dominantVoices": ["Voice1", "Voice2"],
      "choiceMade": "Text of the choice that was selected"
    },
    // More recent context entries...
  ]
}
```

note: I think we just keep a simple log of nodes, in the future we can store/query them, but for now a rolling window of 10 or so nodes, we can pick a better window size after some experiments

## Voice/Part Types

The standard voice/part types include:

- **Protector**: Focused on safety, security, and caution
- **Dreamer**: Imaginative, hopeful, seeks new possibilities
- **Rebel**: Questions authority, breaks rules, seeks freedom
- **Analyst**: Logical, strategic, detail-oriented
- **Caretaker**: Compassionate, nurturing, helps others
- **Trickster**: Playful, unpredictable, enjoys chaos

Additional voices can be added as needed for specific narrative contexts. 

note: we don't need to be prescriptive here, it will emerge "organically"