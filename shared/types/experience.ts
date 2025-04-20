/**
 * Core experience node structure representing a moment in the narrative
 */
export interface ExperienceNode {
  /** Description of the current narrative moment */
  scene: string;
  
  /** Sensory details of the current moment */
  senses: Senses;
  
  /** Internal voices commenting on the situation */
  voices: Voice[];
  
  /** Available actions for the player */
  choices: Choice[];
}

/**
 * Sensory information about the current moment
 */
export interface Senses {
  visual: string | null;
  auditory: string | null;
  tactile: string | null;
  olfactory: string | null;
  taste: string | null;
}

/**
 * An internal voice that comments on the situation
 */
export interface Voice {
  /** The type of voice (e.g., "Protector", "Dreamer") */
  part: string;
  
  /** How strongly this voice feels (e.g., "Whisper", "Urgent") */
  strength: string;
  
  /** What the voice is saying */
  dialogue: string;
}

/**
 * A possible action the player can take
 */
export interface Choice {
  /** Description of what the player can do */
  action: string;
  
  /** Plain text description of risk (e.g., "Safe", "Risky") */
  difficulty: string;
  
  /** Which voice advocates for this choice */
  dominantVoice: string;
}

/**
 * Request to generate the next experience node
 */
export interface ExperienceRequest {
  /** Rolling window of previous experiences (max 10) */
  history?: HistoryEntry[];
}

/**
 * Entry in the experience history
 */
export interface HistoryEntry {
  /** The complete node data */
  node: ExperienceNode;
  
  /** The action that was selected */
  selectedAction: string;
}

/**
 * API response types
 */
export type ExperienceResponse = ExperienceNode;

// Type guards and utilities
export const isValidVoice = (voice: unknown): voice is Voice => {
  return typeof voice === 'object' && voice !== null
    && 'part' in voice
    && 'strength' in voice
    && 'dialogue' in voice;
};

/**
 * Common voice parts that can emerge during the narrative
 * Note: This list is not exhaustive, new voices can emerge organically
 */
export const CommonVoiceParts = [
  'Protector',
  'Dreamer',
  'Rebel',
  'Analyst',
  'Caretaker',
  'Trickster',
] as const;

export type VoicePart = typeof CommonVoiceParts[number];

/**
 * Standard difficulty levels for choices
 * Note: These are guidelines, natural language variations are allowed
 */
export const DifficultyLevels = [
  'Safe',
  'Easy',
  'Moderate',
  'Risky',
  'Dangerous',
] as const;

export type Difficulty = typeof DifficultyLevels[number];

// Example usage:
/*
const exampleNode: ExperienceNode = {
  scene: "Waking up in a strange, liminal space between consciousness and dreams",
  senses: {
    visual: "Darkness. Then, slowly, shapes emerge in the haze.",
    auditory: "Distant echoes, like voices underwater.",
    tactile: "Weightlessness, then gradually, sensation returns.",
    olfactory: null,
    taste: null
  },
  voices: [
    {
      part: "Protector",
      strength: "Urgent",
      dialogue: "Careful now. We need to assess the situation."
    },
    {
      part: "Dreamer",
      strength: "Gentle",
      dialogue: "What wonders might await? Let's find out!"
    }
  ],
  choices: [
    {
      action: "Stay still and observe your surroundings",
      difficulty: "Safe",
      dominantVoice: "Protector"
    },
    {
      action: "Reach out toward the light",
      difficulty: "Risky",
      dominantVoice: "Dreamer"
    }
  ]
};
*/ 