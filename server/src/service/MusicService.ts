import * as ytdl from 'ytdl-core';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { Music, MusicDownloadState } from '../model/Music';
import { MusicRepository } from '../repository/MusicRepository';
import { YoutubeRepository, YouTubeResponse, YouTubeSearchResults } from '../repository/YoutubeRepository';
import { getOr } from '../util/ObjectUtil';

export interface MusicService {
  searchMusic(query: string): Promise<Music[]>;
  downloadMusic(videoId: string): Promise<Music>;
}

@injectable()
export class MusicServiceImpl implements MusicService {
  @inject(TYPES.YoutubeRepository)
  private youtubeRepository: YoutubeRepository;

  @inject(TYPES.MusicRepository)
  private musicRepository: MusicRepository;

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
      thumbUrl: result.thumbnails.default.url,
      downloadState: getOr(downloadStatesByVideoId, result.id, MusicDownloadState.NOT_DOWNLOADED),
    }));
  }

  public async downloadMusic(videoId: string): Promise<Music> {
    let music = await this.musicRepository.getByVideoId(videoId);
    if (!music) {
      const info = await this.youtubeRepository.getInfo(videoId);

      music = await this.musicRepository.create({
        videoId,
        title: info.title,
        description: info.description,
        duration: parseInt(info.length_seconds, 10),
        thumbUrl: info.thumbnail_url,
        downloadState: MusicDownloadState.DOWNLOADING,
      });

      this.youtubeRepository.downloadMusic(info).then(async () => {
        await this.musicRepository.setDownloadState(music.id, MusicDownloadState.DOWNLOADED);
      });
    }

    return music;
  }
}
