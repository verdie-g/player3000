<template>
  <div>
    <div class="section">
      <Search />
    </div>
    <div class="section">
      <Player />
      <PlayerQueue />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Player from './Player.vue';
import PlayerQueue from './PlayerQueue.vue';
import Search from './Search.vue';

@Component({
  components: {
    Player,
    PlayerQueue,
    Search,
  },
})
export default class Room extends Vue {}
</script>

<style scoped>
</style>
