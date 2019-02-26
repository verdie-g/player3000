const URL = 'http://localhost:8000/sse';

import EventSource from 'eventsource';

export class ServerEventsService {
  eventSource!: EventSource;

  open() {
    this.eventSource = new EventSource(URL);
  }

  close() {
    this.eventSource.close();
  }
}

export default new ServerEventsService();
