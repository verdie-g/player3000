<template>
  <div>
    search
    <SearchBar />
    <SearchResults />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import SearchBar from './SearchBar.vue';
import SearchResults from './SearchResults.vue';

@Component({
  components: {
    SearchBar,
    SearchResults,
  },
})
export default class Search extends Vue {}
</script>

<style scoped>
</style>
