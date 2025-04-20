import { ExperienceNode } from '../../../shared/types/experience';
import { v4 as uuidv4 } from 'uuid';

export class ExperienceNodeParser {
  static parse(node: string): ExperienceNode {
    let parsed;
    try {
      // Remove code fences if present
      const cleaned = node.replace(/```json|```/gi, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // fallback: try to extract JSON object from text
      const match = node.match(/\{[\s\S]*\}/);
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

    return {
      id: uuidv4(),
      scene: parsed.scene || "...",
      senses: parsed.senses || {
        visual: null,
        auditory: null,
        tactile: null,
        olfactory: null,
        taste: null
      },
      voices: parsed.voices || [],
      choices: parsed.choices || [{
        action: "...",
        difficulty: "...",
        dominantVoice: "..."
      }]
    };
  }
} 