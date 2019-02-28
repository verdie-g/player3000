import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';
import { Vue } from 'vue-property-decorator';

import playlistService from '../service/PlaylistService';
import store from './index';
import { Music, MusicDownloadState } from '../model/Music';
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

  @Mutation
  setPlaylistPlaying(playing: boolean) {
    this.playlist.playing = playing;
  }

  @Mutation
  incrementCurrentIdx() {
    this.playlist.currentIdx += 1;
  }

  @Mutation
  decrementCurrentIdx() {
    this.playlist.currentIdx -= 1;
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
    const serverSent = music.track !== undefined;
    if (serverSent) {
      this.addToQueue(music);
      if (music.downloadState !== MusicDownloadState.DOWNLOADED) {
        this.setMusicDownloadProgression({ musicId: music.id!, progress: 0 });
      }
    } else {
      await playlistService.enqueueMusic(music.videoId);
    }
  }

  @Action
  async playMusic(track?: number) {
    if (this.playingMusic === undefined || this.playlist.playing) {
      return;
    }

    this.setPlaylistPlaying(true);
    if (track !== undefined) {
      if (track !== this.playingMusic.track) { console.error('client and server and desynchronized'); }
      return;
    }

    await playlistService.playMusic();
  }

  @Action
  async stopMusic(track?: number) {
    if (!this.playlist.playing) {
      return;
    }

    this.setPlaylistPlaying(false);
    if (track !== undefined) {
      if (track !== this.playingMusic.track) { console.error('client and server and desynchronized'); }
      return;
    }

    await playlistService.stopMusic();
  }

  @Action
  async nextMusic(track?: number) {
    if (this.playlist.currentIdx + 1 >= this.playlist.queue.length) {
      return;
    }

    if (track !== undefined) {
      this.incrementCurrentIdx();
    } else {
      await playlistService.nextMusic();
    }
  }

  @Action
  async previousMusic(track?: number) {
    if (this.playlist.currentIdx - 1 < 0) {
      return;
    }

    if (track !== undefined) {
      this.decrementCurrentIdx();
    } else {
      await playlistService.previousMusic();
    }
  }
}

export default getModule(PlayerModule);
