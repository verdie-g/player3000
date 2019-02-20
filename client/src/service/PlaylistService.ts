import apiService from './ApiService';
import { Music } from '../model/Music';

class PlaylistService {
  public getPlaylist(): Promise<Music[]> {
    return apiService.get('/playlist');
  }

  public enqueueMusic(videoId: string): Promise<Music> {
    return apiService.post('/playlist', { videoId });
  }

  public playMusic(): Promise<void> {
    return apiService.put('/playlist/play');
  }

  public stopMusic(): Promise<void> {
    return apiService.put('/playlist/stop');
  }

  public nextMusic(): Promise<void> {
    return apiService.put('/playlist/next');
  }

  public previousMusic(): Promise<void> {
    return apiService.put('/playlist/previous');
  }
}

export default new PlaylistService();
