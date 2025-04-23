import { Client, GatewayIntentBits, Events, Message, Partials, TextChannel, ChannelType, MessageType } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import type { SharedExperienceRequest, SharedExperienceResponse } from '../shared/types/sharedExperience';
dotenv.config();

const gameplayChannelId = process.env.DISCORD_CHANNEL_ID;
const debugChannelId = process.env.DISCORD_DEBUG_CHANNEL_ID;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'; // Adjust if needed

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // Needed to receive DMs
});

client.once(Events.ClientReady, async () => {
  const now = new Date().toLocaleString();
  const botTag = client.user?.tag;
  console.log(`Bot is online as ${botTag}`);
  if (debugChannelId) {
    try {
      const channel = await client.channels.fetch(debugChannelId);
      if (channel && channel.isTextBased()) {
        const debugInfo = [
          `**Bot Online**: ${botTag}`,
          `**Time**: ${now}`,
          `**API_BASE_URL**: ${API_BASE_URL}`,
          `**Game Channel**: ${gameplayChannelId}`,
          `**Debug Channel**: ${debugChannelId}`
        ].join('\n');
        await (channel as TextChannel).send(debugInfo);
      }
    } catch (e) {
      console.error('Failed to send debug info to debug channel:', e);
    }
  }
});

client.on(Events.MessageCreate, async (message: Message) => {
  if (message.author.bot) return;
  // Ignore system-only messages, but allow user messages and replies
  if (![MessageType.Default, MessageType.Reply].includes(message.type)) return;

  // Respond if: (1) mentioned, (2) reply to a bot, or (3) in a thread started by the bot
  let shouldRespond = false;
  try {
    // (1) Mentioned
    if (client.user && message.mentions.has(client.user.id)) {
      shouldRespond = true;
    }
    // (2) Reply to a bot message
    else if (message.reference) {
      try {
        const referenced = await message.fetchReference();
        if (referenced.author?.bot) {
          shouldRespond = true;
        }
      } catch {}
    }
    // (3) In a thread started by the bot
    else if (message.channel.isThread()) {
      try {
        const thread = message.channel;
        const starter = await thread.fetchStarterMessage();
        if (starter && starter.author?.bot) {
          shouldRespond = true;
        }
      } catch {}
    }
  } catch {}
  if (!shouldRespond) return;

  // Prepare SharedExperienceRequest context
  // ... (existing comment lines unchanged)
  const action = message.content; // pass thru directly for now, we can fill in the mentioned username later

  // Add a processing emoji reaction before sending to backend
  try {
    await message.react('⏳');
  } catch (err) {
    // Ignore reaction errors (e.g., lack of permissions)
  }

  // Build the request with injected mention+username
  const sharedExperienceRequest: SharedExperienceRequest = {
    user_id: message.author.id,
    user_name: message.author.username,
    channel_id: message.channel.id,
    channel_name: message.channel.isDMBased() ? 'DM' : (message.channel as any).name,
    thread_id: message.channel.isThread() ? message.channel.id : undefined,
    thread_name: message.channel.isThread() ? message.channel.name : undefined,
    action,
    content: message.content,
  };

  // Only respond in the gameplay or debug channel (or threads)
  if (
    message.channel.id === gameplayChannelId ||
    message.channel.id === debugChannelId ||
    message.channel.isThread()
  ) {
    try {
      // POST to /api/shared-experience (JSON, not SSE)
      const response = await fetch(`${API_BASE_URL}/api/shared-experience`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sharedExperienceRequest),
      });
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      const data = (await response.json()) as SharedExperienceResponse;
      // Format scene and choices for Discord
      let replyText = data.scene;
      if (data.choices && data.choices.length > 0) {
        replyText += '\n\n**Choices:**\n' + data.choices.map(c => `\`${c.id}\`: ${c.text}`).join('\n');
      }
      if (message.channel.isThread()) {
        await message.reply(replyText);
      } else if (message.channel.type === ChannelType.GuildText) {
        await (message.channel as TextChannel).send(replyText);
      } else {
        // Fallback for DMs or other channel types
        await message.reply(replyText);
      }
    } catch (err: any) {
      console.error('Error calling backend API:', err?.message);
      await message.reply('Sorry, there was an error contacting the game server.');
    }
    return;
  }

  // For threads not covered above, you can add more logic here if needed
});

client.login(process.env.DISCORD_BOT_TOKEN);
