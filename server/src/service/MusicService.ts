import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { YoutubeService, YouTubeResponse, YouTubeSearchResults } from './YoutubeService';
import { MusicSearch } from '../model/Music';

export interface MusicService {
  searchMusic(query: string): Promise<MusicSearch[]>;
}

@injectable()
export class MusicServiceImpl implements MusicService {
  @inject(TYPES.YoutubeService)
  private youtubeService: YoutubeService;

  public async searchMusic(query: string): Promise<MusicSearch[]> {
    const ytRes: YouTubeResponse = await this.youtubeService.search(query);
    return ytRes.results.map((result: YouTubeSearchResults) => ({
      videoId: result.id,
      title: result.title,
      description: result.description,
      thumbUrl: result.thumbnails.default.url,
    }));
  }
}
