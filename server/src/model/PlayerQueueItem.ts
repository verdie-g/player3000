import { Music } from './Music';

export class PlayerQueueItem {
  public music: Music;
  public downloadPromise: Promise<void>;
  public ready: boolean;
}
