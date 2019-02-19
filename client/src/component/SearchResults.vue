<template>
  <div>
    search results
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import { Music } from '../model/Music';

@Component({
  components: {},
})
export default class SearchResults extends Vue {
  // @Prop(Array) musics!: Music[];
}
</script>

<style scoped>
</style>
