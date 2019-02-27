export enum MusicDownloadState {
  NOT_DOWNLOADED,
  DOWNLOADING,
  DOWNLOADED,
}

export interface Music {
  videoId: string;
  title: string;
  description: string;
  duration: number;
  thumbSmallUrl: string;  // 168x94
  thumbMediumUrl: string; // 246x138
  thumbHighUrl: string;   // 336x188
  downloadState: MusicDownloadState;
  id?: number;
  track?: number;
}
