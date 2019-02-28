<template>
  <div class="container">
    <div class="player">
      <img :src="music.thumbHighUrl" class="player-img" />
      <div class="player-title is-size-4">{{music.title}}</div>
      <ul class="player-controls is-size-5">
        <li @click="previous"><b-icon icon="skip-previous" size="is-large"></b-icon></li>
        <li v-if="playing" @click="stop"><b-icon icon="stop" size="is-large" /></li>
        <li v-else @click="play"><b-icon icon="play" size="is-large" /></li>
        <li @click="next"><b-icon icon="skip-next" size="is-large" /></li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import playerModule from '../store/PlayerModule';
import serverEvents from '../service/ServerEventsService';
import { Music, MusicDownloadState } from '../model/Music';

const emptyMusic: Music = {
  videoId: '',
  title: 'no music',
  description: '',
  duration: 0,
  downloadState: MusicDownloadState.NOT_DOWNLOADED,
  thumbSmallUrl: 'https://play-music.gstatic.com/fe/729694752b42e97e27f106c7aada2cdf/default_album.svg',
  thumbMediumUrl: 'https://play-music.gstatic.com/fe/729694752b42e97e27f106c7aada2cdf/default_album.svg',
  thumbHighUrl: 'https://play-music.gstatic.com/fe/729694752b42e97e27f106c7aada2cdf/default_album.svg',
};

@Component({
  components: {},
})
export default class Player extends Vue {
  get music() {
    return playerModule.playingMusic || emptyMusic;
  }

  get playing() {
    return playerModule.playlist.playing;
  }

  mounted() {
    serverEvents.on('play', data => playerModule.playMusic(data.track));
    serverEvents.on('stop', data => playerModule.stopMusic(data.track));
    serverEvents.on('next', data => playerModule.nextMusic(data.track));
    serverEvents.on('previous', data => playerModule.previousMusic(data.track));
    serverEvents.on('enqueue', data => playerModule.enqueueMusic(data.music));
  }

  previous() {
    playerModule.previousMusic();
  }

  stop() {
    playerModule.stopMusic();
  }

  play() {
    playerModule.playMusic();
  }

  next() {
    playerModule.nextMusic();
  }
}
</script>

<style scoped>
.container {
  text-align: center;
}

.player {
  display: inline-block;
}

.player-img {
  width: 336px;
  height: 188px;
  background-color: #d8d8d8;
}

.player-title {
  text-align: center;
}

.player-controls li {
  display: inline-block;
}
</style>
