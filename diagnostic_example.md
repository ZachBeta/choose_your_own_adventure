# Shared Experience Diagnostic Example

## API Request
```json
{
  "method": "POST",
  "url": "/api/shared-experience",
  "body": {
    "user_id": "286141792670318603",
    "user_name": "muzachomega",
    "channel_id": "1357896892905685122",
    "channel_name": "bot_slop",
    "action": "<@1357898951214501978> beep",
    "content": "<@1357898951214501978> beep"
  },
  "query": {},
  "headers": {
    "content-type": "application/json",
    "accept": "*/*",
    "content-length": "198",
    "user-agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
    "accept-encoding": "gzip,deflate",
    "host": "localhost:3000",
    "connection": "keep-alive"
  }
}
```

## LLM Prompt
```
Current Scene: Welcome to the shared experience in bot_slop!
Recent Actions:
1. muzachomega chose "<@1357898951214501978> beep"

Generate the next moment in this shared narrative.
- Consider all participants’ perspectives.
- Offer 2–4 group decisions with clear labels.
- Keep tone consistent for a group adventure.

Respond with a JSON object exactly matching:@
{
  "scene": "string",
  "choices": [
    { "id": "string", "text": "string" }
  ]
}
```

## LLM Response
```json
{
  "scene": "The digital space of bot_slop shimmers, momentarily disrupted by the echoing 'beep' directed at <@1357898951214501987>. A faint, pixelated ripple spreads outwards from the recipient, as if acknowledging the sound. The environment itself seems to pulse with a low, rhythmic hum, reacting to the unexpected communication. It's unclear what the 'beep' signifies, but a sense of anticipation hangs in the air – is this a signal? A greeting? A warning?",
  "choices": [
    { "id": "investigate_beep", "text": "Attempt to trace the origin of the 'beep' and understand its purpose." },
    { "id": "respond_beep", "text": "Reply to <@1357898951214501987> with a similar, but slightly altered, 'beep' – perhaps a variation in frequency or duration." },
    { "id": "observe_reaction", "text": "Quietly observe <@1357898951214501987>'s reaction to the 'beep' and the environment's response, gathering data before acting." }
  ]
}
```
