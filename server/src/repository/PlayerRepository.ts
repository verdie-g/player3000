import { injectable } from 'inversify';
import 'reflect-metadata';
import knex from './knex';
import { Player } from '../model/Player';

export interface PlayerRepository {
  getAll(): Promise<Player[]>;
  get(name: string): Promise<Player>;
  create(player: Player): Promise<Player>;
  // update(player: Player): Promise<Player>;
}

@injectable()
export class PlayerRepositoryImpl implements PlayerRepository {

  public getAll(): Promise<Player[]> {
    return knex('players').select('*');
  }

  public get(name: string): Promise<Player> {
    return knex('players').where({ name }).first();
  }

  public create(player: Player): Promise<Player> {
    return knex('players').insert(player).returning('*').get(0);
  }
}
