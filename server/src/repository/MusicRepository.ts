import { injectable } from 'inversify';
import knex from './knex';
import { Music, MusicDownloadState } from '../model/Music';

export interface MusicRepository {
  existsWithVideoId(videoId: string): Promise<boolean>;
  create(music: Music): Promise<Music>;
  setDownloadState(id: number, downloadState: MusicDownloadState): Promise<void>;
}

@injectable()
export class MusicRepositoryImpl implements MusicRepository {
  public async existsWithVideoId(videoId: string): Promise<boolean> {
    return (await knex('musics').where('videoId', videoId)).length > 0;
  }

  public create(music: Music): Promise<Music> {
    return knex('musics').insert(music).returning('*').get(0);
  }

  public setDownloadState(id: number, downloadState: MusicDownloadState): Promise<void> {
    return knex('musics').where('id', id).update({ downloadState });
  }
}
