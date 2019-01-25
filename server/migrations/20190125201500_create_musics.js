exports.up = function(knex, Promise) {
  return knex.schema.createTable('musics', (t) => {
    t.increments('id').unsigned().primary();
    t.string('videoId').unique().notNull();
    t.string('title').notNull();
    t.string('description').notNull();
    t.string('thumbUrl').notNull();
    t.integer('downloadState').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('musics');
};
