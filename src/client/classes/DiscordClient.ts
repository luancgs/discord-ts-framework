import { Client, ClientOptions, Collection } from 'discord.js';

import Registry from '../classes/Registry';
import { IClientConfig } from '../types/Client';

import config from '@src/config';

export default class DiscordClient extends Client {
  /**
   * Registry of the client.
   */
  readonly registry: Registry;

  /**
   * Config of the client.
   */
  readonly config: IClientConfig;

  constructor(options: ClientOptions) {
    super(options);

    /**
     * Setting up client's config.
     */
    this.config = {
      token: process.env.DISCORD_TOKEN as string,
      prefix: process.env.PREFIX as string,
      ownerIds: config.ownerIds,
      status: config.status,
    };

    /**
     * Creating new registry class.
     */
    this.registry = new Registry(this);

    /**
     * Registering events and commands.
     */
    this.registry.registerAll();
  }
}
