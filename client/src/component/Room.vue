<template>
  <div>
    <Search @select="onMusicSelect" />
    <Player :music="playingMusic" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Player from './Player.vue';
import Search from './Search.vue';

import { Music } from '../model/Music';

@Component({
  components: {
    Player,
    Search,
  },
})
export default class Room extends Vue {
  playingMusic?: Music;

  data() { return { playingMusic: undefined }; }

  onMusicSelect(music: Music) {
    console.log('selected', music);
    this.playingMusic = music;
  }
}
</script>

<style scoped>
</style>
