<template>
  <ul>
    <li v-for="music in queue" :key="music.track">
      {{music.title}}
      <span v-if="music.track === undefined"> (loading...)</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import playerModule from '../store/PlayerModule';
import { Music, MusicDownloadState } from '../model/Music';

@Component({
  components: {},
})
export default class PlayerQueue extends Vue {
  get queue() {
    return playerModule.playlist.queue;
  }
}
</script>

<style scoped>
</style>
