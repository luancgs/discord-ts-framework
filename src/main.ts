import { GatewayIntentBits, Partials } from 'discord.js';
import DiscordClient from '@src/client/classes/DiscordClient';

const bot = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

bot.login(process.env.DISCORD_TOKEN);
