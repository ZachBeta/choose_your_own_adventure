import { DialogService } from './dialogService';
import { LLMClient } from './llmClient';

async function main() {
  const dialogService = new DialogService({ llm: new LLMClient() });
  const res = await dialogService.startScene({ playerId: 'player1', sceneId: 'scene_intro' });
  console.log('Monologue:', res.monologue);
  console.log('Thought Cabinet:', res.thoughtCabinet);
  console.log('Dialog Options:', res.dialog);
  console.log('LLM Output:', res.llmLines);
}

main().catch(err => {
  console.error('Error during LLM call:', err);
  process.exit(1);
});
