#!/usr/bin/env ts-node
import promptSync from 'prompt-sync'
import { DialogService } from '../src/dialogService'
import { LLMClient } from '../src/llmClient'
import { InputStrategy, UserInputStrategy, LuigiInputStrategy } from '../src/inputStrategy'

const prompt = promptSync({ sigint: true })
const args = process.argv.slice(2)
const isLuigi = args.includes('--mario-party-luigi') || args.includes('--luigi')
const isDebug = args.includes('--debug')

async function main(debug = false) {
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
  const svc = new DialogService({ llm: new LLMClient(), debug })
  let res = await svc.startScene({ playerId: player, sceneId: scene })
  await loop(res, svc, player, inputStrategy, debug)
}

async function loop(res: any, svc: DialogService, player: string, inputStrategy: InputStrategy, debug = false) {
  if (debug) {
    console.log('>>> RESPONSE:', JSON.stringify(res, null, 2))
  }
  console.log('\n📜', res.monologue)
  res.dialog.forEach((o: any, i: number) =>
    console.log(`  [${i}] ${o.text}${o.skillCheck ? ' (DC=' + o.skillCheck.dc + ')' : ''}`)
  )
  if (!res.dialog.length) return console.log('=== end ===')
  const idx = await inputStrategy.chooseDialogOption(res.dialog)
  const opt = res.dialog[idx]
  if (!opt) return console.log('invalid choice')
  if (isLuigi) {
    console.log('>>> REQUEST: chooseOption', { playerId: player, optionId: opt.id })
  }
  res = await svc.chooseOption({ playerId: player, optionId: opt.id })
  await loop(res, svc, player, inputStrategy, debug)
}

main(isDebug).catch(e => console.error(e))
