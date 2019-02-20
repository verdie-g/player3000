<template>
  <div>
    <Search @select="onMusicSelect" />
    <Player :music="playingMusic" />
    <PlayerQueue :queue="musicQueue" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Player from './Player.vue';
import PlayerQueue from './PlayerQueue.vue';
import Search from './Search.vue';

import { Music } from '../model/Music';
import playlistService from '../service/PlaylistService';

@Component({
  components: {
    Player,
    PlayerQueue,
    Search,
  },
})
export default class Room extends Vue {
  musicQueue: Music[] = [];
  playingMusic?: Music;

  data() { return { playingMusic: undefined }; }

  onMusicSelect(music: Music) {
    playlistService.enqueueMusic(music.videoId).then((m) => {
      this.musicQueue.push(m);
    });
  }
}
</script>

<style scoped>
</style>
