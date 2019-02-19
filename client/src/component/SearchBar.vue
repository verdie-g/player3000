<template>
  <div>
    <input type="text" v-model="query" @input="onChange" />
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
  searchDebounce = debounce((query: string) => this.search(query), 250);

  onChange(e: any) {
    this.searchDebounce(e.data);
  }

  async search(query: string) {
    const musics = await musicService.search(query);
    console.log(musics);
  }
}
</script>

<style scoped>
</style>
