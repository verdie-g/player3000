import * as Router from 'koa-tree-router';

export interface RegistrableController {
  register(router: Router);
}
