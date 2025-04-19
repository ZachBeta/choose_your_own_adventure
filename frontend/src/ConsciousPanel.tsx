import React, { RefObject } from "react";
import { LogEntry, Option } from "./App";
import { COLOR_PALETTE } from "./colorPalette";
import { TerminalButton } from "./UI/Button";

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
      <div ref={chatRef} style={{
        flex: 1,
        overflowY: 'auto',
        background: COLOR_PALETTE.background,
        padding: '1.25rem',
        borderRadius: 10,
        border: `2px solid ${COLOR_PALETTE.lowlight}`,
        marginBottom: 14,
        fontFamily: 'monospace',
        color: COLOR_PALETTE.foreground,
        boxShadow: '0 2px 16px 0 #1118',
      }}>
        {history.map((entry, i) => {
          if (entry.type === 'monologue') {
            return (
              <div key={i} style={{ color: COLOR_PALETTE.foreground, marginBottom: 10, fontSize: 17, lineHeight: 1.6, letterSpacing: 0.02 }}>
                <span role="img" aria-label="monologue" style={{ marginRight: 6, opacity: 0.7 }}>📜</span>
                <span style={{ fontWeight: 600 }}>{entry.text}</span>
              </div>
            );
          }
          if (entry.type === 'playerChoice') {
            return (
              <div key={i} style={{ color: COLOR_PALETTE.accent, marginBottom: 10, fontWeight: 600, fontFamily: 'monospace' }}>
                <span role="img" aria-label="choice" style={{ marginRight: 6, opacity: 0.7 }}>🧑</span>
                <b>You chose:</b> {entry.text}
              </div>
            );
          }
          if (entry.type === 'thoughtCabinet') {
            return (
              <div key={i} style={{
                color: COLOR_PALETTE.blue,
                background: COLOR_PALETTE.lowlight,
                padding: '0.75em 1em',
                borderRadius: 7,
                marginBottom: 10,
                fontFamily: 'monospace',
                border: `1.5px solid ${COLOR_PALETTE.highlight}`,
              }}>
                <b style={{ color: COLOR_PALETTE.highlight }}>Thought Cabinet:</b>
                <ul style={{ marginLeft: 22, marginTop: 6, marginBottom: 0 }}>
                  {entry.thoughts.map((thought, idx) => (
                    <li key={idx} style={{ marginBottom: 2, lineHeight: 1.5 }}>
                      <span style={{ color: COLOR_PALETTE.yellow, fontWeight: 700 }}>{thought.part}:</span> {thought.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }
          if (entry.type === "dialogOptions") {
            return (
              <div key={i} style={{ marginBottom: 16, fontFamily: 'monospace' }}>
                <b style={{ color: COLOR_PALETTE.accent, letterSpacing: 1 }}>Options:</b>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  {(entry.options as Option[]).map((opt, j) => (
                    <TerminalButton
                      key={opt.id}
                      onClick={() => onChoose(opt.id)}
                      variant={loading ? 'disabled' : (j === 0 ? 'accent' : 'primary')}
                      disabled={loading}
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        fontSize: 17,
                        fontWeight: 500,
                        letterSpacing: 0.03,
                        opacity: loading ? 0.7 : 1,
                      }}
                      tabIndex={loading ? -1 : 0}
                    >
                      {opt.text}
                      {opt.skillCheck && (
                        <span style={{ color: COLOR_PALETTE.accent, marginLeft: 10, fontSize: 14 }}>
                          [Skill: {opt.skillCheck.part}, DC: {opt.skillCheck.dc}]
                        </span>
                      )}
                    </TerminalButton>
                  ))}
                </div>
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
