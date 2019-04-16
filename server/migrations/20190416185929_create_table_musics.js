exports.up = function(knex, Promise) {
  return knex.schema.createTable('musics', (t) => {
    t.increments('id').unsigned().primary();
    t.string('videoId').unique().notNull();
    t.string('title').notNull();
    t.text('description').notNull();
    t.integer('duration').notNull();
    t.string('thumbSmallUrl').notNull();
    t.string('thumbMediumUrl').notNull();
    t.string('thumbHighUrl').notNull();
    t.integer('downloadState').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('musics');
};
