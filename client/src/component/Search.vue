<template>
  <div>
    search
    <SearchBar @searchEnd="onSearchEnd" />
    <SearchResults :musics="musics" @select="(m) => $emit('select', m)" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SearchBar from './SearchBar.vue';
import SearchResults from './SearchResults.vue';

import { Music } from '../model/Music';

@Component({
  components: {
    SearchBar,
    SearchResults,
  },
})
export default class Search extends Vue {
  musics: Music[] = [];

  onSearchEnd(musics: Music[]) {
    this.musics = musics;
  }
}
</script>

<style scoped>
</style>
