import { ClientEvents, Collection } from 'discord.js';

import Command from './Command';
import DiscordClient from './DiscordClient';
import Event from './Event';
import RegistryError from '../errors/RegistryError';

import { isConstructor } from '../utils/functions';
import Logger from '@src/utils/Logger';
import getAllEvents from '@src/utils/importEvents';
import getAllCommands from '@src/utils/importCommands';

export default class Registry {
  /**
   * Discord client.
   */
  private client: DiscordClient;

  /**
   * Collection for command registration.
   */
  commands: Collection<string, Command>;

  /**
   * Command paths
   */
  private commandPaths: string[] = [];

  /**
   * Collection for event registration.
   */
  events: Collection<string, Event>;

  /**
   * Event paths
   */
  private eventPaths: string[] = [];

  /**
   * Collection for command cooldown registration.
   */
  private cooldowns: Collection<string, Collection<string, number>>;

  /**
   * Collection for command category registration.
   */
  categories: Collection<string, string[]>;

  /**
   * Creates instance for all collections.
   */
  private newCollections() {
    this.commands = new Collection<string, Command>();
    this.events = new Collection<string, Event>();
    this.cooldowns = new Collection<string, Collection<string, number>>();
    this.categories = new Collection<string, string[]>();
  }

  constructor(client: DiscordClient) {
    this.client = client;

    /**
     * Creates instance for all collections.
     */
    this.commands = new Collection<string, Command>();
    this.events = new Collection<string, Event>();
    this.cooldowns = new Collection<string, Collection<string, number>>();
    this.categories = new Collection<string, string[]>();
  }

  /**
   * Registers single event.
   * @param event Event object
   */
  private registerEvent(event: Event) {
    if (this.events.some((e) => e.name === event.name))
      throw new RegistryError(`An event with name "${event.name}" is already registered.`);

    this.events.set(event.name, event);
    this.client.on(event.name, event.run.bind(event));
    Logger.log('INFO', `loading event: ${event.name}`);
  }

  /**
   * Registers all events.
   */
  private registerAllEvents() {
    const events = getAllEvents();

    if (this.eventPaths.length)
      this.eventPaths.forEach((p) => {
        delete require.cache[p];
      });

    for (let event of events) {
      const valid = isConstructor(event.default, Event) || event.default instanceof Event;
      if (!valid) continue;

      let eventObject;

      if (isConstructor(event.default, Event)) eventObject = new event.default(this.client);
      if (!(eventObject instanceof Event)) throw new RegistryError(`Invalid Event object: ${eventObject}`);

      this.registerEvent(eventObject);
    }
  }

  /**
   * Registers single command.
   * @param command Command object
   */
  private registerCommand(command: Command) {
    if (
      this.commands.some((x) => {
        if (x.info.name === command.info.name) return true;
        else if (x.info.aliases && x.info.aliases.includes(command.info.name)) return true;
        else return false;
      })
    )
      throw new RegistryError(`A command with the name/alias "${command.info.name}" is already registered.`);

    if (command.info.aliases) {
      for (const alias of command.info.aliases) {
        if (
          this.commands.some((x) => {
            if (x.info.name === alias) return true;
            else if (x.info.aliases && x.info.aliases.includes(alias)) return true;
            else return false;
          })
        )
          throw new RegistryError(`A command with the name/alias "${alias}" is already registered.`);
      }
    }

    this.commands.set(command.info.name, command);
    if (!this.categories.has(command.info.category)) this.categories.set(command.info.category, [command.info.name]);
    else {
      const categories = this.categories.get(command.info.category) as string[];
      categories.push(command.info.name);
      this.categories.set(command.info.category, categories);
    }
    Logger.log('INFO', `loading command: ${command.info.name}`);
  }

  /**
   * Registers all commands.
   */
  private registerAllCommands() {
    const commands = getAllCommands();

    if (this.commandPaths.length)
      this.commandPaths.forEach((p) => {
        delete require.cache[p];
      });

    for (const commandName in commands) {
      let command = commands[commandName];
      const valid = isConstructor(command.default, Command) || command.default instanceof Command;
      if (!valid) continue;

      let commandObject;

      if (isConstructor(command.default, Command)) commandObject = new command.default(this.client);
      if (!(commandObject instanceof Command)) throw new RegistryError(`Invalid Command object: ${commandObject}`);

      this.registerCommand(commandObject);
    }
  }

  /**
   * Finds and returns the command by name or alias.
   * @param command Name or alias
   */
  findCommand(command: string): Command | undefined {
    return (
      this.commands.get(command) ||
      [...this.commands.values()].find((cmd) => cmd.info.aliases && cmd.info.aliases.includes(command))
    );
  }

  /**
   * Finds and returns the commands in category by category name
   * @param category Name of category
   */
  findCommandsInCategory(category: string): string[] | undefined {
    return this.categories.get(category);
  }

  /**
   * Returns all category names.
   */
  getAllCategoryNames() {
    return [...this.categories.keys()];
  }

  /**
   * Registers events and commands.
   */
  registerAll() {
    this.registerAllCommands();
    this.registerAllEvents();
  }

  /**
   * Removes all events from client then reregisters events & commands. Resets categories and cooldowns.
   *
   * Call this function while client is offline.
   */
  reregisterAll() {
    const allEvents = [...this.events.keys()];
    allEvents.forEach((event) => this.client.removeAllListeners(event as keyof ClientEvents));
    this.newCollections();
    this.registerAll();
  }
}
