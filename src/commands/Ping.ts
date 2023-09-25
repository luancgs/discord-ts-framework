import { Message } from 'discord.js';

import Command from '@src/client/classes/Command';
import DiscordClient from '@src/client/classes/DiscordClient';

export default class PingCommand extends Command {
  constructor(client: DiscordClient) {
    super(client, {
      name: 'ping',
      category: 'System',
      description: 'Says pong',
      usage: 'ping',
      enabled: true,
      guildOnly: false,
      nsfw: false,
      aliases: [],
      permLevel: 'user',
    });
  }

  async run(message: Message) {
    message.channel.send('Pong!');
  }
}
