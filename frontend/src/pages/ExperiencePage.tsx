import React, { useEffect, useRef, useState } from 'react';
import { ExperienceNode, HistoryEntry } from '../types/experience';
import { ExperienceConsciousPanel } from '../components/ExperienceConsciousPanel';
import SubconsciousPanel from '../SubconsciousPanel';
import { createExperienceStream } from '../api/experienceStream';
import { COLOR_PALETTE } from '../colorPalette';

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
  
  const chatRef = useRef<HTMLDivElement>(null);
  const experienceStream = React.useMemo(() => createExperienceStream(), []);
  const requestIdRef = useRef(0);

  const addSubconsciousLog = (text: string, isStreaming: boolean = true) => {
    setSubconsciousLogs(logs => [...logs, {
      text,
      isStreaming,
      id: `${Date.now()}-${Math.random()}`
    }]);
  };

  const fetchNextNode = async (selectedAction?: string) => {
    const currentRequestId = ++requestIdRef.current;
    setLoading(true);

    try {
      addSubconsciousLog(`Request: ${JSON.stringify({ selectedAction })}`);
      
      const { reader, cancel } = await experienceStream.stream({ selectedAction });
      let accumulatedData = '';

      while (true) {
        const { done, value } = await reader.read();
        
        // Ignore if a newer request has started
        if (currentRequestId !== requestIdRef.current) {
          cancel();
          break;
        }
        
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        accumulatedData += chunk;
        
        try {
          // Try to parse accumulated data as complete JSON
          const node = JSON.parse(accumulatedData);
          setCurrentNode(node);
          
          addSubconsciousLog(`Response: ${JSON.stringify(node)}`, false);
          
          if (selectedAction) {
            setHistory(prev => [...prev, { 
              node: currentNode!, 
              selectedAction 
            }]);
          }
        } catch (e) {
          // Incomplete JSON, continue accumulating
          continue;
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Failed to fetch next node:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addSubconsciousLog(`Error: ${errorMessage}`, false);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNextNode();
  }, []);

  return (
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
  );
} 