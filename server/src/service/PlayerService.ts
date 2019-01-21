import { injectable, inject } from 'inversify';
import 'reflect-metadata';
import { Player } from '../model/Player';
import { PlayerRepository } from '../repository/PlayerRepository';
import TYPES from '../types';

export interface PlayerService {
  getPlayers(): Promise<Player[]>;
  getPlayer(name: string): Promise<Player>;
  createPlayer(player: Player): Promise<Player>;
  // updatePlayer(player: Player): Promise<Player>;
}

@injectable()
export class PlayerServiceImpl implements PlayerService {
  @inject(TYPES.PlayerRepository)
  private playerRepository: PlayerRepository;

  public getPlayers(): Promise<Player[]> {
    return this.playerRepository.getAll();
  }

  public getPlayer(name: string): Promise<Player> {
    return this.playerRepository.get(name);
  }

  public createPlayer(player: Player): Promise<Player> {
    return this.playerRepository.create(player);
  }
}
