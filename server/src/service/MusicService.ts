import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { Music, MusicDownloadState } from '../model/Music';
import { MusicRepository } from '../repository/MusicRepository';
import { YoutubeDownloadRequest } from '../model/YoutubeDownloadRequest';
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

    const downloadedByVideoIds =
      (await this.musicRepository.getDownloadedMusics(videoIds))
      .reduce((acc: any, curr: any) => {
        acc[curr.videoId] = curr.downloadState;
        return acc;
      }, {});

    return ytRes.results.map((result: YouTubeSearchResults) => ({
      videoId: result.id,
      title: result.title,
      description: result.description,
      thumbUrl: result.thumbnails.default.url,
      downloadState: getOr(downloadedByVideoIds, result.id, MusicDownloadState.NOT_DOWNLOADED),
    }));
  }

  public async downloadMusic(videoId: string): Promise<Music> {
    let music = await this.musicRepository.getByVideoId(videoId);
    if (!music) {
      music = await this.musicRepository.create({
        videoId,
        title: '',
        description: '',
        thumbUrl: '',
        downloadState: MusicDownloadState.DOWNLOADING,
      });

      const req = new YoutubeDownloadRequest(videoId, this.onMusicDownloadEnd.bind(this), music.id);
      this.youtubeRepository.downloadMusic(req);
    }

    return music;
  }

  private async onMusicDownloadEnd(_: string, musicId: number) {
    await this.musicRepository.setDownloadState(musicId, MusicDownloadState.DOWNLOADED);
  }
}
