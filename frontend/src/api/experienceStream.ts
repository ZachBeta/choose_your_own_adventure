import { ExperienceRequest } from '../types/experience';

export const createExperienceStream = () => {
  const controller = new AbortController();
  
  return {
    stream: async (request: ExperienceRequest) => {
      // Cancel any existing request
      controller.abort();
      
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
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
        cancel: () => controller.abort(),
      };
    },
    
    cancel: () => controller.abort(),
  };
}; 