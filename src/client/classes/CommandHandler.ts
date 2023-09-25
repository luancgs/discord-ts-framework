import { Message, TextChannel } from 'discord.js';

import DiscordClient from './DiscordClient';

export default class CommandHandler {
  /**
   * Handles the commands.
   * @param message Message object
   */
  static async handleCommand(client: DiscordClient, message: Message) {
    const prefix = client.config.prefix;
    if (!message.content.toLocaleLowerCase().startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = (args.shift() as string).toLowerCase();

    const cmd = client.registry.findCommand(command);
    if (!cmd) return;

    if (cmd.info.enabled === false) return;
    if (cmd.info.nsfw === true && !(message.channel as TextChannel).nsfw)
      return message.reply('This command can only be used in NSFW channels.');
    if (cmd.info.permLevel === 'owner' && !client.config.ownerIds.includes(message.author.id)) return;

    try {
      await cmd.run(message, args);
    } catch (error) {
      await cmd.onError(message, error);
    }
  }
}
