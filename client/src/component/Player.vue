<template>
  <div v-if="music">
    <img :src="music.thumbUrl" width=64 />
    <span>{{music.title}}</span>
    <ul>
      <li @click="previous"><v-icon name="backward" /></li>
      <li @click="stop"><v-icon name="stop" /></li>
      <li @click="play"><v-icon name="play" /></li>
      <li @click="next"><v-icon name="forward" /></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'vue-awesome/icons/backward';
import 'vue-awesome/icons/stop';
import 'vue-awesome/icons/play';
import 'vue-awesome/icons/forward';

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
