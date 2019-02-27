import * as ytdl from 'ytdl-core';
import { injectable, inject } from 'inversify';

import TYPES from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Music, MusicDownloadState } from '../model/Music';
import { MusicRepository } from '../repository/MusicRepository';
import { Playlist } from '../model/Playlist';
import { SSEService } from '../service/SSEService';
import { ServiceResult, ServiceCode } from '../model/ServiceResult';
import { YoutubeRepository } from '../repository/YoutubeRepository';
import { YoutubeSearchResponse, YoutubeItem } from '../model/Youtube';
import { getOr } from '../util/ObjectUtil';
import { logger } from '../util/Logger';

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
  @inject(TYPES.SSEService)
  private sseService!: SSEService;

  @inject(TYPES.AudioPlayer)
  private audioPlayer!: AudioPlayer;

  @inject(TYPES.YoutubeRepository)
  private youtubeRepository!: YoutubeRepository;

  @inject(TYPES.MusicRepository)
  private musicRepository!: MusicRepository;

  public async searchMusic(query: string): Promise<Music[]> {
    const ytRes: YoutubeSearchResponse = await this.youtubeRepository.search(query);
    const videoIds = ytRes.items.map((result: YoutubeItem) => result.id.videoId);

    const downloadStatesByVideoId =
      (await this.musicRepository.getDownloadStates(videoIds))
      .reduce((acc: any, curr: any) => {
        acc[curr.videoId] = curr.downloadState;
        return acc;
      }, {});

    return ytRes.items.map((item: YoutubeItem) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      duration: 0, // another yt api call is needed to get duration
      thumbSmallUrl: item.snippet.thumbnails.default.url,
      thumbMediumUrl: item.snippet.thumbnails.medium.url,
      thumbHighUrl: item.snippet.thumbnails.high.url,
      downloadState: getOr(downloadStatesByVideoId, item.id.videoId, MusicDownloadState.NOT_DOWNLOADED),
    }));
  }

  public getPlaylist(): Playlist {
    return this.audioPlayer.getPlaylist();
  }

  public async enqueueMusic(videoId: string): Promise<ServiceResult<Music>> {
    let music = await this.musicRepository.getByVideoId(videoId);
    if (music) {
      music = this.audioPlayer.enqueue(music);
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
    console.log(JSON.stringify(info.player_response.videoDetails.thumbnail));
    return this.musicRepository.create({
      videoId: info.video_id,
      title: info.title,
      description: info.description,
      duration: parseInt(info.length_seconds, 10),
      thumbSmallUrl: info.player_response.videoDetails.thumbnail.thumbnails[0].url,
      thumbMediumUrl: info.player_response.videoDetails.thumbnail.thumbnails[1].url,
      thumbHighUrl: info.player_response.videoDetails.thumbnail.thumbnails[3].url,
      downloadState: MusicDownloadState.DOWNLOADING,
    });
  }

  private async downloadMusic(music: Music, info: ytdl.videoInfo): Promise<void> {
    await this.youtubeRepository.downloadMusic(info, this.onDownloadProgress(music));
    music.downloadState = MusicDownloadState.DOWNLOADED;
    await this.musicRepository.setDownloadState(music.id!, MusicDownloadState.DOWNLOADED);
  }

  private onDownloadProgress(music: Music): (videoInfo: ytdl.videoInfo, percent: number) => void {
    const interval = 10;
    let lastStep = 0;
    return (videoInfo, percent) => {
      if (percent < lastStep) {
        return;
      }

      lastStep = percent + interval - (percent % interval);
      logger.info(`${videoInfo.title}: downloading ${percent}%`);
      this.sseService.send('downloadProgress', { id: music.id, progress: percent });
    };
  }
}
