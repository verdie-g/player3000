<template>
  <div v-if="music" class="container">
    <img :src="music.thumbUrl" width=64 />
    <span>{{music.title}}</span>
    <ul>
      <li @click="previous"><b-icon icon="skip-previous"></b-icon></li>
      <li @click="stop"><b-icon icon="stop" /></li>
      <li @click="play"><b-icon icon="play" /></li>
      <li @click="next"><b-icon icon="skip-next" /></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import playerModule from '../store/PlayerModule';
import playlistService from '../service/PlaylistService';
import { Music, MusicDownloadState } from '../model/Music';

const emptyMusic: Music = {
  videoId: '',
  title: '',
  description: '',
  duration: 0,
  downloadState: MusicDownloadState.NOT_DOWNLOADED,
  thumbUrl: 'https://play-music.gstatic.com/fe/729694752b42e97e27f106c7aada2cdf/default_album.svg',
};

@Component({
  components: {},
})
export default class Player extends Vue {
  get music() {
    return playerModule.playingMusic || emptyMusic;
  }

  previous() {
    playlistService.previousMusic();
  }

  stop() {
    playlistService.stopMusic();
  }

  play() {
    playlistService.playMusic();
  }

  next() {
    playlistService.nextMusic();
  }
}
</script>

<style scoped>
</style>
