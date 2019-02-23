export { Playlist } from '../../../common/model/Playlist';
import { Music } from './Music';

export class PlaylistQueueItem {
  public ready: boolean;
  public playThen: boolean;

  constructor(
    public music: Music,
    public downloadPromise?: Promise<void>) {
    this.ready = downloadPromise === undefined;
    this.playThen = false;
  }
}
