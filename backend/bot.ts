import { Client, GatewayIntentBits, Events, Message, Partials } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

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

const BOT_USER_ID = process.env.BOT_USER_ID; // Optionally set this for self-detection

client.once(Events.ClientReady, () => {
  console.log(`Bot is online as ${client.user?.tag}`);
});

client.on(Events.MessageCreate, async (message: Message) => {
  // Ignore messages from the bot itself
  if (message.author.bot) return;

  // Check if message is in a thread
  if (message.channel.isThread()) {
    console.log(`[THREAD] ${message.author.username}: ${message.content}`);
    await message.reply('Bot is listening in this thread!');
    return;
  }

  // Main channel: respond to @mentions or replies
  const isMention = message.mentions.has(client.user!);
  const isReply = message.reference && message.mentions.has(client.user!);

  if (isMention || isReply) {
    console.log(`[MAIN] ${message.author.username}: ${message.content}`);
    await message.reply('Bot is listening in the main channel!');
    return;
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
