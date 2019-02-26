const URL = 'http://localhost:8000/sse';

import EventSource from 'eventsource';

export class ServerEventsService {
  eventSource: EventSource;

  constructor() {
    this.eventSource = new EventSource(URL);
  }

  on(event: string, cb: (data: any) => void) {
    this.eventSource.addEventListener(event, (e: any) => { cb(JSON.parse(e.data)); });
  }

  close() {
    this.eventSource.close();
  }
}

export default new ServerEventsService();
