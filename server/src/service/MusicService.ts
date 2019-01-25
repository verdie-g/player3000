import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { MusicRepository } from '../repository/MusicRepository';
import { MusicSearch, Music, MusicDownloadState } from '../model/Music';
import { YoutubeDownloadRequest } from '../model/YoutubeDownloadRequest';
import { YoutubeDownloaderService } from '../service/YoutubeDownloaderService';
import { YoutubeService, YouTubeResponse, YouTubeSearchResults } from './YoutubeService';

export interface MusicService {
  searchMusic(query: string): Promise<MusicSearch[]>;
  playMusic(playerName: string, videoId: string): void;
}

@injectable()
export class MusicServiceImpl implements MusicService {
  @inject(TYPES.YoutubeService)
  private youtubeService: YoutubeService;

  @inject(TYPES.YoutubeDownloaderService)
  private youtubeDownloaderService: YoutubeDownloaderService;

  @inject(TYPES.MusicRepository)
  private musicRepository: MusicRepository;

  public async searchMusic(query: string): Promise<MusicSearch[]> {
    const ytRes: YouTubeResponse = await this.youtubeService.search(query);
    return ytRes.results.map((result: YouTubeSearchResults) => ({
      videoId: result.id,
      title: result.title,
      description: result.description,
      thumbUrl: result.thumbnails.default.url,
    }));
  }

  public async playMusic(playerName: string, videoId: string) {
    if (!(await this.musicRepository.existsWithVideoId(videoId))) {
      const music = await this.musicRepository.create({
        videoId,
        title: '',
        description: '',
        thumbUrl: '',
        downloadState: MusicDownloadState.DOWNLOADING,
      });

      const req = new YoutubeDownloadRequest(videoId, this.onMusicDownloadEnd.bind(this), music.id);
      this.youtubeDownloaderService.downloadMusic(req);
    }

    // add videoId to queue
  }

  private async onMusicDownloadEnd(videoId: string, musicId: number) {
    await this.musicRepository.setDownloadState(musicId, MusicDownloadState.DOWNLOADED);
  }
}
