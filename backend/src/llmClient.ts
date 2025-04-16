import fetch from 'node-fetch';

export class LLMClient {
  model: string;
  endpoint: string;

  constructor(model = 'gemma3:12b', endpoint = 'http://localhost:11434/api/generate') {
    this.model = model;
    this.endpoint = endpoint;
  }

  async generate(prompt: string): Promise<string> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`LLM error: ${res.statusText}`);
    const data = await res.json();
    return data.response || '';
  }
}
