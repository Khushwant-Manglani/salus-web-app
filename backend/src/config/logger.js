import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

/**
 * Creates a Winston logger instance with specified configurations.
 * The logger supports different transports for logging to files and console.
 *
 * - Logs errors to `logs/error.log`
 * - Logs all information to `logs/combined.log`
 * - Logs to the console in non-production environments
 *
 * @constant {Object} logger - The configured Winston logger instance.
 */

const logger = createLogger({
  level: 'info', // Log level for the logger
  format: format.combine(
    format.timestamp(), // Adds a timestamp to each log entry
    format.prettyPrint(), // Pretty prints the log entries
    format.splat(), // Supports string interpolation
    format.json(), // Converts logs to JSON format
    format.errors({ stack: true }), // Formats error messages to include stack trace
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs errors to a file
    new transports.File({ filename: 'logs/combined.log', level: 'info' }), // Logs all info level messages and above to a file
  ],
});

// define colors using chalk
const error = chalk.red.bold;
const warn = chalk.yellow.bold;
const info = chalk.blue.bold;
const debug = chalk.green.bold;

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.timestamp(), // Adds a timestamp to each log entry
        format.printf(({ level, message, timestamp }) => {
          let formattedMessage = `${timestamp} [${level.toUpperCase()} ${message}]`;

          // apply chalk colors based on the log levels
          switch (level) {
            case 'error':
              formattedMessage = error(formattedMessage);
              break;
            case 'warn':
              formattedMessage = warn(formattedMessage);
              break;
            case 'info':
              formattedMessage = info(formattedMessage);
              break;
            case 'debug':
              formattedMessage = debug(formattedMessage);
              break;
            default:
              formattedMessage = chalk.white(formattedMessage);
              break;
          }

          return formattedMessage;
        }),
      ),
    }),
  );
}

export { logger };
