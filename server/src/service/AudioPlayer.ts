import * as config from 'config';
import * as path from 'path';
import { injectable } from 'inversify';
import { ChildProcess, spawn } from 'child_process';
import { Music } from '../model/Music';
import { PlayerQueueItem } from '../model/PlayerQueueItem';
import { Playlist } from '../model/Playlist';
import { logger } from '../util/Logger';

export interface AudioPlayer {
  getPlaylist(): Playlist;
  enqueue(music: Music, downloadPromise?: Promise<void>): void;
  play(): void;
  stop(): void;
  next(): void;
  previous(): void;
}

const MUSIC_FOLDER: string = config.get('musicFolderPath');

@injectable()
export class AudioPlayerImpl implements AudioPlayer {
  private queue: PlayerQueueItem[];
  private currentMusicIdx: number;
  private playing: boolean;          // player is waiting for a download to start or is playing
  private vlcProcess?: ChildProcess; // if !== undefined => playing = true and a music is necessarily playing

  constructor() {
    this.queue = [];
    this.currentMusicIdx = 0;
    this.vlcProcess = undefined;
    this.playing = false;
  }

  public getPlaylist(): Playlist {
    return {
      queue: this.queue.map(item => item.music),
      currentIdx: this.currentMusicIdx,
    };
  }

  public enqueue(music: Music, downloadPromise?: Promise<void>) {
    const item = new PlayerQueueItem(music, downloadPromise);
    this.queue.push(item);

    if (!item.ready) {
      item.downloadPromise!.then(() => { item.ready = true; });
    }

    if (!this.playing) {
      this.play();
    }
  }

  public play() {
    logger.debug('play');

    if (this.playing) {
      logger.debug('already playing');
      return;
    }

    if (this.currentMusicIdx >= this.queue.length) {
      logger.debug('out of bound');
      return;
    }

    this.playing = true;
    const current = this.queue[this.currentMusicIdx];

    if (current.ready) {
      this.spawnVlc(current.music);
      return;
    }

    const oldIdx = this.currentMusicIdx;
    current.downloadPromise!.then(() => {
      const newIdx = this.currentMusicIdx;
      logger.debug(`oldIdx: ${oldIdx}, newIdx: ${newIdx}, vlcProcess: ${this.vlcProcess}`);

      if (oldIdx !== newIdx) {
        logger.debug(`at end of download, ${current.music.title} is no longer the current music`);
        return;
      }

      if (this.vlcProcess !== undefined) {
        logger.debug(`at end of download, ${current.music.title} is already playing (because of multiple 'then' attached to the promise)`);
        return;
      }

      this.spawnVlc(current.music);
    });
  }

  public stop() {
    logger.debug('stop');
    if (this.vlcProcess) {
      logger.debug('kill vlc');
      this.vlcProcess.removeAllListeners('exit');
      this.vlcProcess.kill();
      this.vlcProcess = undefined;
    }
    this.playing = false;
  }

  public next() {
    logger.debug('next');
    if (this.currentMusicIdx + 1 >= this.queue.length) {
      logger.debug('out of bound');
      return;
    }
    this.stop();
    this.currentMusicIdx += 1;
    this.play();
  }

  public previous() {
    logger.debug('previous');
    if (this.currentMusicIdx - 1 < 0) {
      logger.debug('out of bound');
      return;
    }
    this.stop();
    this.currentMusicIdx -= 1;
    this.play();
  }

  private spawnVlc(music: Music) {
    logger.debug('spawnVlc');
    const musicPath = path.join(MUSIC_FOLDER, music.title);
    this.vlcProcess = spawn('cvlc', ['--no-video', '--play-and-exit', '--quiet', musicPath])
      .on('exit', (code) => {
        const log = code === 0 ? logger.info : logger.error;
        log(`cvlc: exited with code ${code}`);

        this.vlcProcess = undefined;
        this.playing = false;
        this.next();
      });

    this.vlcProcess.stderr.on('data', (data) => {
      logger.warn(`cvlc: ${data}`);
    });

    logger.info(`${music.title}: start playing`);
  }
}
