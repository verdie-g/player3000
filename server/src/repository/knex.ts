import * as knex from 'knex';
import { logger } from '../util/Logger';

const environment = process.env.ENVIRONMENT || 'development';
const knexConf: knex.Config = require('../../config/knexfile')[environment];

export default require('knex')({
  ...knexConf,
  /*
  log: {
    debug: logger.debug,
    warn: logger.warn,
    error: logger.error,
  },
   */
  debug: process.env.NODE_ENV !== 'production',
});
