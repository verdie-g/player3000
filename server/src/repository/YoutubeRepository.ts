import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import * as youtubeSearch from 'youtube-search';
import * as ytdl from 'ytdl-core';
import { injectable } from 'inversify';
import { YoutubeDownloadRequest } from '../model/YoutubeDownloadRequest';
import { logger } from '../util/Logger';

export { YouTubeThumbnail, YouTubeSearchResultThumbnails, YouTubeSearchResults, YouTubeSearchPageResults } from 'youtube-search';

export interface YouTubeResponse {
  results: youtubeSearch.YouTubeSearchResults[];
  pageInfo: youtubeSearch.YouTubeSearchPageResults;
}

export interface YoutubeRepository {
  search(term: string): Promise<YouTubeResponse>;
  downloadMusic(req: YoutubeDownloadRequest): void;
}

const YOUTUBE_API_KEY: string = config.get('youtubeApiKey');
const MUSIC_FOLDER: string = config.get('musicFolderPath');

const searchOptions: youtubeSearch.YouTubeSearchOptions = {
  part: 'snippet',
  maxResults: 5,
  // topicId: '/m/04rlf' // Music
  type: 'video',
  videoCategoryId: '10', // Music
  key: YOUTUBE_API_KEY,
};

@injectable()
export class YoutubeRepositoryImpl implements YoutubeRepository  {
  public search(term: string): Promise<YouTubeResponse> {
    return youtubeSearch(term, searchOptions);
  }

  public downloadMusic(req: YoutubeDownloadRequest) {
    const stream = ytdl(req.videoId, {
      quality: 'highestaudio',
      filter: 'audioonly',
    })
    .on('progress', (chunkLength: number, downloaded: number, total: number) => {
      const percent = Number(100 * downloaded / total).toFixed(2);
      logger.info(`${req.videoId}: downloading ${percent}%...`);
    })
    .on('end', () => {
      logger.info(`${req.videoId}: end download`);
      req.cb(req.videoId, req.cbData);
    });

    const musicPath = path.join(MUSIC_FOLDER, req.videoId);
    logger.info(`${req.videoId}: start downloading to ${musicPath}`);
    stream.pipe(fs.createWriteStream(musicPath));
  }
}
