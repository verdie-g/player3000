import * as Joi from 'joi';
import * as Koa from 'koa';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { Player } from '../model/Player';
import { PlayerService } from '../service/PlayerService';
import { RegistrableController } from './RegisterableController';
import { foundOr404, serviceResultToResponse } from '../util/ControllerUtils';
import { Route } from '../middleware/Route';

@injectable()
export class PlayerController implements RegistrableController {
  @inject(TYPES.PlayerService)
  private playerService: PlayerService;

  public routes(): Route[] {
    return [
      {
        method: 'GET',
        path: '/players',
        handler: this.getPlayers.bind(this),
        schemas: {},
      },
      {
        method: 'GET',
        path: '/players/:id',
        handler: this.getPlayer.bind(this),
        schemas: {
          params: { id: Joi.number().integer().required() },
        },
      },
      {
        method: 'POST',
        path: '/players',
        handler: this.createPlayer.bind(this),
        schemas: {
          body: { name: Joi.string().required() },
        },
      },
      {
        method: 'DELETE',
        path: '/players/:id',
        handler: this.deletePlayer.bind(this),
        schemas: {
          params: { id: Joi.number().integer().required() },
        },
      },
      {
        method: 'PUT',
        path: '/players/:id/play',
        handler: this.playMusic.bind(this),
        schemas: {
          params: { id: Joi.number().integer().required() },
          body: { videoId: Joi.string().required() },
        },
      },
    ];
  }

  private async getPlayers(ctx: Koa.Context) {
    ctx.body = await this.playerService.getPlayers();
  }

  private async getPlayer(ctx: Koa.Context) {
    const player = await this.playerService.getPlayer(ctx.params.id);
    foundOr404(ctx, player);
  }

  private async createPlayer(ctx: Koa.Context) {
    const { body } = ctx.request;
    const player = new Player(body.name);
    const res = await this.playerService.createPlayer(player);
    serviceResultToResponse(ctx, res);
  }

  private async deletePlayer(ctx: Koa.Context) {
    const res = await this.playerService.deletePlayer(ctx.params.id);
    serviceResultToResponse(ctx, res);
  }

  private async playMusic(ctx: Koa.Context) {
    const { videoId } = ctx.request.body;
    const playerId = ctx.params.id;
    await this.playerService.playMusic(playerId, videoId);
    ctx.status = 202;
  }
}
