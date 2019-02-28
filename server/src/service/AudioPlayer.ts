import * as config from 'config';
import * as path from 'path';
import { injectable } from 'inversify';
import { ChildProcess, spawn } from 'child_process';

import { Music } from '../model/Music';
import { Playlist, PlaylistQueueItem } from '../model/Playlist';
import { logger } from '../util/Logger';

const MUSIC_FOLDER: string = config.get('musicFolderPath');

export interface AudioPlayer {
  getPlaylist(): Playlist;
  enqueue(music: Music, downloadPromise?: Promise<void>): Music;
  play(): void;
  stop(): void;
  next(): void;
  previous(): void;
}

@injectable()
export class AudioPlayerImpl implements AudioPlayer {
  private track: number;
  private queue: PlaylistQueueItem[];
  private currentMusicIdx: number;
  private playing: boolean;          // player is waiting for a download to start or is playing
  private vlcProcess?: ChildProcess; // if !== undefined => playing = true and a music is necessarily playing

  constructor() {
    this.track = 1;
    this.queue = [];
    this.currentMusicIdx = -1;
    this.vlcProcess = undefined;
    this.playing = false;
  }

  public getPlaylist(): Playlist {
    return {
      queue: this.queue.map(item => item.music),
      currentIdx: this.currentMusicIdx,
      playing: this.playing,
    };
  }

  public enqueue(music: Music, downloadPromise?: Promise<void>): Music {
    music.track = this.track;
    this.track += 1;

    const item = new PlaylistQueueItem(music, downloadPromise);
    this.queue.push(item);

    if (!item.ready) {
      item.downloadPromise!.then(() => { item.ready = true; });
    }

    if (!this.playing) {
      this.next();
    }

    return music;
  }

  public play() {
    logger.debug('player: play');

    if (this.playing) {
      logger.debug('player: already playing');
      return;
    }

    if (this.currentMusicIdx >= this.queue.length) {
      logger.debug('player: out of bound');
      return;
    }

    this.playing = true;
    const current = this.queue[this.currentMusicIdx];

    if (current.ready) {
      logger.debug(`player: ${current.music.title} is ready`);
      this.startVlc(current.music);
      return;
    }

    if (current.playThen) {
      logger.debug(`player: ${current.music.title} already has a callback but is not ready. Waiting for the callback to fire`);
      return;
    }

    logger.debug(`player: ${current.music.title} is not ready. Attaching play callback`);
    current.playThen = true;
    const oldIdx = this.currentMusicIdx;
    current.downloadPromise!.then(() => {
      const newIdx = this.currentMusicIdx;
      logger.debug(`player: oldIdx: ${oldIdx}, newIdx: ${newIdx}`);

      if (oldIdx !== newIdx) {
        logger.debug(`player: ${current.music.title} is no longer the current music at download end`);
        return;
      }

      this.startVlc(current.music);
    });
  }

  public stop() {
    logger.debug('player: stop');

    if (!this.playing) {
      logger.debug('player: already stopped');
      return;
    }

    this.stopVlc();
    this.playing = false;
  }

  public next() {
    logger.debug('player: next');

    if (this.currentMusicIdx + 1 >= this.queue.length) {
      logger.debug('player: out of bound');
      return;
    }

    this.stop();
    this.currentMusicIdx += 1;
    this.play();
  }

  public previous() {
    logger.debug('player: previous');

    if (this.currentMusicIdx - 1 < 0) {
      logger.debug('player: out of bound');
      return;
    }

    this.stop();
    this.currentMusicIdx -= 1;
    this.play();
  }

  private startVlc(music: Music) {
    logger.debug('player: start vlc');

    if (this.vlcProcess) {
      logger.warn('player: vlc is already started');
      return;
    }

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
      logger.warn(`player: cvlc: ${data}`);
    });

    logger.info(`player: ${music.title} starts playing`);
  }

  private stopVlc() {
    logger.debug('player: stop vlc');

    if (!this.vlcProcess) {
      logger.warn('player: vlc is already stopped');
      return;
    }

    this.vlcProcess.removeAllListeners('exit');
    this.vlcProcess.kill();
    this.vlcProcess = undefined;
  }
}
