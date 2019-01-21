module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: 'player3000',
      user: 'postgres',
    },
    migrations: {
      directory: '../migrations',
    },
  },

};
