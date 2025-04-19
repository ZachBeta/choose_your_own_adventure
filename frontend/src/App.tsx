// Entry point for React frontend

import React, { useState, useEffect, useRef } from 'react';
import Logo from './components/Logo';
import SubconsciousPanel from './SubconsciousPanel';
import ConsciousPanel from './ConsciousPanel';
import { SceneResponse } from "./types/openapi";
import { apiRequest } from "./apiClient";

function randomPlayerId() {
  return 'player_' + Math.random().toString(36).slice(2, 10);
}

// --- Types ---
export type Option = {
  id: string;
  text: string;
  skillCheck?: { part: string; dc: number };
};

export type LogEntry =
  | { type: 'monologue'; text: string }
  | { type: 'thoughtCabinet'; thoughts: Array<{ part: string; text: string }> }
  | { type: 'playerChoice'; text: string }
  | { type: 'dialogOptions'; options: Option[] };

function buildLogEntries(scene: SceneResponse, lastChoice?: string): LogEntry[] {
  const entries: LogEntry[] = [];
  if (lastChoice) entries.push({ type: 'playerChoice', text: lastChoice });
  if (scene.monologue) entries.push({ type: 'monologue', text: scene.monologue });
  if (scene.thoughtCabinet && scene.thoughtCabinet.length)
    entries.push({ type: 'thoughtCabinet', thoughts: scene.thoughtCabinet });
  if (scene.dialog && scene.dialog.length)
    entries.push({ type: 'dialogOptions', options: scene.dialog });
  return entries;
}

export default function App() {
  // ...existing state...
  const [subconsciousLogs, setSubconsciousLogs] = useState<
    { text: string; isStreaming: boolean; id: string }[]
  >([]);

  const addSubconsciousLog = (text: string, isStreaming: boolean) => {
    setSubconsciousLogs((logs) => [
      ...logs,
      { text, isStreaming, id: Date.now() + Math.random().toString() }
    ]);
  };

  const chatRef = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [playerId] = useState(() => randomPlayerId());
  const [isLuigiMode, setIsLuigiMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const luigiTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Autoscroll to latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [history]); // This will trigger autoscroll on every history update, including Luigi mode


  // Start the scene on mount
  useEffect(() => {
    setLoading(true);
    apiRequest<SceneResponse>(
      {
        method: "POST",
        url: "/api/scene",
        data: { playerId }
      },
      addSubconsciousLog
    )
      .then((scene) => {
        setScene(scene);
        setHistory(buildLogEntries(scene));
      })
      .catch((e) => {
        setError('Failed to load scene');
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [playerId]);

  // Luigi mode: auto-advance if enabled
  useEffect(() => {
    if (!isLuigiMode || !scene || scene.dialog.length === 0) return;
    // Pick a random option (or always first for deterministic)
    luigiTimeout.current = setTimeout(() => {
      handleChoice(scene.dialog[0].id);
    }, 1200);
    return () => {
      if (luigiTimeout.current) clearTimeout(luigiTimeout.current);
    };
    // eslint-disable-next-line
  }, [isLuigiMode, scene]);

  const handleChoice = async (optionId: string) => {
    if (!scene) return;
    setLoading(true);
    setError(null);
    try {
      const nextScene = await apiRequest<SceneResponse>(
        {
          method: "POST",
          url: "/api/dialog",
          data: { playerId, optionId }
        },
        addSubconsciousLog
      );
      setScene(nextScene);
      setHistory((prev) => [
        ...prev,
        ...buildLogEntries(nextScene)
      ]);
    } catch (e) {
      setError('Failed to choose option');
    } finally {
      setLoading(false);
    }
  };

  const handleChoose = (optionId: string) => {
    if (!loading && !isLuigiMode) {
      handleChoice(optionId);
    }
  };

  return (
    <div className="split-container">
      <div className="panel subconscious-panel">
        <div className="panel-header subconscious-header">Subconscious</div>
        <SubconsciousPanel logs={subconsciousLogs} />
      </div>
      <div className="panel conscious-panel">
        <div className="panel-header conscious-header">Conscious</div>
        <ConsciousPanel
          history={history}
          error={error}
          chatRef={chatRef}
          onChoose={handleChoose}
          loading={loading}
          isLuigiMode={isLuigiMode}
          setIsLuigiMode={setIsLuigiMode}
        />
      </div>
      <style>{`
        .split-container {
          display: flex;
          height: 100vh;
        }
        .panel {
          flex: 1 1 50%;
          overflow: auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem 1.5rem 1rem 1.5rem;
        }
        .subconscious-panel {
          background: #141f2b;
        }
        .conscious-panel {
          background: #21142b;
        }
        .panel-header {
          font-family: monospace;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: bold;
          letter-spacing: 0.04em;
        }
        .subconscious-header {
          color: #00ffff;
        }
        .conscious-header {
          color: #ff66cc;
        }
      `}</style>
    </div>
  );
}


