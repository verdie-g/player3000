<template>
  <div class="container">
    <b-table
      :data="queue"
      striped
      :loading="loading"
      :selected="playingMusic">

      <template slot-scope="props">
        <b-table-column field="track" label="#" width="50" numeric>
          <span v-if="props.row.track === undefined">loading</span>
          <span v-else>{{ props.row.track }}</span>
        </b-table-column>

        <b-table-column field="title" label="Title">
          <div class="music-title">
            <img :src="props.row.thumbSmallUrl" class="music-image">
            <span class="music-title">{{ props.row.title }}</span>
          </div>
        </b-table-column>

        <b-table-column label="">
          <span v-if="musicDownloadProgression[props.row.id] !== undefined && musicDownloadProgression[props.row.id] !== 100">
            {{ musicDownloadProgression[props.row.id] }}%
          </span>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

import playerModule from '../store/PlayerModule';
import serverEvents from '../service/ServerEventsService';
import { DownloadProgressionMessage } from '../model/Message';
import { Music, MusicDownloadState } from '../model/Music';

@Component({
  components: {},
})
export default class PlayerQueue extends Vue {
  get queue() {
    return playerModule.playlist.queue;
  }

  get loading() {
    return playerModule.playlistLoading;
  }

  get playingMusic() {
    return playerModule.playingMusic;
  }

  get musicDownloadProgression() {
    return playerModule.musicDownloadProgression;
  }

  mounted() {
    playerModule.getPlaylist();
    serverEvents.on('downloadProgress', this.onDownloadProgress);
  }

  destroyed() {
    serverEvents.off('downloadProgress', this.onDownloadProgress);
  }

  onDownloadProgress(progression: DownloadProgressionMessage) {
    playerModule.setMusicDownloadProgression(progression);
  }
}
</script>

<style scoped>
.music-title {
  display: flex;
  align-items: center;
}

.music-image {
  height: 31px;
  margin-right: 12px;
}
</style>
