exports.up = function(knex, Promise) {
  return knex.schema.createTable('playerQueues', (t) => {
    t.integer('playerId').unsigned();
    t.integer('musicId').unsigned();

    t.primary(['playerId', 'musicId']);
    t.foreign('playerId').references('players.id')
    t.foreign('musicId').references('musics.id')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('playerQueues');
};
