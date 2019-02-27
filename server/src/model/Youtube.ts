export interface YoutubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YoutubeThumbnails {
  default: YoutubeThumbnail; // 120x90
  medium: YoutubeThumbnail;  // 320x180
  high: YoutubeThumbnail;    // 480x360
}

export interface YoutubeSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: YoutubeThumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
}

export interface YoutubeItemId {
  kind: string;
  videoId: string;
}

export interface YoutubeItem {
  kind: string;
  etag: string;
  id: YoutubeItemId;
  snippet: YoutubeSnippet;
}

export interface YoutubePageInfo {
  totalResults: number;
  resultsPerPage: number;
}

export interface YoutubeSearchResponse {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: YoutubePageInfo;
  items: YoutubeItem[];
}

export interface YoutubeSearchOptions {
  part?: string;
  forContentOwner?: boolean;
  forDeveloper?: boolean;
  forMine?: boolean;
  relatedToVideoId?: string;
  channelId?: string;
  channelType?: string;
  eventType?: string;
  location?: string;
  locationRadius?: string;
  maxResults?: number;
  onBehalfOfContentOwner?: string;
  order?: string;
  pageToken?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  q?: string;
  regionCode?: string;
  relevanceLanguage?: string;
  safeSearch?: string;
  topicId?: string;
  type?: string;
  videoCaption?: string;
  videoCategoryId?: string;
  videoDefinition?: string;
  videoDimension?: string;
  videoDuration?: string;
  videoEmbeddable?: string;
  videoLicense?: string;
  videoSyndicated?: string;
  videoType?: string;
}
