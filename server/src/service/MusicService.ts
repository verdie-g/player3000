import * as ytdl from 'ytdl-core';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Music, MusicDownloadState } from '../model/Music';
import { MusicRepository } from '../repository/MusicRepository';
import { Playlist } from '../model/Playlist';
import { ServiceResult, ServiceCode } from '../model/ServiceResult';
import { YoutubeRepository, YouTubeResponse, YouTubeSearchResults } from '../repository/YoutubeRepository';
import { getOr } from '../util/ObjectUtil';

export interface MusicService {
  searchMusic(query: string): Promise<Music[]>;
  getPlaylist(): Playlist;
  enqueueMusic(videoId: string): Promise<ServiceResult<Music>>;
  playMusic(): void;
  stopMusic(): void;
  nextMusic(): void;
  previousMusic(): void;
}

@injectable()
export class MusicServiceImpl implements MusicService {
  @inject(TYPES.AudioPlayer)
  private audioPlayer!: AudioPlayer;

  @inject(TYPES.YoutubeRepository)
  private youtubeRepository!: YoutubeRepository;

  @inject(TYPES.MusicRepository)
  private musicRepository!: MusicRepository;

  public async searchMusic(query: string): Promise<Music[]> {
    const ytRes: YouTubeResponse = await this.youtubeRepository.search(query);
    const videoIds = ytRes.results.map((result: YouTubeSearchResults) => result.id);

    const downloadStatesByVideoId =
      (await this.musicRepository.getDownloadStates(videoIds))
      .reduce((acc: any, curr: any) => {
        acc[curr.videoId] = curr.downloadState;
        return acc;
      }, {});

    return ytRes.results.map((result: YouTubeSearchResults) => ({
      videoId: result.id,
      title: result.title,
      description: result.description,
      duration: 0, // youtube-search module doesn't expose all youtube api fields
      thumbUrl: result.thumbnails.default!.url,
      downloadState: getOr(downloadStatesByVideoId, result.id, MusicDownloadState.NOT_DOWNLOADED),
    }));
  }

  public getPlaylist(): Playlist {
    return this.audioPlayer.getPlaylist();
  }

  public async enqueueMusic(videoId: string): Promise<ServiceResult<Music>> {
    let music = await this.musicRepository.getByVideoId(videoId);
    if (music) {
      this.audioPlayer.enqueue(music);
      return ServiceResult.ok(ServiceCode.ACCEPTED, music);
    }

    let info: ytdl.videoInfo;
    try {
      info = await this.youtubeRepository.getInfo(videoId);
    } catch (e) {
      return ServiceResult.error(ServiceCode.NOT_FOUND);
    }

    music = await this.createMusicFromVideoInfo(info);
    const downloadPromise = this.downloadMusic(music, info);
    this.audioPlayer.enqueue(music, downloadPromise);
    return ServiceResult.ok(ServiceCode.ACCEPTED, music);
  }

  public playMusic() {
    this.audioPlayer.play();
  }

  public stopMusic() {
    this.audioPlayer.stop();
  }

  public nextMusic() {
    this.audioPlayer.next();
  }

  public previousMusic() {
    this.audioPlayer.previous();
  }

  private createMusicFromVideoInfo(info: ytdl.videoInfo): Promise<Music> {
    return this.musicRepository.create({
      videoId: info.video_id,
      title: info.title,
      description: info.description,
      duration: parseInt(info.length_seconds, 10),
      thumbUrl: info.thumbnail_url,
      downloadState: MusicDownloadState.DOWNLOADING,
    });
  }

  private async downloadMusic(music: Music, info: ytdl.videoInfo): Promise<void> {
    await this.youtubeRepository.downloadMusic(info);
    music.downloadState = MusicDownloadState.DOWNLOADED;
    await this.musicRepository.setDownloadState(music.id!, MusicDownloadState.DOWNLOADED);
  }
}
