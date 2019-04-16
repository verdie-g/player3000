module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './player3000.sqlite3',
  },
  migrations: {
    directory: '../migrations',
  },
  useNullAsDefault: true,
};
