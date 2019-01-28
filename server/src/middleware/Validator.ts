import * as Joi from 'joi';
import * as Router from 'koa-tree-router';
import { ParameterSchemas } from './Route';
import { copyValues } from '../util/ObjectUtil';

function validateObject(schema: Joi.SchemaMap, o: any, ctx: Router.IRouterContext): boolean {
  if (schema === undefined) {
    return true;
  }

  const result = Joi.validate(o, schema);
  if (result.error !== null) {
    ctx.status = 400;
    ctx.body = result.error.details;
    return false;
  }

  copyValues(o, result.value);
  return true;
}

export function validate(paramSchemas: ParameterSchemas): Router.IMiddleware {
  return async (ctx: Router.IRouterContext, next: () => Promise<any>) => {
    if (!validateObject(paramSchemas.params, ctx.params, ctx)
      || !validateObject(paramSchemas.body, ctx.request.body, ctx)
      || !validateObject(paramSchemas.query, ctx.request.query, ctx)) {
      return;
    }

    await next();
  };
}
