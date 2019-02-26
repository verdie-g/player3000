import * as Joi from 'joi';
import * as Router from 'koa-tree-router';
import { ParameterSchemas } from './Route';

function validateObject(obj: any, setObj: (ctx: Router.IRouterContext, obj: any) => void,
  ctx: Router.IRouterContext, schema?: Joi.SchemaMap): boolean {
  if (schema === undefined) {
    return true;
  }

  const result = Joi.validate(obj, schema);
  if (result.error !== null) {
    ctx.status = 400;
    ctx.body = result.error.details;
    return false;
  }

  setObj(ctx, result.value);
  return true;
}

export function validate(paramSchemas: ParameterSchemas): Router.IMiddleware {
  return async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
    if (!validateObject(ctx.params, (ctx, obj) => ctx.params = obj, ctx, paramSchemas.params)
      || !validateObject(ctx.request.body, (ctx, obj) => ctx.request.body = obj, ctx, paramSchemas.body)
      || !validateObject(ctx.request.query, (ctx, obj) => ctx.request.query = obj, ctx, paramSchemas.query)) {
      return;
    }

    await next();
  };
}
