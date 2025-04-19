// Entry point for React frontend

import React from 'react';
import Logo from './components/Logo';
import ScenePanel from './components/ScenePanel';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '200px', background: '#f0f0f0', padding: '1rem' }}>
        <Logo />
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
        <ScenePanel scene={null} />
      </div>
    </div>
  );
}
