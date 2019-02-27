import { Music } from './Music';

export interface Playlist {
  queue: Music[];
  currentIdx: number;
  playing: boolean;
}
