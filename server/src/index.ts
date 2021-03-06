import * as Koa from 'koa';
import * as Router from 'koa-tree-router';
import * as bodyParser from 'koa-bodyparser';
import * as config from 'config';
import * as cors from '@koa/cors';
import TYPES from './types';
import container from './inversify.config';
import { RegistrableController } from './controller/RegisterableController';
import { Route } from './middleware/Route';
import { createDirIfNotExists } from './util/FsUtil';
import { logger } from './util/Logger';
import { validate } from './middleware/Validator';

const PORT = config.get('port');
const MUSIC_FOLDER: string = config.get('musicFolderPath');

(async () => {
  await createDirIfNotExists(MUSIC_FOLDER);

  const app = new Koa();
  const router = new Router();

  const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
  controllers.forEach((ctrl) => {
    const routes = ctrl.routes();
    routes.forEach((route: Route) => {
      router.on(route.method, route.path, validate(route.schemas), route.handler);
    });
  });

  app.use(async (ctx, next) => {
    logger.info(`${ctx.method} ${ctx.path}`);
    await next();
  });

  app.use(cors({ origin: '*' }));
  app.use(bodyParser());
  app.use(router.routes());

  app.on('error', (err, _) => {
    logger.error(`${err.message}: ${err.stack}`);
  });

  app.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}`);
  });
})();
