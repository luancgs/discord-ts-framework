import { Message } from 'discord.js';

import Logger from '@src/utils/Logger';
import { ICommandConfig } from '../types/Command.ts';
import DiscordClient from './DiscordClient';

export default abstract class Command {
  /** Discord client */
  readonly client: DiscordClient;

  /** Information of the command */
  readonly info: ICommandConfig;

  constructor(client: DiscordClient, info: ICommandConfig) {
    this.client = client;
    this.info = info;
  }

  /**
   * Executes when command throws an error.
   * @param message Message object
   * @param error Error message
   */
  async onError(message: Message, error: any) {
    Logger.log('ERROR', `There was an error with command ${this.info.name}.\n${error}\n`, true);
    await message.reply('There was an error with this command.');
  }

  /**
   * Returns usability of the command
   * @param message Message object
   */
  isUsable(message: Message): boolean {
    if (this.info.enabled === false) return false;
    return true;
  }

  /**
   * Runs the command.
   * @param message Message object
   * @param args Arguments
   * @param cancelCooldown Cancels cooldown when function called
   */
  abstract run(message: Message, args: string[]): Promise<any>;
}
