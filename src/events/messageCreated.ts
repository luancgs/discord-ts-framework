import { Message } from 'discord.js';

import CommandHandler from '@src/client/classes/CommandHandler';
import DiscordClient from '@src/client/classes/DiscordClient';
import Event from '@src/client/classes/Event';

export default class MessageEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'messageCreate');
  }

  async run(message: Message) {
    if (message.author.bot) return;
    await CommandHandler.handleCommand(this.client, message);
  }
}
