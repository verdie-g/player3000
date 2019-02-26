<template>
  <div id="app">
    <Room />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Room from './component/Room.vue';

import serverEvents from './service/ServerEventsService';

@Component({
  components: {
    Room,
  },
})
export default class App extends Vue {
  created() {
    serverEvents.open();
  }

  destroy() {
    serverEvents.close();
  }
}
</script>

<style>
</style>
