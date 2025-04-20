import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExperiencePage } from './pages/ExperiencePage';

// Ensure global styles are applied
import './styles/global.css';

function App() {
  return (
    <React.StrictMode>
      <ExperiencePage />
    </React.StrictMode>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(<App />); 