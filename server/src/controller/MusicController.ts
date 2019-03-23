import * as Joi from 'joi';
import * as Koa from 'koa';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { MusicService } from '../service/MusicService';
import { RegistrableController } from './RegisterableController';
import { Route } from '../middleware/Route';
import { serviceResultToResponse } from '../util/ControllerUtils';

@injectable()
export class MusicController implements RegistrableController {
  constructor(@inject(TYPES.MusicService) private musicService: MusicService) {}

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
        method: 'GET',
        path: '/playlist',
        handler: this.getPlaylist.bind(this),
        schemas: {},
      },
      {
        method: 'POST',
        path: '/playlist',
        handler: this.enqueueMusic.bind(this),
        schemas: {
          body: { videoId: Joi.string().required() },
        },
      },
      {
        method: 'PUT',
        path: '/playlist/play',
        handler: this.playMusic.bind(this),
        schemas: {},
      },
      {
        method: 'PUT',
        path: '/playlist/stop',
        handler: this.stopMusic.bind(this),
        schemas: {},
      },
      {
        method: 'PUT',
        path: '/playlist/next',
        handler: this.nextMusic.bind(this),
        schemas: {},
      },
      {
        method: 'PUT',
        path: '/playlist/previous',
        handler: this.previousMusic.bind(this),
        schemas: {},
      },
    ];
  }

  private async searchMusic(ctx: Koa.Context) {
    const query = ctx.request.query.q;
    ctx.body = await this.musicService.searchMusic(query);
  }

  private getPlaylist(ctx: Koa.Context) {
    ctx.body = this.musicService.getPlaylist();
  }

  private async enqueueMusic(ctx: Koa.Context) {
    const { videoId } = ctx.request.body;
    const res = await this.musicService.enqueueMusic(videoId);
    serviceResultToResponse(ctx, res);
  }

  private async playMusic(ctx: Koa.Context) {
    await this.musicService.playMusic();
    ctx.status = 204;
  }

  private async stopMusic(ctx: Koa.Context) {
    await this.musicService.stopMusic();
    ctx.status = 204;
  }

  private async nextMusic(ctx: Koa.Context) {
    await this.musicService.nextMusic();
    ctx.status = 204;
  }

  private async previousMusic(ctx: Koa.Context) {
    await this.musicService.previousMusic();
    ctx.status = 204;
  }
}
