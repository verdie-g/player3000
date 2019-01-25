export class MusicSearch {
  public videoId: string;
  public title: string;
  public description: string;
  public thumbUrl: string;
}

export enum MusicDownloadState {
  DOWNLOADING,
  DOWNLOADED,
}

export class Music extends MusicSearch {
  public downloadState: MusicDownloadState;
  public id?: number;
}
