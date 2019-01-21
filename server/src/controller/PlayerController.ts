import * as Koa from 'koa';
import * as Router from 'koa-tree-router';
import { injectable, inject } from 'inversify';
import TYPES from '../types';
import { PlayerService } from '../service/PlayerService';
import { Player } from '../model/Player';
import { RegistrableController } from './RegisterableController';

@injectable()
export class PlayerController implements RegistrableController {
  constructor(@inject(TYPES.PlayerService) private playerService: PlayerService) {
  }

  public register(router: Router) {
    router.get('/players', this.getPlayers.bind(this));
    router.post('/players', this.createPlayer.bind(this));
  }

  private async getPlayers(ctx: Koa.Context) {
    ctx.body = await this.playerService.getPlayers();
  }

  private async createPlayer(ctx: Koa.Context) {
    const { body } = ctx.request;
    const player = new Player(body.name);
    ctx.body = await this.playerService.createPlayer(player);
    ctx.status = 201;
  }
}
