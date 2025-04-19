import axios from 'axios';

// Types match backend /api/dialog and /api/player/state
export interface SceneResponse {
  monologue: string;
  thoughtCabinet: Array<{ text?: string; [key: string]: any }>;
  dialog: Array<{ id: string; text: string; skillCheck?: any }>;
  skillCheckResult?: any;
  llmLines: string[];
}

export interface PlayerState {
  history: Array<{ monologue: string; choiceId?: string }>;
}

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function startScene(playerId: string, sceneId: string) {
  const { data } = await axios.post<SceneResponse>(
    `${BASE}/api/dialog`,
    { playerId, sceneId }
  );
  return data;
}

export async function chooseOption(playerId: string, optionId: string) {
  const { data } = await axios.post<SceneResponse>(
    `${BASE}/api/dialog`,
    { playerId, optionId }
  );
  return data;
}

export async function getPlayerState(playerId: string) {
  const { data } = await axios.get<PlayerState>(
    `${BASE}/api/player/state`,
    { params: { playerId } }
  );
  return data;
}
