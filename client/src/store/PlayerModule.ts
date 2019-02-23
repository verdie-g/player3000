import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Vue } from 'vue-property-decorator';

import playlistService from '../service/PlaylistService';
import store from './index';
import { Music } from '../model/Music';
import { Playlist } from '../model/Playlist';

@Module({ store, dynamic: true, name: 'player' })
class PlayerModule extends VuexModule {
  playingMusic?: Music = undefined;
  playlist: Playlist = { queue: [], currentIdx: -1 };
  playlistItemProgression: { [track: number]: number } = {};

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
  setPlaylistItemDownloadProgress(track: number, downloadProgress: number) {
    this.playlistItemProgression[track] = downloadProgress;
  }

  @Action
  async enqueueMusic(music: Music) {
    this.addToQueue(music);
    const created = await playlistService.enqueueMusic(music.videoId);
    this.replaceMusic({ old: music, n: created });
    this.setPlaylistItemDownloadProgress(created.track!, 0);
  }
}

export default getModule(PlayerModule);