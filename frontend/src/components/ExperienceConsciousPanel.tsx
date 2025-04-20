import React, { RefObject } from 'react';
import { ExperienceNode } from '../types/experience';
import { COLOR_PALETTE } from '../colorPalette';
import { TerminalButton } from '../UI/Button';

interface ConsciousPanelProps {
  currentNode: ExperienceNode | null;
  onChoose: (action: string) => void;
  loading: boolean;
  chatRef: RefObject<HTMLDivElement>;
}

export function ExperienceConsciousPanel({ currentNode, onChoose, loading, chatRef }: ConsciousPanelProps) {
  if (!currentNode) return null;

  return (
    <div className="conscious-panel terminal-container">
      {/* Scene Description */}
      <section className="scene terminal-section animate-panel">
        <h2 className="terminal-header">
          Current Scene
        </h2>
        <p className="terminal-text typewriter">
          {currentNode.scene}
        </p>
      </section>

      {/* Sensory Details */}
      <section className="senses terminal-section animate-panel">
        <h3 className="terminal-subheader">
          Sensory Details
        </h3>
        <div className="terminal-grid">
          {Object.entries(currentNode.senses).map(([sense, detail]) => (
            detail && (
              <div 
                key={sense}
                className="terminal-card glow-effect"
              >
                <h4 className="terminal-card-header">
                  {sense}
                </h4>
                <p className="terminal-card-text">
                  {detail}
                </p>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Internal Voices */}
      <section className="voices terminal-section animate-panel" ref={chatRef}>
        <h3 className="terminal-subheader">
          Internal Voices
        </h3>
        <div className="terminal-stack">
          {currentNode.voices.map((voice, index) => (
            <div
              key={index}
              className="terminal-card glow-effect"
            >
              <div className="terminal-card-header-row">
                <span className="terminal-accent">
                  {voice.part}
                </span>
                <span className="terminal-strength">
                  {voice.strength}
                </span>
              </div>
              <p className="terminal-card-text">
                {voice.dialogue}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Choices */}
      <section className="choices terminal-section animate-panel">
        <h3 className="terminal-subheader">
          Your Choices
        </h3>
        <div className="terminal-choices">
          {currentNode.choices.map((choice, index) => (
            <TerminalButton
              key={index}
              onClick={() => onChoose(choice.action)}
              disabled={loading}
              variant={index === 0 ? 'accent' : 'primary'}
              className="terminal-choice-button"
            >
              <span className="terminal-choice-action">{choice.action}</span>
              <div className="terminal-choice-meta">
                <span>{choice.dominantVoice}</span>
                <span className="terminal-difficulty">
                  {choice.difficulty}
                </span>
              </div>
            </TerminalButton>
          ))}
        </div>
      </section>
    </div>
  );
} 