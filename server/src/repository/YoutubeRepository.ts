import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import * as ytdl from 'ytdl-core';
import fetch from 'node-fetch';
import { injectable } from 'inversify';

import { YoutubeSearchOptions, YoutubeSearchResponse } from '../model/Youtube';
import { logger } from '../util/Logger';
import { uriEncode } from '../util/ObjectUtil';

export interface YoutubeRepository {
  search(term: string): Promise<YoutubeSearchResponse>;
  getInfo(videoId: string): Promise<ytdl.videoInfo>;
  downloadMusic(videoInfo: ytdl.videoInfo, onProgress: (videoInfo: ytdl.videoInfo, percent: number) => void): Promise<ytdl.videoInfo>;
}

const YOUTUBE_API_KEY: string = config.get('youtubeApiKey');
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const MUSIC_FOLDER: string = config.get('musicFolderPath');

const searchOptions: YoutubeSearchOptions = {
  part: 'snippet',
  maxResults: 10,
  topicId: '/m/04rlf', // Music
  type: 'video',
  videoCategoryId: '10', // Music
};

@injectable()
export class YoutubeRepositoryImpl implements YoutubeRepository  {
  public async search(term: string): Promise<YoutubeSearchResponse> {
    searchOptions.q = term;
    const res = await fetch(`${YOUTUBE_SEARCH_URL}?key=${YOUTUBE_API_KEY}&${uriEncode(searchOptions)}`);
    return res.json();
  }

  public getInfo(videoId: string): Promise<ytdl.videoInfo> {
    return ytdl.getInfo(videoId);
  }

  public downloadMusic(videoInfo: ytdl.videoInfo, onProgress: (videoInfo: ytdl.videoInfo, percent: number) => void): Promise<ytdl.videoInfo> {
    return new Promise((resolve, _) => {
      const stream = ytdl.downloadFromInfo(videoInfo, {
        quality: 'highestaudio',
        filter: 'audioonly',
      })
        .on('progress', (_: number, downloaded: number, total: number) => {
          const percent = Math.floor(100 * downloaded / total);
          onProgress(videoInfo, percent);
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
