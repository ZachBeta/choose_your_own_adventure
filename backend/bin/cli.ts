#!/usr/bin/env ts-node
import promptSync from 'prompt-sync'
import { DialogService } from '../src/dialogService'
import { LLMClient } from '../src/llmClient'

const prompt = promptSync({ sigint: true })

async function main() {
  const player = prompt('Player ID: ') || 'player1'
  const scene  = prompt('Scene ID:  ') || 'scene_intro'
  const svc    = new DialogService({ llm: new LLMClient() })

  let res = await svc.startScene({ playerId: player, sceneId: scene })
  await loop(res, svc, player)
}

async function loop(res: any, svc: DialogService, player: string) {
  console.log('\n📜', res.monologue)
  res.dialog.forEach((o: any, i: number) =>
    console.log(`  [${i}] ${o.text}${o.skillCheck ? ' (DC=' + o.skillCheck.dc + ')' : ''}`)
  )
  if (!res.dialog.length) return console.log('=== end ===')
  const idx = Number(prompt('> choose: '))
  const opt = res.dialog[idx]
  if (!opt) return console.log('invalid choice')
  res = await svc.chooseOption({ playerId: player, optionId: opt.id })
  await loop(res, svc, player)
}

main().catch(e => console.error(e))
