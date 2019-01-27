import * as Joi from 'joi';
import * as Router from 'koa-tree-router';

export interface ParameterSchemas {
  params?: Joi.SchemaMap;
  body?: Joi.SchemaMap;
  query?: Joi.SchemaMap;
}

export interface Route {
  method: string;
  path: string;
  handler: Router.IMiddleware;
  schemas: ParameterSchemas;
}
