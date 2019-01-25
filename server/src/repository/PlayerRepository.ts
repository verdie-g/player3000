import { injectable } from 'inversify';
import knex from './knex';
import { Player } from '../model/Player';

export interface PlayerRepository {
  getAll(): Promise<Player[]>;
  get(id: number): Promise<Player>;
  create(player: Player): Promise<Player>;
  existsWithName(name: string): Promise<boolean>;
  exists(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
  // update(player: Player): Promise<Player>;
}

@injectable()
export class PlayerRepositoryImpl implements PlayerRepository {

  public getAll(): Promise<Player[]> {
    return knex('players').select('*');
  }

  public get(id: number): Promise<Player> {
    return knex('players').where('id', id).first();
  }

  public create(player: Player): Promise<Player> {
    return knex('players').insert(player).returning('*').get(0);
  }

  public async existsWithName(name: string): Promise<boolean> {
    return (await knex('players').where('name', name)).length > 0;
  }

  public async exists(id: number): Promise<boolean> {
    return (await knex('players').where('id', id)).length > 0;
  }

  public async delete(id: number): Promise<void> {
    return knex('players').where('id', id).del();
  }
}
