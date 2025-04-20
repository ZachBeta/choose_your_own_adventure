import React, { useEffect, useRef, useState } from 'react';
import { ExperienceNode, HistoryEntry } from '../types/experience';
import { ExperienceConsciousPanel } from '../components/ExperienceConsciousPanel';
import SubconsciousPanel from '../SubconsciousPanel';
import { createExperienceStream } from '../api/experienceStream';
import { COLOR_PALETTE } from '../colorPalette';
import { SUBCONSCIOUS_PALETTE } from '../subconsciousPalette';
import { SubconsciousButton } from '../UI/SubconsciousButton';

// Add type checking for process.env
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

export function ExperiencePage() {
  const [currentNode, setCurrentNode] = useState<ExperienceNode | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [subconsciousLogs, setSubconsciousLogs] = useState<Array<{text: string, isStreaming: boolean, id: string}>>([]);
  const [isAwake, setIsAwake] = useState(false);
  const [currentStreamingContent, setCurrentStreamingContent] = useState('');
  const currentStreamingId = useRef<string | null>(null);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const experienceStream = React.useMemo(() => createExperienceStream(), []);
  const requestIdRef = useRef(0);

  const addSubconsciousLog = (text: string, isStreaming: boolean = true) => {
    const processedText = text
      .replace(/\r/g, '')
      .replace(/\n+/g, ' ')
      .replace(/^Streaming: /, '');

    if (isStreaming) {
      // If we're streaming, update or create the streaming entry
      setCurrentStreamingContent(prev => prev + processedText);
      if (!currentStreamingId.current) {
        currentStreamingId.current = `${Date.now()}-${Math.random()}`;
        setSubconsciousLogs(logs => [...logs, {
          text: processedText,
          isStreaming: true,
          id: currentStreamingId.current!
        }]);
      } else {
        // Update the existing streaming entry
        setSubconsciousLogs(logs => logs.map(log => 
          log.id === currentStreamingId.current
            ? { ...log, text: log.text + processedText }
            : log
        ));
      }
    } else {
      // For non-streaming logs, create a new entry and reset streaming state
      currentStreamingId.current = null;
      setCurrentStreamingContent('');
      setSubconsciousLogs(logs => [...logs, {
        text: processedText,
        isStreaming: false,
        id: `${Date.now()}-${Math.random()}`
      }]);
    }
  };

  const fetchNextNode = async (selectedAction?: string) => {
    console.log('fetchNextNode called with:', { selectedAction });
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    
    // Reset streaming state for new request
    currentStreamingId.current = null;
    setCurrentStreamingContent('');

    try {
      addSubconsciousLog(`Request: ${JSON.stringify({ selectedAction })}`, true);
      
      console.log('About to call experienceStream.stream');
      const { reader, cancel } = await experienceStream.stream({ selectedAction });
      console.log('Got reader from stream');

      while (true) {
        const { done, value } = await reader.read();
        console.log('Read from stream:', { done, hasValue: !!value });
        
        // Ignore if a newer request has started
        if (currentRequestId !== requestIdRef.current) {
          console.log('Cancelling outdated request');
          cancel();
          break;
        }
        
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        console.log('Decoded chunk:', chunk);
        
        const messages = chunk
          .split('\n\n')
          .filter(msg => msg.trim())
          .map(msg => msg.replace('data: ', ''));

        console.log('Parsed messages:', messages);

        for (const message of messages) {
          try {
            const data = JSON.parse(message);
            console.log('Parsed message data:', data);
            
            switch (data.type) {
              case 'status':
                addSubconsciousLog(`Status: ${data.status}`, true);
                break;
              
              case 'chunk':
                addSubconsciousLog(data.content, true);
                break;
              
              case 'complete':
                setCurrentNode(data.node);
                addSubconsciousLog(`Response: ${JSON.stringify(data.node)}`, false);
                
                if (selectedAction && currentNode) {
                  setHistory(prev => [...prev, { 
                    node: currentNode, 
                    selectedAction 
                  }]);
                }
                break;
              
              case 'error':
                addSubconsciousLog(`Error: ${data.error}`, false);
                break;
            }
          } catch (e) {
            console.error('Error parsing message:', e);
            continue;
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      console.error('Failed to fetch next node:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addSubconsciousLog(`Error: ${errorMessage}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Handle wake up interaction
  const handleWakeUp = () => {
    console.log('Wake up handler called');
    if (!isAwake) {
      console.log('Setting isAwake to true and calling fetchNextNode');
      setIsAwake(true);
      fetchNextNode();
    }
  };

  // Handle keyboard events for wake up
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key);
      if (!isAwake && (e.key === 'Enter' || e.key === ' ')) {
        handleWakeUp();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isAwake]);

  return (
    <>
      {!isAwake && (
        <div className="wake-up-modal">
          <div className="wake-up-content">
            <div className="wake-up-text">WAKE UP</div>
            <SubconsciousButton 
              variant="accent" 
              onClick={handleWakeUp}
              style={{
                marginTop: '2rem',
                fontSize: '1.5rem',
                padding: '1rem 3rem',
              }}
            >
              Enter
            </SubconsciousButton>
          </div>
          <style>{`
            .wake-up-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background: ${SUBCONSCIOUS_PALETTE.midnightBlack};
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
            }
            
            .wake-up-content {
              text-align: center;
              animation: fadeIn 1s ease-out;
            }
            
            .wake-up-text {
              font-family: var(--font-terminal);
              font-size: 4rem;
              color: ${SUBCONSCIOUS_PALETTE.starlightWhite};
              margin-bottom: 1rem;
              animation: terminalGlow 2s infinite;
              letter-spacing: 0.2em;
            }
            
            .wake-up-subtext {
              font-family: var(--font-terminal);
              font-size: 1.5rem;
              color: ${SUBCONSCIOUS_PALETTE.auroraTeal};
              opacity: 0.8;
              margin-bottom: 2rem;
            }
            
            @keyframes fadeIn {
              from { 
                opacity: 0;
                transform: translateY(-20px);
              }
              to { 
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
      
      <div className="terminal-split-container">
        <div className="terminal-panel conscious-terminal-panel">
          <div className="terminal-panel-header conscious-terminal-header">Experience</div>
          <ExperienceConsciousPanel
            currentNode={currentNode}
            onChoose={fetchNextNode}
            loading={loading}
            chatRef={chatRef}
          />
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="terminal-panel subconscious-terminal-panel">
            <div className="terminal-panel-header subconscious-terminal-header">Subconscious</div>
            <SubconsciousPanel logs={subconsciousLogs} />
          </div>
        )}
      </div>
    </>
  );
} 