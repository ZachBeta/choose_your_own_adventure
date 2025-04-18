import { describe, it, expect } from "vitest";
import { parseLlmSceneResponse } from "./parseLlmJson";

describe("parseLlmSceneResponse", () => {
  it("parses plain JSON", () => {
    const raw = '{"monologue":"test","thoughtCabinet":[],"dialog":[]}';
    const result = parseLlmSceneResponse(raw);
    expect(result.monologue).toBe("test");
    expect(result.thoughtCabinet).toEqual([]);
    expect(result.dialog).toEqual([]);
  });

  it("parses JSON in code fences", () => {
    const raw = "```json\n{\"monologue\":\"test2\",\"thoughtCabinet\":[],\"dialog\":[]}\n```";
    const result = parseLlmSceneResponse(raw);
    expect(result.monologue).toBe("test2");
  });

  it("parses JSON with extra text", () => {
    const raw = "Here is your output:\n{\"monologue\":\"test3\",\"thoughtCabinet\":[],\"dialog\":[]}\nThanks!";
    const result = parseLlmSceneResponse(raw);
    expect(result.monologue).toBe("test3");
  });

  it("returns defaults for malformed input", () => {
    const raw = "not json at all";
    const result = parseLlmSceneResponse(raw);
    expect(result.monologue).toBe("...");
    expect(result.thoughtCabinet).toEqual([]);
    expect(result.dialog).toEqual([]);
  });

  it("fills defaults for missing fields", () => {
    const raw = '{"monologue":"partial"}';
    const result = parseLlmSceneResponse(raw);
    expect(result.monologue).toBe("partial");
    expect(result.thoughtCabinet).toEqual([]);
    expect(result.dialog).toEqual([]);
  });
});
