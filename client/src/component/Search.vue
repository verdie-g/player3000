<template>
  <div class="container">
    <b-autocomplete
      v-model="query"
      :data="musics"
      placeholder="e.g. Vladimir Cauchemar - Aulos"
      icon="magnify"
      field="title"
      clear-on-select
      :loading="loading"
      @input="onInput"
      @select="onSelect">

      <template slot-scope="props">
        <div class="media">
          <div class="media-left">
            <img width="30" :src="props.option.thumbSmallUrl">
          </div>
          <div class="media-content">{{ props.option.title }}</div>
        </div>
      </template>
    </b-autocomplete>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import debounce from 'debounce';

import musicModule from '../store/MusicModule';
import playerModule from '../store/PlayerModule';
import { Music } from '../model/Music';
import { isWhitespace } from '../util/StringUtil';

@Component({
  components: {},
})
export default class Search extends Vue {
  query: string = '';
  searchDebounce = debounce((query: string) => musicModule.searchMusic(query), 400);

  get loading() {
    return musicModule.searchLoading;
  }

  get musics() {
    return musicModule.searchResults;
  }

  onInput(e: any) {
    if (isWhitespace(this.query)) {
      return;
    }

    this.searchDebounce(this.query);
  }

  onSelect(music: Music) {
    if (music === null) {
      return;
    }

    playerModule.enqueueMusic(music);
  }
}
</script>

<style scoped>
</style>
