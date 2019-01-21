import { Container } from 'inversify';
import TYPES from './types';
import { RegistrableController } from './controller/RegisterableController';
import { PlayerRepository, PlayerRepositoryImpl } from './repository/PlayerRepository';
import { PlayerService, PlayerServiceImpl } from './service/PlayerService';
import { PlayerController } from './controller/PlayerController';

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(PlayerController);
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerServiceImpl);
container.bind<PlayerRepository>(TYPES.PlayerRepository).to(PlayerRepositoryImpl);

export default container;
