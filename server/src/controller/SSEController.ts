import * as Koa from 'koa';
import { injectable, inject } from 'inversify';

import TYPES from '../types';
import { RegistrableController } from './RegisterableController';
import { Route } from '../middleware/Route';
import { SSEService } from '../service/SSEService';

@injectable()
export class SSEController implements RegistrableController {
  constructor(@inject(TYPES.SSEService) private sseService: SSEService) {}

  public routes(): Route[] {
    return [
      {
        method: 'GET',
        path: '/sse',
        handler: this.sse.bind(this),
        schemas: {},
      },
    ];
  }

  private sse(ctx: Koa.Context) {
    ctx.respond = false;
    this.sseService.addClient(ctx.req, ctx.res);
  }
}
