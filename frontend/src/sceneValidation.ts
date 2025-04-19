import { components } from "../../shared/types/openapi";
type SceneResponse = components["schemas"]["SceneResponse"];

// Utility: Strict types for UI
export type StrictDialogOption = { id: string; text: string; skillCheck?: { part: string; dc: number } | null };
export type StrictSceneResponse = {
  monologue: string;
  thoughtCabinet: { part: string; text: string }[];
  dialog: StrictDialogOption[];
  skillCheckResult?: unknown;
};

// Mapping/validation function
export function toStrictSceneResponse(scene: SceneResponse): StrictSceneResponse | null {
  if (!scene.monologue || !Array.isArray(scene.dialog)) return null;
  try {
    return {
      monologue: scene.monologue,
      thoughtCabinet: Array.isArray(scene.thoughtCabinet)
        ? (scene.thoughtCabinet as NonNullable<SceneResponse["thoughtCabinet"]>).map(tc => ({
            part: tc?.part ?? "",
            text: tc?.text ?? "",
          }))
        : [],
      dialog: Array.isArray(scene.dialog)
        ? (scene.dialog as NonNullable<SceneResponse["dialog"]>).map(opt => ({
            id: opt?.id ?? "",
            text: opt?.text ?? "",
            skillCheck: opt?.skillCheck ?? null,
          }))
        : [],
      skillCheckResult: scene.skillCheckResult,
    };
  } catch {
    return null;
  }
}
