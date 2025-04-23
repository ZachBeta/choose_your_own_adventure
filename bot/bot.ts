import { Client, GatewayIntentBits, Events, Message, Partials, TextChannel, ChannelType, MessageType, GuildMember } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import type { SharedExperienceRequest, SharedExperienceResponse } from '../shared/types/sharedExperience';
dotenv.config();

// In-memory cache for userId -> displayName
const mentionDisplayNameCache = new Map<string, string>();

/**
 * Replaces all Discord user mentions in a message with @displayName or @unknown:USER_ID.
 * Uses an in-memory cache to minimize API calls.
 * @param message Discord message
 * @param cache Map<string, string> for userId -> displayName
 * @returns The content with mentions replaced
 */
export async function replaceMentionsWithDisplayNames(message: Message, cache: Map<string, string>): Promise<string> {
  // Only process messages from guilds (servers)
  const guild = message.guild;
  if (!guild) return message.content;

  // Regex to match <@123> and <@!123>
  const mentionRegex = /<@!?(\d+)>/g;

  // Gather unique user IDs from the message
  const userIds = Array.from(message.content.matchAll(mentionRegex)).map(match => match[1]);
  const uniqueUserIds = Array.from(new Set(userIds));

  // Map userId -> displayName or placeholder
  const idToDisplayName = new Map<string, string>();

  for (const userId of uniqueUserIds) {
    // Check cache first
    if (cache.has(userId)) {
      idToDisplayName.set(userId, cache.get(userId)!);
      continue;
    }
    // Try to get from guild member cache
    let member: GuildMember | undefined;
    try {
      member = guild.members.cache.get(userId);
      if (!member) {
        // Optionally: Uncomment the next line to fetch from API if not cached
        // member = await guild.members.fetch(userId);
      }
    } catch (e) {
      member = undefined;
    }
    let displayName: string;
    if (member) {
      displayName = member.displayName || member.user.username;
      cache.set(userId, displayName);
    } else {
      displayName = `unknown:${userId}`;
    }
    idToDisplayName.set(userId, displayName);
  }

  // Replace all mentions in the content
  const replaced = message.content.replace(mentionRegex, (full, userId) => {
    const displayName = idToDisplayName.get(userId);
    if (displayName && !displayName.startsWith('unknown:')) {
      return `@${displayName}`;
    } else {
      return `@unknown:${userId}`;
    }
  });
  return replaced;
}

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
  // Ignore system messages, only process regular user messages
  if (message.type !== MessageType.Default) return;

  // Replace all user mentions with display names or @unknown:USER_ID
  // const contentWithUsername = message.content.replace(
  //   mentionRegex,
  //   mention => `${mention} ${message.author.username}`
  // );

  // // Strip off the mention when parsing a choice
  // const withoutMention = contentWithUsername.replace(mentionRegex, '').trim();
  // let action: string | undefined;
  // const numMatch = withoutMention.match(/^(\d+)$/);
  // if (numMatch) {
  //   action = `choice_${numMatch[1]}`;
  // } else if (/^choice_(\d+)$/i.test(withoutMention)) {
  //   action = withoutMention.toLowerCase();
  // } else if (/^explore$/i.test(withoutMention)) {
  //   action = 'choice_1';
  // }
  const action = message.content; // pass thru directly for now, we can fill in the mentioned username later

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
