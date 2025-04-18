# Discussion Summary

This document captures the key decisions and patterns we discussed to enhance our CYOA backend.

## 1. Flavor Text & Scene Lookup
- Extracted LLM prompt prefixes into a `scenePrompts` lookup table.
- Stored a `promptPrefix` per player in `playerStates` for consistent flavor per scene.
- Added a `defaultPromptPrefix` to fall back when a scene key is missing.

status: done 

## 2. JSON Extraction & Schema Enforcement
- Used a regex (`/\{[\s\S]*\}/`) to extract raw JSON from LLM responses.
- Added error handling around `JSON.parse` to surface malformed JSON.
- Proposed integrating a schema validator (e.g. `zod` or `ajv`) to enforce required fields:
  - `monologue`: `string`
  - `thoughtCabinet`: `Array<{ part: string; text: string }>`
  - `dialog`: `Array<{ id: string; text: string; skillCheck?: { part: string; dc: number } }>`

status: started but not working correctly

## 3. Streaming LLM Responses
- Introduced `LLMClient.stream(prompt: string): AsyncGenerator<string>` to enable live streaming:
  ```ts
  async *stream(prompt) {
    const body = JSON.stringify({ model: this.model, messages: [{role:'user',content:prompt}], stream:true, temperature:0 });
    const res  = await fetch(this.endpoint, { method:'POST', headers:this.headers, body });
    for await (const chunk of res.body as any) yield chunk.toString();
  }
  ```
- In CLI, replace `await generate()` with a loop over `stream()`, accumulating chunks, printing live, then parsing full JSON at end.

status: later

## 4. Hybrid Skeleton → Parallel Fills for Thoughts
1. **Skeleton Call**: Request only:
   - `monologue` (full text)
   - `thoughtCabinetParts`: array of part names (e.g. `["Fear","Logic","Empathy"]`)
   - `dialog` options
2. **Parallel `fillThought(part)`**: For each part, spawn a prompt to fill only that thought:
   ```ts
   const prompt = `With ${prefix}, write a single thought for part="${part}".
   Respond as { "text": "…" }.`;
   ```
   - On error or malformed, fallback to `{ text: '…' }`.
3. **CLI Rendering**: Render monologue + dialog + placeholders, then fill in each thought as its promise resolves.

status: might cause us to take another path and would impact our schema and how we call the LLM

## 5. Fallback Strategies
- **Static `test_scene`**: Allows deterministic, canned responses for testing or fallback.
- **Partial Fallback**: If a field is missing (e.g. `thoughtCabinet`), render a placeholder (`…`) and keep the loop alive.
- **User‑Driven Retry**: Offer the player a “Retry” or default choice when the schema check fails.

status: partial fallback should lead to the best UX

## 6. Testing & Deterministic Playthroughs
- For `NODE_ENV==='test'`, stub out `LLMClient.generate()` to return fixtures in sequence:
  ```ts
  const fixtures = [response0, response1, response2];
  if (process.env.NODE_ENV==='test') return JSON.stringify(fixtures.shift());
  ```
- This makes snapshot tests (`.toMatchSnapshot()`) inherently reproducible, effectively “recording” playthroughs.
- Proposed an additional test style: comparing entire LLM output as string literals to simulate recorded gameplay demos.

status: started but not working correctly? it's probably good enough

## 7. CLI demo mode

- Add a `--demo` flag to `bin/cli.ts` that:
  - Enables more deterministic playthroughs
  - Attempts to play a real playthrough of choosing random options

---
Feel free to refine any section or request code scaffolding for a specific pattern above.
