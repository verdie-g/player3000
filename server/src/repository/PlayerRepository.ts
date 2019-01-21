import { injectable } from 'inversify';
import 'reflect-metadata';
import knex from './knex';
import { Player } from '../model/Player';

export interface PlayerRepository {
  getAll(): Promise<Player[]>;
  create(player: Player): Promise<Player>;
  // get(id: string): Promise<Player>;
  // update(player: Player): Promise<Player>;
}

@injectable()
export class PlayerRepositoryImpl implements PlayerRepository {

  public getAll(): Promise<Player[]> {
    return knex('players').select('*');
  }

  public async create(player: Player): Promise<Player> {
    return (await knex('players').insert(player).returning('*'))[0];
  }
}
