import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Vue } from 'vue-property-decorator';

import playlistService from '../service/PlaylistService';
import store from './index';
import { Music } from '../model/Music';
import { Playlist } from '../model/Playlist';

@Module({ store, dynamic: true, name: 'player' })
class PlayerModule extends VuexModule {
  playlist: Playlist = { queue: [], currentIdx: -1, playing: false };
  playlistLoading: boolean = false;
  musicDownloadProgression: { [musicId: number]: number } = {};

  get playingMusic() {
    return this.playlist.queue[this.playlist.currentIdx];
  }

  @Mutation
  addToQueue(item: Music) {
    this.playlist.queue.push(item);
  }

  @Mutation
  replaceMusic({ old, n }: { old: Music; n: Music; }) {
    const oldIdx = this.playlist.queue.findIndex(el => el === old);
    Vue.set(this.playlist.queue, oldIdx, n);
  }

  @Mutation
  updatePlaylist(playlist: Playlist) {
    this.playlist = playlist;
  }

  @Mutation
  setPlaylistLoading(loading: boolean) {
    this.playlistLoading = loading;
  }

  @Mutation
  setMusicDownloadProgression({ musicId, progress }: { musicId: number; progress: number; }) {
    Vue.set(this.musicDownloadProgression, musicId, progress);
  }

  @Action({ commit: 'updatePlaylist' })
  async getPlaylist() {
    this.setPlaylistLoading(true);
    const playlist = await playlistService.getPlaylist();
    this.setPlaylistLoading(false);
    return playlist;
  }

  @Action
  async enqueueMusic(music: Music) {
    this.addToQueue(music);
    const created = await playlistService.enqueueMusic(music.videoId);
    this.replaceMusic({ old: music, n: created });
    this.setMusicDownloadProgression({ musicId: created.id!, progress: 0 });
  }
}

export default getModule(PlayerModule);
