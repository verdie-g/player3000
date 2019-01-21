import * as Koa from 'koa';
import * as Router from 'koa-tree-router';
import * as config from 'config';
import * as bodyParser from 'koa-bodyparser';
import TYPES from './types';
import container from './inversify.config';
import { logger } from './util/Logger';
import { RegistrableController } from './controller/RegisterableController';

const app = new Koa();
const router = new Router();

const controllers: RegistrableController[] = container.getAll<RegistrableController>(TYPES.Controller);
controllers.forEach(ctrl => ctrl.register(router));

app.use(async (ctx, next) => {
  logger.info(`${ctx.method} ${ctx.path}`);
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.app.emit('error', err, ctx);
  }
});

app.use(bodyParser());
app.use(router.routes());

app.on('error', (err, ctx) => {
  logger.error(err.message);
});

const port = config.get('port');

app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
