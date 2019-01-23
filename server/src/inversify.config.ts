import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './types';
import { MusicController } from './controller/MusicController';
import { MusicService, MusicServiceImpl } from './service/MusicService';
import { PlayerController } from './controller/PlayerController';
import { PlayerRepository, PlayerRepositoryImpl } from './repository/PlayerRepository';
import { PlayerService, PlayerServiceImpl } from './service/PlayerService';
import { RegistrableController } from './controller/RegisterableController';
import { YoutubeService, YoutubeServiceImpl } from './service/YoutubeService';

const container = new Container();
container.bind<RegistrableController>(TYPES.Controller).to(PlayerController);
container.bind<RegistrableController>(TYPES.Controller).to(MusicController);
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerServiceImpl);
container.bind<PlayerRepository>(TYPES.PlayerRepository).to(PlayerRepositoryImpl);
container.bind<MusicService>(TYPES.MusicService).to(MusicServiceImpl);
container.bind<YoutubeService>(TYPES.YoutubeService).to(YoutubeServiceImpl);

export default container;
