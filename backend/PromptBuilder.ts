import { PlayerHistoryEntry } from './playerHistoryStore';

export interface PromptBuilderContext {
  prefix: string;
  history: PlayerHistoryEntry[];
  currentChoice: string;
  schemaString: string;
}

export class PromptBuilder {
  buildPrompt(ctx: PromptBuilderContext): string {
    const formattedHistory = ctx.history.length
      ? ctx.history.map((h, i) =>
          `  [${i + 1}]\n    Scene: ${h.scene}\n    Choice: ${h.choice}`
        ).join('\n')
      : '  (none)';

    return (
`You are an AI game master with ${ctx.prefix}.

Player history:
${formattedHistory}

The player chose option: "${ctx.currentChoice}"

Respond ONLY in valid JSON matching this schema:

${ctx.schemaString}

Do not include any explanation or extra text. Only output valid JSON.
`
    );
  }
}
