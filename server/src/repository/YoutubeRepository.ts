import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import * as youtubeSearch from 'youtube-search';
import * as ytdl from 'ytdl-core';
import { injectable } from 'inversify';
import { logger } from '../util/Logger';

export { YouTubeThumbnail, YouTubeSearchResultThumbnails, YouTubeSearchResults, YouTubeSearchPageResults } from 'youtube-search';

export interface YouTubeResponse {
  results: youtubeSearch.YouTubeSearchResults[];
  pageInfo: youtubeSearch.YouTubeSearchPageResults;
}

export interface YoutubeRepository {
  search(term: string): Promise<YouTubeResponse>;
  getInfo(videoId: string): Promise<ytdl.videoInfo>;
  downloadMusic(videoInfo: ytdl.videoInfo): Promise<ytdl.videoInfo>;
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

  public getInfo(videoId: string): Promise<ytdl.videoInfo> {
    return ytdl.getInfo(videoId);
  }

  public downloadMusic(videoInfo: ytdl.videoInfo): Promise<ytdl.videoInfo> {
    return new Promise((resolve, _) => {
      const stream = ytdl.downloadFromInfo(videoInfo, {
        quality: 'highestaudio',
        filter: 'audioonly',
      })
      .on('progress', (_: number, downloaded: number, total: number) => {
        const percent = Number(100 * downloaded / total).toFixed(2);
        logger.info(`${videoInfo.title}: downloading ${percent}%...`);
      })
      .on('end', () => {
        logger.info(`${videoInfo.title}: end download`);
        resolve(videoInfo);
      });

      const musicPath = path.join(MUSIC_FOLDER, videoInfo.title);
      logger.info(`${videoInfo.title}: start downloading to ${musicPath}`);
      stream.pipe(fs.createWriteStream(musicPath));
    });
  }
}
