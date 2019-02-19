import apiService from './ApiService';
import { Music } from '../model/Music';

class MusicService {
  public search(query: string): Promise<Music> {
    return apiService.get(`/musics/search?q=${query}`);
  }
}

export default new MusicService();
