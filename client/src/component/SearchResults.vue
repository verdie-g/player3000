<template>
  <ul>
    <li v-for="music in musics" @click="onSelect(music)">
      {{music.title}}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import musicModule from '../store/MusicModule';
import playerModule from '../store/PlayerModule';
import { Music } from '../model/Music';

@Component({
  components: {},
})
export default class SearchResults extends Vue {
  get musics() {
    return musicModule.searchResults;
  }

  onSelect(music: Music) {
    playerModule.enqueueMusic(music);
  }
}
</script>

<style scoped>
</style>
