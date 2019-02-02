exports.up = function(knex, Promise) {
  return knex.schema.dropTable('playerQueues');
  return knex.schema.dropTable('players');
};

exports.down = function(knex, Promise) {
  return knex.schema.createTable('players', (t) => {
    t.increments('id').unsigned().primary();
    t.string('name').unique().notNull();
  });

  return knex.schema.createTable('playerQueues', (t) => {
    t.integer('playerId').unsigned();
    t.integer('musicId').unsigned();

    t.primary(['playerId', 'musicId']);
    t.foreign('playerId').references('players.id')
    t.foreign('musicId').references('musics.id')
  });
};
