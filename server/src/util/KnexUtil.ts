import * as Knex from 'knex';

export async function knexExists(query: Knex.QueryBuilder): Promise<boolean> {
  return (await query.limit(1).count().get(0)).count === '1';
}
