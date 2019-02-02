exports.up = function(knex, Promise) {
  return knex.schema.table('musics', function(t) {
    t.integer('duration').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('musics', function(t) {
    t.dropColumn('duration');
  });
};
