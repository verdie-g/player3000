import { injectable } from 'inversify';
import knex from './knex';
import { Player } from '../model/Player';

export interface PlayerRepository {
  getAll(): Promise<Player[]>;
  get(name: string): Promise<Player>;
  create(player: Player): Promise<Player>;
  exists(name: string): Promise<boolean>;
  delete(name: string): Promise<void>;
  // update(player: Player): Promise<Player>;
}

@injectable()
export class PlayerRepositoryImpl implements PlayerRepository {

  public getAll(): Promise<Player[]> {
    return knex('players').select('*');
  }

  public get(name: string): Promise<Player> {
    return knex('players').where('name', name).first();
  }

  public create(player: Player): Promise<Player> {
    return knex('players').insert(player).returning('*').get(0);
  }

  public async exists(name: string): Promise<boolean> {
    return (await knex('players').where('name', name)).length > 0;
  }

  public async delete(name: string): Promise<void> {
    return knex('players').where('name', name).del();
  }
}
