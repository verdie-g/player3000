import * as Koa from 'koa';
import * as Router from 'koa-tree-router';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { MusicService } from '../service/MusicService';
import { RegistrableController } from './RegisterableController';

@injectable()
export class MusicController implements RegistrableController {
  @inject(TYPES.MusicService)
  private musicService: MusicService;

  public register(router: Router) {
    router.get('/music/search', this.searchMusic.bind(this));
    router.put('/players/:name/play', this.playMusic.bind(this));
  }

  private async searchMusic(ctx: Koa.Context) {
    const query = ctx.request.query.q;
    ctx.body = await this.musicService.searchMusic(query);
  }

  private async playMusic(ctx: Koa.Context) {
    const { videoId } = ctx.request.body;
    const playerName = ctx.params.name;
    this.musicService.playMusic(playerName, videoId);
    ctx.status = 202;
  }
}
