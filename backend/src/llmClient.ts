import fetch from 'node-fetch';
import { execSync } from 'child_process';

let OPENROUTER_API_KEY: string | undefined;
try {
  OPENROUTER_API_KEY = execSync('lean_vault get cyoa-gemma3-12b', { encoding: 'utf-8' }).trim() || undefined;
} catch {
  OPENROUTER_API_KEY = undefined;
}

export class LLMClient {
  model: string;
  endpoint: string;
  headers: Record<string, string>;

  constructor() {
    if (OPENROUTER_API_KEY) {
      this.model = 'google/gemma-3-12b-it';
      this.endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      this.headers = {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      };
    } else {
      this.model = 'gemma3:12b';
      this.endpoint = 'http://localhost:11434/api/generate';
      this.headers = { 'Content-Type': 'application/json' };
    }
  }

  async generate(prompt: string): Promise<string> {
    const body = OPENROUTER_API_KEY
      ? JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
        })
      : JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        });
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    if (!res.ok) throw new Error(`LLM error: ${res.statusText}`);
    const data = await res.json();
    if (OPENROUTER_API_KEY) {
      return data.choices?.[0]?.message?.content || '';
    }
    return data.response || '';
  }
}
