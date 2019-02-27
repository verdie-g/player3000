exports.up = function(knex, Promise) {
  return knex.schema.table('musics', function(t) {
    t.dropColumn('thumbUrl');
    t.string('thumbSmallUrl').notNull();
    t.string('thumbMediumUrl').notNull();
    t.string('thumbHighUrl').notNull();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('musics', function(t) {
    t.dropColumn('thumbSmallUrl');
    t.dropColumn('thumbMediumUrl');
    t.dropColumn('thumbHighUrl');
    t.string('thumbUrl').notNull();
  });
};
