import * as winston from 'winston';

export const logger: winston.Logger = winston.createLogger({
  exitOnError: false,
  transports: [
    new winston.transports.Console(),
  ],
});
