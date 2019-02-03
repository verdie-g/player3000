import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './types';
import { AudioPlayer, AudioPlayerImpl } from './service/AudioPlayer';
import { MusicController } from './controller/MusicController';
import { MusicRepository, MusicRepositoryImpl } from './repository/MusicRepository';
import { MusicService, MusicServiceImpl } from './service/MusicService';
import { RegistrableController } from './controller/RegisterableController';
import { YoutubeRepository, YoutubeRepositoryImpl } from './repository/YoutubeRepository';

const container = new Container();
container.bind<AudioPlayer>(TYPES.AudioPlayer).to(AudioPlayerImpl).inSingletonScope();
container.bind<MusicRepository>(TYPES.MusicRepository).to(MusicRepositoryImpl);
container.bind<MusicService>(TYPES.MusicService).to(MusicServiceImpl);
container.bind<RegistrableController>(TYPES.Controller).to(MusicController);
container.bind<YoutubeRepository>(TYPES.YoutubeRepository).to(YoutubeRepositoryImpl);

export default container;
