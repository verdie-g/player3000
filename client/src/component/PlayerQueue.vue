<template>
  <ul>
    <li v-for="music in queue" :key="music.id">
      {{music.title}}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Music, MusicDownloadState } from '../model/Music';

@Component({
  components: {},
})
export default class PlayerQueue extends Vue {
  @Prop(Array) queue!: Music[];
}
</script>

<style scoped>
</style>
