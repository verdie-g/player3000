import { injectable } from 'inversify';
import * as config from 'config';
import * as youtubeSearch from 'youtube-search';

export { YouTubeThumbnail, YouTubeSearchResultThumbnails, YouTubeSearchResults, YouTubeSearchPageResults } from 'youtube-search';

export interface YouTubeResponse {
  results: youtubeSearch.YouTubeSearchResults[];
  pageInfo: youtubeSearch.YouTubeSearchPageResults;
}

export interface YoutubeService {
  search(term: string): Promise<YouTubeResponse>;
}

const YOUTUBE_API_KEY: string = config.get('youtubeApiKey');

@injectable()
export class YoutubeServiceImpl {
  static options: youtubeSearch.YouTubeSearchOptions = {
    part: 'snippet',
    maxResults: 5,
    // topicId: '/m/04rlf' // Music
    type: 'video',
    videoCategoryId: '10', // Music
    key: YOUTUBE_API_KEY,
  };

  public search(term: string): Promise<YouTubeResponse> {
    return youtubeSearch(term, YoutubeServiceImpl.options);
  }
}
