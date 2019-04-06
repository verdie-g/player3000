import * as config from 'config';
import * as path from 'path';
import { ChildProcess, spawn } from 'child_process';
import { injectable } from 'inversify';

import { Music } from '../model/Music';
import { logger } from '../util/Logger';

const MUSIC_FOLDER: string = config.get('musicFolderPath');

export interface AudioProcess {
  start(music: Music, onExit: () => void): void;
  stop(): void;
}

@injectable()
export class VlcAudioProcess implements AudioProcess {
  private process?: ChildProcess; // if !== undefined => a music is playing

  constructor() {
    this.process = undefined;
  }

  start(music: Music, onEnd: () => void) {
    logger.debug('vlc: start');

    if (this.process !== undefined) {
      logger.error('vlc: already started');
      return;
    }

    const musicPath = path.join(MUSIC_FOLDER, music.videoId);
    this.process = spawn('cvlc', ['--no-video', '--play-and-exit', '--quiet', musicPath]);
    this.process.on('exit', (code) => {
      const log = code === 0 ? logger.info : logger.error;
      log(`vlc: exited with code ${code}`);

      this.process = undefined;
      onEnd();
    });

    logger.info(`vlc: ${music.title} starts playing`);
  }

  stop() {
    logger.debug('vlc: stop');

    if (!this.process) {
      logger.debug('vlc: already stopped');
      return;
    }

    this.process.removeAllListeners('exit');
    this.process.kill();
    this.process = undefined;
  }
}
