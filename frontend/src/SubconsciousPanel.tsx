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
      className={`terminal-log ${isError ? 'terminal-log-error' : ''} ${log.isStreaming ? 'terminal-log-streaming' : ''}`}
      style={{
        opacity,
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
