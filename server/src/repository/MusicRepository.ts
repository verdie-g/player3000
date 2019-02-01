import * as Knex from 'knex';
import { injectable } from 'inversify';
import knex from './knex';
import { Music, MusicDownloadState } from '../model/Music';

export interface MusicRepository {
  getByVideoId(videoId: string): Promise<Music>;
  create(music: Music): Promise<Music>;
  setDownloadState(id: number, downloadState: MusicDownloadState): Promise<void>;
  getDownloadStates(videoIdIn: string[]): Promise<any>;
}

@injectable()
export class MusicRepositoryImpl implements MusicRepository {
  public getByVideoId(videoId: string): Promise<Music> {
    return knex('musics').where('videoId', videoId).first();
  }

  public create(music: Music): Promise<Music> {
    return knex('musics').insert(music).returning('*').get(0);
  }

  public setDownloadState(id: number, downloadState: MusicDownloadState): Promise<void> {
    return knex('musics').where('id', id).update({ downloadState });
  }

  public getDownloadStates(videoIdIn: string[]): Promise<any> {
    return knex('musics')
      .whereIn('videoId', videoIdIn)
      .select('videoId', 'downloadState');
  }
}
