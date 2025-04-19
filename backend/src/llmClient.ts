import fetch from 'node-fetch';
import { execSync } from 'child_process';

// Read OpenRouter API key from environment, fallback to Lean Vault
let OPENROUTER_API_KEY: string | undefined = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  try {
    OPENROUTER_API_KEY = execSync('lean_vault get cyoa-gemma3-12b', { encoding: 'utf-8' }).trim() || undefined;
  } catch {
    OPENROUTER_API_KEY = undefined;
  }
}

import fs from 'fs';
import { logInfo } from './logger';


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
    logInfo('>>> LLM PROMPT:', prompt);
    const body = OPENROUTER_API_KEY
      ? JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0
        })
      : JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          temperature: 0
        });
    let response: string;
    if (OPENROUTER_API_KEY) {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body,
      });
      const json = await res.json();
      response = json.choices[0]?.message?.content || '';
    } else {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: this.headers,
        body,
      });
      const json = await res.json();
      response = json.response || '';
    }

    logInfo('<<< LLM RESPONSE:', response);
    return response;
  }
}
