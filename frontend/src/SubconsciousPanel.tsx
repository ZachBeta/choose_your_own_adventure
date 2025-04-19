import React, { useEffect, useRef, useState } from "react";

type SubconsciousLog = { text: string; isStreaming: boolean; id: string };

type SubconsciousPanelProps = {
  logs: SubconsciousLog[];
};

function SubconsciousLogEntry({ log }: { log: SubconsciousLog }) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!log.isStreaming) {
      const timeout = setTimeout(() => setOpacity(0.15), 2000); // fade after 2s
      return () => clearTimeout(timeout);
    } else {
      setOpacity(1);
    }
  }, [log.isStreaming]);

  const isError = log.text.startsWith('API ERROR');
  return (
    <pre
      style={{
        transition: "opacity 1.5s",
        opacity,
        fontFamily: "monospace",
        fontSize: "1rem",
        color: isError ? "#ff4444" : "#00ffff",
        fontWeight: isError ? "bold" : "normal",
        textShadow: isError ? "0 0 4px #ff4444" : undefined,
        background: "transparent",
        margin: 0,
        pointerEvents: "none",
        userSelect: "text",
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {log.text}
    </pre>
  );
}

export default function SubconsciousPanel({ logs }: SubconsciousPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length]);

  return (
    <div style={{ flex: 1, minHeight: 0, overflowY: "auto", position: "relative", padding: "1rem" }}>
      {logs.map((log) => (
        <SubconsciousLogEntry key={log.id} log={log} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
