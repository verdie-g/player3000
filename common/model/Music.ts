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
  thumbUrl: string;
  downloadState: MusicDownloadState;
  id?: number;
}
