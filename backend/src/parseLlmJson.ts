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
  // REPAIR dialog options before validation
  parsed = repairDialogOptions(parsed);
  // Validate and fill defaults
  return SceneResponseSchema.parse(parsed);
}

function repairDialogOptions(scene: any) {
  if (!scene || !Array.isArray(scene.dialog)) return scene;
  scene.dialog = scene.dialog.map((opt: any, idx: number) => {
    if (opt.skillCheck) {
      let repaired = false;
      let part = opt.skillCheck.part;
      let dc = opt.skillCheck.dc;
      if (typeof part !== "string") {
        part = "...";
        repaired = true;
      }
      if (typeof dc !== "number") {
        dc = -1;
        repaired = true;
      }
      if (repaired) {
        console.error("Repaired malformed skillCheck in dialog option", { idx, opt });
      }
      return { ...opt, skillCheck: { part, dc } };
    }
    return opt;
  });
  return scene;
}

