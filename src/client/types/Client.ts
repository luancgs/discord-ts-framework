/**
 * Config interface for client.
 */
export interface IClientConfig {
  /** Token of the client */
  token: string;

  /** Prefix of the client */
  prefix: string;

  /** Developer ids of the client */
  ownerIds: string[];

  /** Status to display when online */
  status: {
    play: string[];
    listen: string[];
    watch: string[];
  };
}
