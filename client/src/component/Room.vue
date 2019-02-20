<template>
  <div>
    cc
    <Search @select="onMusicSelect" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Search from './Search.vue';

import { Music } from '../model/Music';

@Component({
  components: {
    Search,
  },
})
export default class Room extends Vue {
  onMusicSelect(music: Music) {
    console.log('selected', music);
  }
}
</script>

<style scoped>
</style>
