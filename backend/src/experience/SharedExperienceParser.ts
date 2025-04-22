// SharedExperienceParser.ts
// Parses the new shared experience LLM response format: { scene: string, choices: [{ id, text }] }

export interface SharedExperienceNode {
  scene: string;
  choices: { id: string; text: string }[];
}

export class SharedExperienceParser {
  static parse(llmResponse: string): SharedExperienceNode {
    let parsed: any;
    try {
      // Remove code fences if present
      const cleaned = llmResponse.replace(/```json|```/gi, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // fallback: try to extract JSON object from text
      const match = llmResponse.match(/\{[\s\S]*\}/);
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
      scene: parsed.scene || '...',
      choices: Array.isArray(parsed.choices)
        ? parsed.choices.map((c: any) => ({
            id: c.id || '',
            text: c.text || ''
          }))
        : []
    };
  }
}
