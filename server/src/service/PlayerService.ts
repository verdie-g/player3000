import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { MusicService } from '../service/MusicService';
import { Player } from '../model/Player';
import { PlayerQueueItem } from '../model/PlayerQueue';
import { PlayerRepository } from '../repository/PlayerRepository';
import { ServiceResult, ServiceCode } from '../model/ServiceResult';

export interface PlayerService {
  getPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player>;
  createPlayer(player: Player): Promise<ServiceResult<Player>>;
  deletePlayer(id: number): Promise<ServiceResult<void>>;
  playMusic(playerId: number, videoId: string): Promise<void>;
}

@injectable()
export class PlayerServiceImpl implements PlayerService {
  @inject(TYPES.MusicService)
  private musicService: MusicService;

  @inject(TYPES.PlayerRepository)
  private playerRepository: PlayerRepository;

  public getPlayers(): Promise<Player[]> {
    return this.playerRepository.getAll();
  }

  public getPlayer(id: number): Promise<Player> {
    return this.playerRepository.get(id);
  }

  public async createPlayer(player: Player): Promise<ServiceResult<Player>> {
    if (await this.playerRepository.existsWithName(player.name)) {
      return ServiceResult.error<Player>(ServiceCode.CONFLICT);
    }

    const created = await this.playerRepository.create(player);
    return ServiceResult.ok(ServiceCode.CREATED, created);
  }

  public async deletePlayer(id: number): Promise<ServiceResult<void>> {
    if (!await this.playerRepository.exists(id)) {
      return ServiceResult.error(ServiceCode.NOT_FOUND);
    }

    await this.playerRepository.delete(id);
    return ServiceResult.ok(ServiceCode.NO_CONTENT);
  }

  public async playMusic(playerId: number, videoId: string) {
    const music = await this.musicService.downloadMusic(videoId);

    await this.playerRepository.enqueueMusic({
      playerId,
      musicId: music.id,
    });
  }
}
