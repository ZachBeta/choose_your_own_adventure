import { useState, useRef, useCallback, useEffect } from 'react';
import { ExperienceNode, HistoryEntry } from '../types/experience';
import { createExperienceStream } from '../api/experienceStream';

interface UseExperienceStreamOptions {
  onStatus?: (status: string) => void;
  onChunk?: (content: string) => void;
  onComplete?: (node: ExperienceNode) => void;
  onError?: (error: string) => void;
}

export function useExperienceStream(options: UseExperienceStreamOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const experienceStream = useRef(createExperienceStream());

  const fetchNextNode = useCallback(async (selectedAction?: string) => {
    console.log('fetchNextNode called with:', { selectedAction });
    const currentRequestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      options.onStatus?.(`Request: ${JSON.stringify({ selectedAction })}`);
      
      console.log('About to call experienceStream.stream');
      const { reader, cancel } = await experienceStream.current.stream({ selectedAction });
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
                options.onStatus?.(`Status: ${data.status}`);
                break;
              
              case 'chunk':
                options.onChunk?.(`Streaming: ${data.content}`);
                break;
              
              case 'complete':
                options.onComplete?.(data.node);
                break;
              
              case 'error':
                options.onError?.(data.error);
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
      options.onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Cleanup function to handle component unmount
  useEffect(() => {
    return () => {
      experienceStream.current.cleanup?.();
    };
  }, []);

  return {
    isLoading,
    fetchNextNode
  };
} 