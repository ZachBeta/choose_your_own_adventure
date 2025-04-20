export interface Voice {
  part: string;
  strength: string;
  dialogue: string;
}

export interface Choice {
  action: string;
  difficulty: string;
  dominantVoice: string;
}

export interface Senses {
  visual: string | null;
  auditory: string | null;
  tactile: string | null;
  olfactory: string | null;
  taste: string | null;
}

export interface ExperienceNode {
  id: string;
  scene: string;
  senses: Senses;
  voices: Voice[];
  choices: Choice[];
}

export interface HistoryEntry {
  node: ExperienceNode;
  selectedAction: string;
}

/**
 * Request to generate the next experience node
 */
export interface ExperienceRequest {
  selectedAction: string | null;
} 