// Shared Experience Types for Discord Choose-Your-Own-Adventure

export interface SharedExperienceRequest {
  channel_id: string; // Discord channel ID (required)
  channel_name: string; // Name of the Discord channel
  thread_id?: string; // Discord thread ID (optional)
  thread_name?: string; // Name of the Discord thread (optional)
  user_id: string; // Discord user ID of the sender
  user_name: string; // Discord username of the sender
  action?: string; // The choice, command, or action taken by the user (optional)
  content?: string; // Raw message content from Discord (optional)
}

export interface SharedExperienceChoice {
  id: string;
  text: string;
}

export interface SharedExperienceHistoryEntry {
  user_id: string;
  user_name: string;
  action: string;
  timestamp: string; // ISO date-time
}

export interface SharedExperienceResponse {
  scene: string;
  choices: SharedExperienceChoice[];
  participants: string[]; // List of user IDs or names
  history: SharedExperienceHistoryEntry[];
}
