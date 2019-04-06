import * as assert from 'assert';
import { Mock, It } from 'typemoq';
import 'reflect-metadata';

import { AudioPlayerImpl } from '../src/service/AudioPlayer';
import { AudioProcess } from '../src/service/AudioProcess';
import { Music, MusicDownloadState } from '../src/model/Music';
import { SSEService } from '../src/service/SSEService';

const musicA: Music = {
  videoId: '',
  title: '',
  description: '',
  duration: 0,
  thumbSmallUrl: '',
  thumbMediumUrl: '',
  thumbHighUrl: '',
  downloadState: MusicDownloadState.DOWNLOADING,
  id: 1,
};

const musicB: Music = {
  videoId: '',
  title: '',
  description: '',
  duration: 0,
  thumbSmallUrl: '',
  thumbMediumUrl: '',
  thumbHighUrl: '',
  downloadState: MusicDownloadState.DOWNLOADING,
  id: 2,
};

function createDownloadPromise(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time * 1000));
}

describe('AudioPlayer', () => {
  describe('getPlaylist', () => {
    it('should be empty, not playing, and index at -1', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.queue.length, 0);
      assert.strictEqual(playlist.currentIdx, -1);
      assert.strictEqual(playlist.playing, false);
    });
  });

  describe('enqueue', () => {
    it('should work correctly', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      let playlist = audioPlayer.getPlaylist();

      assert.strictEqual(playlist.queue.length, 1);
      assert.strictEqual(playlist.currentIdx, 0);
      assert.strictEqual(playlist.queue[0].id, musicA.id);

      audioPlayer.enqueue(musicB);
      playlist = audioPlayer.getPlaylist();

      assert.strictEqual(playlist.queue.length, 2);
      assert.strictEqual(playlist.currentIdx, 0);
      assert.strictEqual(playlist.queue[1].id, musicB.id);
    });

    it('should start when adding first music', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, true);
    });

    it('shouldn\'t play when adding a music when stopped', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.stop();
      audioPlayer.enqueue(musicB);
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
    });
  });

  describe('play', () => {
    it('should start the current music when stopped', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.stop();
      audioPlayer.play();
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, true);
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
    });

    it('shouldn\'t do anything when the queue is empty', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.play();
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
      assert.strictEqual(playlist.queue.length, 0);
    });

    it('shouldn\'t do anything when it is already playing', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.play();
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, true);
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
    });
  });

  describe('stop', () => {
    it('should pause the current music when playing and not move the index', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.stop();
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
    });

    it('shouldn\'t do anything when the queue is empty', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.stop();
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
      assert.strictEqual(playlist.queue.length, 0);
    });

    it('shouldn\'t do anything when it is already stopped', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.stop();
      audioPlayer.stop();
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
    });
  });

  describe('next', () => {
    it('should play the next song', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.enqueue(musicB);
      audioPlayer.next();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicB.id);
    });

    it('shouldn\'t play when stopped', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.enqueue(musicB);
      audioPlayer.stop();
      audioPlayer.next();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
    });

    it('shouldn\'t do anything when the queue is empty', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.next();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
      assert.strictEqual(playlist.currentIdx, -1);
    });

    it('shouldn\'t do anything when the last music is playing', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.next();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
      assert.strictEqual(playlist.playing, true);
    });
  });

  describe('previous', () => {
    it('should play the previous music', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.enqueue(musicB);
      audioPlayer.next();
      audioPlayer.previous();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
    });

    it('shouldn\'t play when stopped', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.enqueue(musicB);
      audioPlayer.next();
      audioPlayer.stop();
      audioPlayer.previous();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
    });

    it('shouldn\'t do anything when the queue is empty', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.previous();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
      assert.strictEqual(playlist.currentIdx, -1);
    });

    it('shouldn\'t do anything when the first music is playing', () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.previous();

      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, true);
      assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicA.id);
    });
  });

  describe('downloadEnd', () => {
    it('shouldn\'t play at download end when stopped', async () => {
      const sseService = Mock.ofType<SSEService>();
      const audioProcess = Mock.ofType<AudioProcess>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      const downloadPromise = createDownloadPromise(0.01);
      audioPlayer.enqueue(musicA, downloadPromise);
      audioPlayer.stop();
      await downloadPromise;
      const playlist = audioPlayer.getPlaylist();
      assert.strictEqual(playlist.playing, false);
    });
  });

  describe('musicEnd', () => {
    it('should next at music end', (done) => {
      const audioProcess = Mock.ofType<AudioProcess>();
      audioProcess.setup(ap => ap.start(It.isAny(), It.isAny())).callback((_, onEnd) => {
        setTimeout(() => {
          onEnd();
          const playlist = audioPlayer.getPlaylist();
          assert.strictEqual(playlist.queue[playlist.currentIdx].id, musicB.id);
          done();
        }, 50);
      });

      const sseService = Mock.ofType<SSEService>();
      const audioPlayer = new AudioPlayerImpl(sseService.object, audioProcess.object);

      audioPlayer.enqueue(musicA);
      audioPlayer.enqueue(musicB);
    });
  });
});
