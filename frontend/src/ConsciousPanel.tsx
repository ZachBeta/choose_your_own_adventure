import React, { RefObject } from "react";
import { LogEntry, Option } from "./App";

type ConsciousPanelProps = {
  history: LogEntry[];
  error: string | null;
  chatRef: RefObject<HTMLDivElement>;
  onChoose: (optionId: string) => void;
  loading: boolean;
  isLuigiMode: boolean;
  setIsLuigiMode: (v: (prev: boolean) => boolean) => void;
};

export default function ConsciousPanel({
  history,
  error,
  chatRef,
  onChoose,
  loading,
  isLuigiMode,
  setIsLuigiMode,
}: ConsciousPanelProps) {
  return (
    <div style={{ padding: "1rem", height: "100vh", display: "flex", flexDirection: "column" }}>

      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", background: "#181820", padding: "1rem", borderRadius: 12, marginBottom: 12 }}>
        {history.map((entry, i) => {
          if (entry.type === "monologue") {
            return (
              <div key={i} style={{ color: "#fff", marginBottom: 8, fontFamily: "monospace" }}>
                <span role="img" aria-label="monologue">📜</span> {entry.text}
              </div>
            );
          }
          if (entry.type === "playerChoice") {
            return (
              <div key={i} style={{ color: "#ffb347", marginBottom: 8, fontFamily: "monospace" }}>
                <span role="img" aria-label="choice">🧑</span> <b>You chose:</b> {entry.text}
              </div>
            );
          }
          if (entry.type === "thoughtCabinet") {
            return (
              <div key={i} style={{ color: "#b3e6ff", background: "#222a35", padding: 8, borderRadius: 8, marginBottom: 8, fontFamily: "monospace" }}>
                <b>Thought Cabinet:</b>
                <ul style={{ marginLeft: 20 }}>
                  {entry.thoughts.map((thought, idx) => (
                    <li key={idx} style={{ marginBottom: 2 }}>
                      <span style={{ color: "#7fffd4", fontWeight: "bold" }}>{thought.part}:</span> {thought.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          if (entry.type === "dialogOptions") {
            return (
              <div key={i} style={{ color: "#fff", marginBottom: 8, fontFamily: "monospace" }}>
                <b>Options:</b>
                <ul style={{ marginLeft: 24 }}>
                  {(entry.options as Option[]).map((opt, j) => (
                    <li key={j}>
                      <button
                        style={{ marginRight: 8 }}
                        disabled={loading}
                        onClick={() => onChoose(opt.id)}
                      >
                        {opt.text}
                        {opt.skillCheck && (
                          <span style={{ color: "#00ff00", marginLeft: 4 }}>
                            [Skill: {opt.skillCheck.part}, DC: {opt.skillCheck.dc}]
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div style={{ marginTop: "auto" }}>
        <button onClick={() => setIsLuigiMode((v) => !v)}>
          {isLuigiMode ? "Stop Luigi Mode" : "Start Luigi Mode"}
        </button>
      </div>
    </div>
  );
}
