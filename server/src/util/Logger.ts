import * as winston from 'winston';
import * as config from 'config';

export const logger: winston.Logger = winston.createLogger({
  exitOnError: false,
  level: config.get('logLevel'),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});
