<template>
  <div id="app">
    <Room />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Room from './component/Room.vue';

@Component({
  components: {
    Room,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
