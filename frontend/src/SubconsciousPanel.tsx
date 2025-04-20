import React, { useEffect, useRef, useState } from "react";
import { COLOR_PALETTE } from "./colorPalette";

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
      className={`terminal-log ${isError ? 'terminal-log-error' : ''}`}
      style={{
        opacity,
        transition: 'opacity 1s ease-in-out',
        fontFamily: 'var(--font-terminal)',
        fontSize: '1rem',
        color: 'var(--terminal-text)',
        background: 'transparent',
        margin: 0,
        padding: '0.25rem 0',
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
    <div className="terminal-log-container">
      {logs.map((log) => (
        <SubconsciousLogEntry key={log.id} log={log} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
