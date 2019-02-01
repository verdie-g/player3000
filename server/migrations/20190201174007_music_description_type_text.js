exports.up = function(knex, Promise) {
  return knex.schema.alterTable('musics', (t) => {
    t.text('description').notNull().alter();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('musics', (t) => {
    t.string('description').notNull().alter();
  });
};
