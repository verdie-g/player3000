export enum MusicDownloadState {
  NOT_DOWNLOADED,
  DOWNLOADING,
  DOWNLOADED,
}

export class Music {
  public videoId: string;
  public title: string;
  public description: string;
  public duration: number;
  public thumbUrl: string;
  public downloadState: MusicDownloadState;
  public id?: number;
}
