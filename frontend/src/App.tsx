// Entry point for React frontend

import React, { useState, useEffect, useRef } from 'react';
import Logo from './components/Logo';
import SubconsciousPanel from './SubconsciousPanel';
import ConsciousPanel from './ConsciousPanel';
import { startScene, chooseOption, SceneResponse } from './api';

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
    startScene(playerId)
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
    const chosenOption = scene.dialog.find((opt) => opt.id === optionId);
    const chosenOptionText = chosenOption ? chosenOption.text : '';
    // Show the player's choice instantly
    setHistory((prev) => [...prev, { type: 'playerChoice', text: chosenOptionText }]);
    try {
      const nextScene = await chooseOption(playerId, optionId);
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
        <Logo />
        <SubconsciousPanel history={history} loading={loading} />
      </div>
      <div className="panel conscious-panel">
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
        }
        .subconscious-panel {
          border-right: 2px solid #222;
          background: #181818;
        }
        .conscious-panel {
          background: #232323;
        }
      `}</style>
    </div>
  );
}


