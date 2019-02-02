import * as Koa from 'koa';
import { ServiceResult } from '../model/ServiceResult';

export function serviceResultToResponse<T>(ctx: Koa.Context, res: ServiceResult<T>) {
  ctx.status = res.code;
  if (res.ok && res.data !== undefined) {
    ctx.body = res.data;
  }
}
