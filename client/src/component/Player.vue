<template>
  <div v-if="music">
    <img :src="music.thumbUrl" width=64 />
    <span>{{music.title}}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

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
  @Prop({ default: () => emptyMusic }) music!: Music;
}
</script>

<style scoped>
</style>

