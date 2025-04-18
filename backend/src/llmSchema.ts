import { z } from "zod";

export const SkillCheckSchema = z.object({
  part: z.string(),
  dc: z.number(),
});

export const DialogOptionSchema = z.object({
  id: z.string(),
  text: z.string(),
  skillCheck: SkillCheckSchema.optional(),
});

export const ThoughtCabinetSchema = z.object({
  part: z.string(),
  text: z.string(),
});

export const SceneResponseSchema = z.object({
  monologue: z.string().default("..."),
  thoughtCabinet: z.array(ThoughtCabinetSchema).default([]),
  dialog: z.array(DialogOptionSchema).default([]),
  skillCheckResult: z.any().optional(), // Refine as needed for your use case
});
