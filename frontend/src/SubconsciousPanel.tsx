import React from "react";
import { LogEntry } from "./App";

type SubconsciousPanelProps = {
  history: LogEntry[];
  loading: boolean;
};

export default function SubconsciousPanel({ history, loading }: SubconsciousPanelProps) {
  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ color: "#00ffff", fontFamily: "monospace" }}>Subconscious</h2>
      {history
        .filter((entry) => entry.type === "thoughtCabinet")
        .map((entry, i) => (
          <div key={i} style={{ color: "#00ffff", marginBottom: 8, fontFamily: "monospace" }}>
            <span role="img" aria-label="thought">🧠</span> <b>Thought Cabinet:</b>
            <ul style={{ marginLeft: 24 }}>
              {(entry as any).thoughts.map((t: any, j: number) => (
                <li key={j}>{t.part}: {t.text}</li>
              ))}
            </ul>
          </div>
        ))}
      {loading && (
        <div style={{ color: "#999", marginTop: 16 }}>Thinking...</div>
      )}
    </div>
  );
}
