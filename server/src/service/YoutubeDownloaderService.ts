import * as config from 'config';
import * as fs from 'fs';
import * as path from 'path';
import * as ytdl from 'ytdl-core';
import { fork, ChildProcess } from 'child_process';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { YoutubeDownloadRequest } from '../model/YoutubeDownloadRequest';
import { YoutubeService, YouTubeResponse, YouTubeSearchResults } from './YoutubeService';
import { logger } from '../util/Logger';

const MUSIC_FOLDER: string = config.get('musicFolderPath');

export interface YoutubeDownloaderService {
  downloadMusic(req: YoutubeDownloadRequest): void;
}

@injectable()
export class YoutubeDownloaderServiceImpl implements YoutubeDownloaderService {
  @inject(TYPES.YoutubeService)
  private youtubeService: YoutubeService;

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
