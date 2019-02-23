import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators';

import musicService from '../service/MusicService';
import store from './index';
import { Music } from '../model/Music';

@Module({ store, dynamic: true, name: 'music' })
class MusicModule extends VuexModule {
  searchResults: Music[] = [];
  searchLoading: boolean = false;

  @Mutation
  updateSearchResults(searchResults: Music[]) {
    this.searchResults = searchResults;
  }

  @Mutation
  setSearchLoading(searchLoading: boolean) {
    this.searchLoading = searchLoading;
  }

  @Action({ commit: 'updateSearchResults' })
  async searchMusic(query: string) {
    this.context.commit('setSearchLoading', true);
    const results = await musicService.search(query);
    this.context.commit('setSearchLoading', false);
    return results;
  }
}

export default getModule(MusicModule);
