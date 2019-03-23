import { injectable, inject } from 'inversify';

import TYPES from '../types';
import { AudioProcess } from '../service/AudioProcess';
import { Music } from '../model/Music';
import { Playlist, PlaylistQueueItem } from '../model/Playlist';
import { SSEService } from '../service/SSEService';
import { logger } from '../util/Logger';

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
  private playing: boolean; // player is waiting for a download to start or is playing

  constructor(
    @inject(TYPES.SSEService) private sseService: SSEService,
    @inject(TYPES.AudioProcess) private audioProcess: AudioProcess,
  ) {
    this.track = 1;
    this.queue = [];
    this.currentMusicIdx = -1;
    this.playing = false;
  }

  get current() {
    return this.queue[this.currentMusicIdx];
  }

  public getPlaylist(): Playlist {
    return {
      queue: this.queue.map(item => item.music),
      currentIdx: this.currentMusicIdx,
      playing: this.playing,
    };
  }

  public enqueue(music: Music, downloadPromise?: Promise<void>): Music {
    logger.debug(`player: enqueue ${music.title}`);

    music.track = this.track;
    this.track += 1;

    const item = new PlaylistQueueItem(music, downloadPromise);
    this.queue.push(item);
    this.sseService.send('enqueue', { music });

    if (!item.ready) {
      item.downloadPromise!.then(() => { item.ready = true; });
    }

    if (!this.playing) {
      logger.debug('player: nothing is playing');
      this.playing = true;
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

    this.sseService.send('play', { track: this.current.music.track });
    this.playing = true;
    this.playCurrent();
  }

  public stop() {
    logger.debug('player: stop');

    if (!this.playing) {
      logger.debug('player: already stopped');
      return;
    }

    this.sseService.send('stop', { track: this.current.music.track });
    this.audioProcess.stop();
    this.playing = false;
  }

  public next() {
    logger.debug('player: next');

    if (this.currentMusicIdx + 1 >= this.queue.length) {
      logger.debug('player: out of bound');
      return;
    }

    this.currentMusicIdx += 1;
    this.sseService.send('next', { track: this.current.music.track });
    if (!this.playing) {
      logger.debug('player: not playing');
      return;
    }

    this.audioProcess.stop();
    this.playCurrent();
  }

  public previous() {
    logger.debug('player: previous');

    if (this.currentMusicIdx - 1 < 0) {
      logger.debug('player: out of bound');
      return;
    }

    this.currentMusicIdx -= 1;
    this.sseService.send('previous', { track: this.current.music.track });
    if (!this.playing) {
      logger.debug('player: not playing');
      return;
    }

    this.audioProcess.stop();
    this.playCurrent();
  }

  private playCurrent() {
    logger.debug('player: play current');

    if (this.currentMusicIdx < 0 || this.currentMusicIdx >= this.queue.length) {
      logger.error('player: out of bound');
      return;
    }

    const current = this.current;

    if (current.ready) {
      logger.debug(`player: ${current.music.title} is ready`);
      this.audioProcess.start(current.music, this.onMusicEnd);
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

      this.audioProcess.start(current.music, this.onMusicEnd);
    });
  }

  private onMusicEnd() {
    this.playing = false;
    this.next();
  }
}
