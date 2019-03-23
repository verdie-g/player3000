import { Container } from 'inversify';
import 'reflect-metadata';
import TYPES from './types';
import { AudioPlayer, AudioPlayerImpl } from './service/AudioPlayer';
import { AudioProcess, VlcAudioProcess } from './service/AudioProcess';
import { MusicController } from './controller/MusicController';
import { MusicRepository, MusicRepositoryImpl } from './repository/MusicRepository';
import { MusicService, MusicServiceImpl } from './service/MusicService';
import { RegistrableController } from './controller/RegisterableController';
import { SSEController } from './controller/SSEController';
import { SSEService, SSEServiceImpl } from './service/SSEService';
import { YoutubeRepository, YoutubeRepositoryImpl } from './repository/YoutubeRepository';

const container = new Container();
container.bind<AudioPlayer>(TYPES.AudioPlayer).to(AudioPlayerImpl).inSingletonScope();
container.bind<AudioProcess>(TYPES.AudioProcess).to(VlcAudioProcess).inSingletonScope();
container.bind<MusicRepository>(TYPES.MusicRepository).to(MusicRepositoryImpl);
container.bind<MusicService>(TYPES.MusicService).to(MusicServiceImpl);
container.bind<RegistrableController>(TYPES.Controller).to(MusicController);
container.bind<RegistrableController>(TYPES.Controller).to(SSEController);
container.bind<SSEService>(TYPES.SSEService).to(SSEServiceImpl).inSingletonScope();
container.bind<YoutubeRepository>(TYPES.YoutubeRepository).to(YoutubeRepositoryImpl);

export default container;
