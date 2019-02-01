import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './types';
import { MusicController } from './controller/MusicController';
import { MusicRepository, MusicRepositoryImpl } from './repository/MusicRepository';
import { MusicService, MusicServiceImpl } from './service/MusicService';
import { PlayerController } from './controller/PlayerController';
import { PlayerRepository, PlayerRepositoryImpl } from './repository/PlayerRepository';
import { PlayerService, PlayerServiceImpl } from './service/PlayerService';
import { RegistrableController } from './controller/RegisterableController';
import { YoutubeRepository, YoutubeRepositoryImpl } from './repository/YoutubeRepository';

const container = new Container();
container.bind<MusicRepository>(TYPES.MusicRepository).to(MusicRepositoryImpl);
container.bind<MusicService>(TYPES.MusicService).to(MusicServiceImpl);
container.bind<PlayerRepository>(TYPES.PlayerRepository).to(PlayerRepositoryImpl);
container.bind<PlayerService>(TYPES.PlayerService).to(PlayerServiceImpl);
container.bind<RegistrableController>(TYPES.Controller).to(MusicController);
container.bind<RegistrableController>(TYPES.Controller).to(PlayerController);
container.bind<YoutubeRepository>(TYPES.YoutubeRepository).to(YoutubeRepositoryImpl);

export default container;
