import { Route } from '../middleware/Route';

export interface RegistrableController {
  routes(): Route[];
}
