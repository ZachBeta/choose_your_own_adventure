import { SceneResponseSchema } from "./llmSchema";
import { zodToJsonSchema } from "zod-to-json-schema";

export function getSceneResponseJsonSchemaString() {
  const schemaObj = zodToJsonSchema(SceneResponseSchema, "SceneResponse");
  return JSON.stringify(schemaObj, null, 2);
}
