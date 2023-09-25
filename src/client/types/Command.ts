/**
 * Information interface for commands.
 */
export interface ICommandConfig {
  /** Name of the command */
  name: string;

  /** Category name of the command */
  category: string;

  /** Description of the command */
  description: string;

  /** Example usage */
  usage: string;

  /** Time to wait for each use (seconds) */
  cooldown?: number;

  /** Status of the command */
  enabled: boolean;

  /** If command only runs in guild channels */
  guildOnly: boolean;

  /** If enabled, command only runs in nsfw channels */
  nsfw: boolean;

  /** Aliases of the command */
  aliases: string[];

  /** Level of permission for using this command */
  permLevel: 'user' | 'guildOwner' | 'owner';
}
