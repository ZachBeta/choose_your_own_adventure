// Entry point for React frontend

import React, { useState, useEffect, useRef } from 'react';
import Logo from './components/Logo';
// import ScenePanel from './components/ScenePanel';
import { startScene, chooseOption, SceneResponse } from './api';

function randomPlayerId() {
  return 'player_' + Math.random().toString(36).slice(2, 10);
}

// --- Types ---
type Option = {
  id: string;
  text: string;
  skillCheck?: { part: string; dc: number };
};

type LogEntry =
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
  }, [history]);

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
    try {
      const chosenOption = scene.dialog.find((opt) => opt.id === optionId);
      const chosenOptionText = chosenOption ? chosenOption.text : '';
      const nextScene = await chooseOption(playerId, optionId);
      setScene(nextScene);
      setHistory((prev) => [
        ...prev,
        { type: 'playerChoice', text: chosenOptionText },
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
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <Logo />
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setIsLuigiMode((v) => !v)}>
            {isLuigiMode ? 'Stop Luigi Mode' : 'Start Luigi Mode'}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', background: '#181820', padding: '1rem', borderRadius: 12, marginBottom: 12 }}>
          {history.map((entry, i) => {
            if (entry.type === 'monologue') {
              return (
                <div key={i} style={{ color: '#fff', marginBottom: 8, fontFamily: 'monospace' }}>
                  <span role="img" aria-label="monologue">📜</span> {entry.text}
                </div>
              );
            }
            if (entry.type === 'thoughtCabinet') {
              return (
                <div key={i} style={{ color: '#00ffff', marginBottom: 8, fontFamily: 'monospace' }}>
                  <span role="img" aria-label="thought">🧠</span> <b>Thought Cabinet:</b>
                  <ul style={{ marginLeft: 24 }}>
                    {entry.thoughts.map((t, j) => (
                      <li key={j}><b>{t.part}:</b> {t.text}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            if (entry.type === 'playerChoice') {
              return (
                <div key={i} style={{ color: '#39FF14', fontWeight: 'bold', marginBottom: 8, fontFamily: 'monospace' }}>
                  <span role="img" aria-label="choice">💬</span> &gt; {entry.text}
                </div>
              );
            }
            if (entry.type === 'dialogOptions') {
              return (
                <div key={i} style={{ color: '#aaa', marginBottom: 8, fontFamily: 'monospace' }}>
                  <span role="img" aria-label="options">🕹️</span> <b>Dialog Options:</b>
                  <ul style={{ marginLeft: 24 }}>
                    {entry.options.map((opt, j) => (
                      <li key={opt.id}>
                        [{j}] {opt.text}
                        {opt.skillCheck && (
                          <span style={{ color: '#ff00ff', marginLeft: 8 }}>
                            ({opt.skillCheck.part}DC={opt.skillCheck.dc})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return null;
          })}
        </div>
        {scene && scene.dialog.length > 0 && (
          <div style={{ marginTop: 0 }}>
            {scene.dialog.map(option => (
              <button
                key={option.id}
                onClick={() => handleChoose(option.id)}
                style={{
                  marginRight: 8,
                  background: '#282838',
                  color: '#fff',
                  border: '2px solid #39FF14',
                  borderRadius: 8,
                  padding: '0.5rem 1rem',
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  cursor: loading || isLuigiMode ? 'not-allowed' : 'pointer',
                  opacity: loading || isLuigiMode ? 0.5 : 1
                }}
                disabled={loading || isLuigiMode}
              >
                {option.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
