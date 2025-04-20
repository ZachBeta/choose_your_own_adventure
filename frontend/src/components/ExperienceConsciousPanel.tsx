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
    <div className="conscious-content">
      {/* Scene Description */}
      <section className="scene animate-panel">
        <h2 className="terminal-header">Current Scene</h2>
        <p className="terminal-text typewriter">{currentNode.scene}</p>
      </section>

      {/* Sensory Details */}
      <section className="senses animate-panel">
        <h3 className="terminal-header">Sensory Details</h3>
        <div className="terminal-stack">
          {Object.entries(currentNode.senses).map(([sense, detail]) => (
            detail && (
              <div key={sense} className="sense-item">
                <h4 className="sense-name">{sense}</h4>
                <p className="sense-detail">{detail}</p>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Internal Voices */}
      <section className="voices animate-panel" ref={chatRef}>
        <h3 className="terminal-header">Internal Voices</h3>
        <div className="terminal-stack">
          {currentNode.voices.map((voice, index) => (
            <div key={index} className="voice-item">
              <div className="voice-header">
                <span className="voice-part">{voice.part}</span>
                <span className="voice-strength">{voice.strength}</span>
              </div>
              <p className="voice-dialogue">{voice.dialogue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Choices */}
      <section className="choices animate-panel">
        <h3 className="terminal-header">Your Choices</h3>
        <div className="choice-stack">
          {currentNode.choices.map((choice, index) => (
            <TerminalButton
              key={index}
              onClick={() => onChoose(choice.action)}
              disabled={loading}
              variant="primary"
              className="choice-button"
            >
              <span className="choice-action">{choice.action}</span>
              <div className="choice-meta">
                <span>{choice.dominantVoice}</span>
                <span className="choice-difficulty">{choice.difficulty}</span>
              </div>
            </TerminalButton>
          ))}
        </div>
      </section>
    </div>
  );
} 