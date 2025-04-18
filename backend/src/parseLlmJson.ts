import { SceneResponseSchema } from "./llmSchema";

/**
 * Strips code fences and tries to extract JSON from LLM output, then validates with Zod.
 */
export function parseLlmSceneResponse(raw: string) {
  // Remove code fences if present
  let cleaned = raw.replace(/```json|```/gi, "").trim();
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // fallback: try to extract JSON object from text
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = {};
      }
    } else {
      parsed = {};
    }
  }
  // Validate and fill defaults
  return SceneResponseSchema.parse(parsed);
}
