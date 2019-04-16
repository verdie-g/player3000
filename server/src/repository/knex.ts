import * as knex from 'knex';

const knexConf: knex.Config = require('../../config/knexfile');

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
