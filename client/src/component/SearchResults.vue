<template>
  <ul>
    <li v-for="music in musics" @click="onSelect(music)">
      {{music.title}}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Music } from '../model/Music';

@Component({
  components: {},
})
export default class SearchResults extends Vue {
  @Prop(Array) musics!: Music[];

  onSelect(music: Music) {
    this.$emit('select', music);
  }
}
</script>

<style scoped>
</style>
