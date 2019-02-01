import * as ytdl from 'ytdl-core';

export class YoutubeDownloadRequest {
  constructor(
    public videoInfo: ytdl.videoInfo,
    public cb: (videoInfo: ytdl.videoInfo, data?: any) => void,
    public cbData?: any,
  ) {
  }
}
