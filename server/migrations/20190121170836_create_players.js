exports.up = function(knex, Promise) {
  return knex.schema.createTable('players', (t) => {
    t.increments('id').unsigned().primary();
    t.string('name').unique().notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('players');
};
