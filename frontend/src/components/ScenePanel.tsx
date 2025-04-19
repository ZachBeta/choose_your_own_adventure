import React from 'react';
import type { SceneResponse } from '../api';

interface Props { scene: SceneResponse | null; }

export default function ScenePanel({ scene }: Props) {
  if (!scene) return null;
  return (
    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
      <h2>Monologue</h2>
      <p>{scene.monologue}</p>
      {scene.thoughtCabinet?.length > 0 && (
        <>
          <h3>Thought Cabinet</h3>
          <ul>
            {scene.thoughtCabinet.map((t, i) => (
              <li key={i}>{t.text || JSON.stringify(t)}</li>
            ))}
          </ul>
        </>
      )}
      <h3>Dialog Options</h3>
      <ul>
        {scene.dialog.map(o => (
          <li key={o.id}>{o.text}</li>
        ))}
      </ul>
    </div>
  );
}
