<template>
  <div>
    <input type="text" v-model="query" @input="onChange" />
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import debounce from 'debounce';

import musicService from '../service/MusicService';

@Component({
  components: {},
})
export default class SearchBar extends Vue {
  query: string = '';
  requestsSent: number = 0;
  searchDebounce = debounce((query: string) => this.search(query), 300);

  get loading(): boolean {
    return this.requestsSent !== 0;
  }

  onChange(e: any) {
    this.searchDebounce(this.query);
  }

  async search(query: string) {
    this.$emit('searchStart', query);
    this.requestsSent += 1;
    const musics = await musicService.search(query);
    this.requestsSent -= 1;
    this.$emit('searchEnd', musics);
  }
}
</script>

<style scoped>
</style>
