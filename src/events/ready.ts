import { ActivityType } from 'discord.js';
import Logger from '@src/utils/Logger';
import DiscordClient from '@src/client/classes/DiscordClient';
import Event from '@src/client/classes/Event';

export default class ReadyEvent extends Event {
  constructor(client: DiscordClient) {
    super(client, 'ready');
  }

  async run() {
    const status = () => {
      const type = Math.floor(Math.random() * 3);

      let typeString: ActivityType;
      let activityList: string[];

      switch (type) {
        case ActivityType.Listening:
          activityList = this.client.config.status.listen;
          typeString = ActivityType.Listening;
          break;
        case ActivityType.Watching:
          activityList = this.client.config.status.watch;
          typeString = ActivityType.Watching;
          break;
        default:
          activityList = this.client.config.status.play;
          typeString = ActivityType.Playing;
          break;
      }

      const activity = activityList[Math.floor(Math.random() * activityList.length)];

      try {
        this.client.user?.setActivity(activity, { type: typeString });
      } catch (error) {
        Logger.log('ERROR', `There was an error while setting the activity: \n${error}\n`, true);
      }
    };

    status();
    setInterval(status, 30 * 60 * 1000);

    Logger.log('SUCCESS', `Bot is successfully logged in as ${this.client.user?.tag}`);
  }
}
