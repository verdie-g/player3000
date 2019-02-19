<template>
  <div>
    cc
    <Search />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import Search from './Search.vue';

@Component({
  components: {
    Search,
  },
})
export default class Room extends Vue {}
</script>

<style scoped>
</style>
