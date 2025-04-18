#!/usr/bin/env ts-node
import promptSync from 'prompt-sync'
import { DialogService } from '../src/dialogService'
import { LLMClient } from '../src/llmClient'
import { InputStrategy, UserInputStrategy, LuigiInputStrategy } from '../src/inputStrategy'
import fs from 'fs';

const prompt = promptSync({ sigint: true })
const args = process.argv.slice(2)
const isLuigi = args.includes('--mario-party-luigi') || args.includes('--luigi')

// Set up timestamped log file
const logFileName = `playthru-${new Date().toISOString().replace(/:/g, '-')}.log`;
const logStream = fs.createWriteStream(logFileName, { flags: 'a' });
function logToFile(...args: any[]) {
  logStream.write(args.map(String).join(' ') + '\n');
}

async function main() {
  let player: string, scene: string
  let inputStrategy: InputStrategy
  if (isLuigi) {
    player = 'luigi'
    scene = 'mario party'
    inputStrategy = new LuigiInputStrategy()
    console.log('[MARIO PARTY LUIGI MODE]')
  } else {
    player = prompt('Player ID: ') || 'player1'
    scene  = prompt('Scene ID:  ') || 'scene_intro'
    inputStrategy = new UserInputStrategy(prompt)
  }
  const svc = new DialogService({ llm: new LLMClient() });
  let res = await svc.startScene({ playerId: player, sceneId: scene });
  await loop(res, svc, player, inputStrategy);
  logStream.end(); // Close log file at end
}

async function loop(res: any, svc: DialogService, player: string, inputStrategy: InputStrategy) {
  // No debug, log only to file if needed
  logToFile('>>> RESPONSE:', JSON.stringify(res, null, 2));
  console.log('\n📜', res.monologue)

  if (res.thoughtCabinet && res.thoughtCabinet.length > 0) {
    console.log('\n🧠 Thought Cabinet:')
    res.thoughtCabinet.forEach((t: any, i: number) => {
      // If t has part and text fields, print both
      if (t.part && t.text) {
        console.log(`  [${i}] ${t.part}: ${t.text}`)
      } else {
        // fallback for unknown structure
        console.log(`  [${i}]`, t)
      }
    })
  }

  console.log('\n💬 Dialog Options:')
  res.dialog.forEach((o: any, i: number) =>
    console.log(`  [${i}] ${o.text}${o.skillCheck ? ' (' + o.skillCheck.part + 'DC=' + o.skillCheck.dc + ')' : ''}`)
  )
  if (!res.dialog.length) return console.log('=== end ===')
  const idx = await inputStrategy.chooseDialogOption(res.dialog)
  const opt = res.dialog[idx]
  if (!opt) return console.log('invalid choice')
  if (isLuigi) {
    console.log('>>> REQUEST: chooseOption', { playerId: player, optionId: opt.id })
    logToFile('>>> REQUEST: chooseOption', JSON.stringify({ playerId: player, optionId: opt.id }));
  }
  res = await svc.chooseOption({ playerId: player, optionId: opt.id })
  await loop(res, svc, player, inputStrategy)
}

main().catch(e => {
  logToFile('ERROR:', e);
  logStream.end();
  console.error(e);
});
