/// <reference types="vite/client" />
import { ExperienceRequest } from '../types/experience';

interface ImportMetaEnv {
  VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export const createExperienceStream = () => {
  let currentController: AbortController | null = null;
  
  return {
    stream: async (request: ExperienceRequest) => {
      // Cancel any existing request
      if (currentController) {
        currentController.abort();
      }
      
      // Create a new controller for this request
      currentController = new AbortController();
      
      const url = `${API_BASE}/api/experience`;
      console.log('Making request to:', url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: currentController.signal,
      });
      
      console.log('Response:', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }
      
      return {
        reader,
        cancel: () => currentController?.abort(),
      };
    },
    
    cancel: () => currentController?.abort(),
  };
}; 