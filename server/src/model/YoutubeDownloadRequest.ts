export class YoutubeDownloadRequest {
  constructor(
    public videoId: string,
    public cb: (videoId: string, data?: any) => void,
    public cbData?: any,
  ) {
  }
}
