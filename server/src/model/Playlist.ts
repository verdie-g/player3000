import { Music } from './Music';

export interface Playlist {
  public queue: Music[];
  public currentIdx: number;
}
