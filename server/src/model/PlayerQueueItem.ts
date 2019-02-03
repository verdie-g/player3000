import { Music } from './Music';

export class PlayerQueueItem {
  public ready: boolean;

  constructor(
    public music: Music,
    public downloadPromise?: Promise<void>) {
    this.ready = downloadPromise === undefined;
  }
}
