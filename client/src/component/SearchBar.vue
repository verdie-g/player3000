<template>
  <div>
    <input type="text" v-model="query" @input="onChange" />
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import debounce from 'debounce';

import musicModule from '../store/MusicModule';

@Component({
  components: {},
})
export default class SearchBar extends Vue {
  query: string = '';
  searchDebounce = debounce((query: string) => musicModule.searchMusic(query), 300);

  get loading() {
    return musicModule.searchLoading;
  }

  onChange(e: any) {
    this.searchDebounce(this.query);
  }
}
</script>

<style scoped>
</style>
