const path = require('path');

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '..', 'player3000.sqlite3'),
  },
  migrations: {
    directory: '../migrations',
  },
  useNullAsDefault: true,
};
