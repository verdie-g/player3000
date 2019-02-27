const URL = 'http://localhost:8000/sse';

import EventSource from 'eventsource';

export class ServerEventsService {
  eventSource: EventSource;

  constructor() {
    this.eventSource = new EventSource(URL);
  }

  on(event: string, cb: (data: any) => void): this {
    this.eventSource.addEventListener(event, (e: any) => { cb(JSON.parse(e.data)); });
    return this;
  }

  off(event: string, cb: (data: any) => void): this {
    this.eventSource.removeEventListener(event, cb);
    return this;
  }

  close() {
    this.eventSource.close();
  }
}

export default new ServerEventsService();
