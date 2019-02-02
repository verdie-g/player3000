import * as Joi from 'joi';
import * as Koa from 'koa';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { MusicService } from '../service/MusicService';
import { RegistrableController } from './RegisterableController';
import { Route } from '../middleware/Route';

@injectable()
export class MusicController implements RegistrableController {
  @inject(TYPES.MusicService)
  private musicService: MusicService;

  public routes(): Route[] {
    return [
      {
        method: 'GET',
        path: '/musics/search',
        handler: this.searchMusic.bind(this),
        schemas: {
          query: { q: Joi.string().required() },
        },
      },
      {
        method: 'PUT',
        path: '/musics/play',
        handler: this.playMusic.bind(this),
        schemas: {
          body: { videoId: Joi.string().required() },
        },
      },
    ];
  }

  private async searchMusic(ctx: Koa.Context) {
    const query = ctx.request.query.q;
    ctx.body = await this.musicService.searchMusic(query);
  }

  private async playMusic(ctx: Koa.Context) {
    const { videoId } = ctx.request.body;
    await this.musicService.playMusic(videoId);
    ctx.status = 202;
  }
}
