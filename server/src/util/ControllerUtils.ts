import * as Koa from 'koa';
import { ServiceResult } from '../model/ServiceResult';

export function foundOr404(ctx: Koa.Context, data: any) {
  if (data === undefined) {
    ctx.status = 404;
  } else {
    ctx.body = data;
  }
}

export function serviceResultToResponse<T>(ctx: Koa.Context, res: ServiceResult<T>) {
  ctx.status = res.code;
  if (res.ok && res.data !== undefined) {
    ctx.body = res.data;
  }
}
