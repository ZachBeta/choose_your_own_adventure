// Entry point for React frontend

import React, { useState, useEffect, useRef } from 'react';
import Logo from './components/Logo';
import ScenePanel from './components/ScenePanel';
import { startScene, chooseOption, SceneResponse } from './api';

function randomPlayerId() {
  return 'player_' + Math.random().toString(36).slice(2, 10);
}

export default function App() {
  const [scene, setScene] = useState<SceneResponse | null>(null);
  const [playerId] = useState(() => randomPlayerId());
  const [isLuigiMode, setIsLuigiMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const luigiTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start the scene on mount
  useEffect(() => {
    setLoading(true);
    startScene(playerId, 'scene_intro')
      .then(setScene)
      .catch((e) => setError('Failed to load scene: ' + e.message))
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
    setLoading(true);
    setError(null);
    try {
      const nextScene = await chooseOption(playerId, optionId);
      setScene(nextScene);
    } catch (e: any) {
      setError('Failed to choose option: ' + e.message);
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
      <div style={{ flex: 1, padding: '1rem' }}>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        {loading && <div>Loading...</div>}
        <ScenePanel scene={scene} onChoose={handleChoose} disableChoices={loading || isLuigiMode} />
      </div>
    </div>
  );
}
