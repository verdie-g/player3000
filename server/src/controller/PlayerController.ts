import * as Koa from 'koa';
import * as Router from 'koa-tree-router';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { PlayerService } from '../service/PlayerService';
import { Player } from '../model/Player';
import { RegistrableController } from './RegisterableController';
import { foundOr404, serviceResultToResponse } from '../util/ControllerUtils';

@injectable()
export class PlayerController implements RegistrableController {
  @inject(TYPES.PlayerService)
  private playerService: PlayerService;

  public register(router: Router) {
    router.get('/players', this.getPlayers.bind(this));
    router.get('/players/:id', this.getPlayer.bind(this));
    router.post('/players', this.createPlayer.bind(this));
    router.delete('/players/:id', this.deletePlayer.bind(this));
    router.put('/players/:id/play', this.playMusic.bind(this));
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
