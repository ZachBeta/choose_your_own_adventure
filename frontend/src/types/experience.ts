export interface Senses {
  visual: string | null;
  auditory: string | null;
  tactile: string | null;
  olfactory: string | null;
  taste: string | null;
}

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

export interface ExperienceNode {
  scene: string;
  senses: Senses;
  voices: Voice[];
  choices: Choice[];
}

export interface ExperienceRequest {
  selectedAction?: string;
}

export interface HistoryEntry {
  node: ExperienceNode;
  selectedAction: string;
} 