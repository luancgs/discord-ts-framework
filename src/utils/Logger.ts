import chalk from 'chalk';
import { DateTime } from 'luxon';

export default class Logger {
  /**
   * Logs your message with date to console.
   * @param type Type of log
   * @param message Log message
   * @param spaces Adds spaces above and under to log
   * @param format Custom format of date (Default: "DD/MM/YYYY HH:mm:ss")
   */
  static log(
    type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO',
    message: string,
    spaces = false,
    format = 'dd/MM/yyyy HH:mm:ss'
  ) {
    let color: 'green' | 'yellow' | 'red' | 'blue';

    switch (type) {
      case 'SUCCESS':
        color = 'green';
        break;
      case 'WARNING':
        color = 'yellow';
        break;
      case 'ERROR':
        color = 'red';
        break;
      case 'INFO':
        color = 'blue';
        break;
    }

    console.log(
      `${spaces ? '\n' : ''}${chalk.magenta(`${DateTime.now().toFormat(format)}`)} ${chalk[color].bold(
        `[${type}]`
      )} ${message}${spaces ? '\n' : ''}`
    );
  }
}
