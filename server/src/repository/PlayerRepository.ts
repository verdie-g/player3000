import { injectable } from 'inversify';
import knex from './knex';
import { Player } from '../model/Player';
import { PlayerQueueItem } from '../model/PlayerQueue';
import { knexExists } from '../util/KnexUtil';

export interface PlayerRepository {
  getAll(): Promise<Player[]>;
  get(id: number): Promise<Player>;
  create(player: Player): Promise<Player>;
  existsWithName(name: string): Promise<boolean>;
  exists(id: number): Promise<boolean>;
  delete(id: number): Promise<void>;
  enqueueMusic(item: PlayerQueueItem): Promise<void>;
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

  public existsWithName(name: string): Promise<boolean> {
    return knexExists(knex('players').where('name', name));
  }

  public exists(id: number): Promise<boolean> {
    return knexExists(knex('players').where('id', id));
  }

  public delete(id: number): Promise<void> {
    return knex('players').where('id', id).del();
  }

  public enqueueMusic(item: PlayerQueueItem): Promise<void> {
    return knex('playerQueues').insert(item);
  }
}
