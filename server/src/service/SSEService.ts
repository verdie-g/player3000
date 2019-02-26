import { IncomingMessage, ServerResponse } from 'http';
import { injectable } from 'inversify';

import { logger } from '../util/Logger';

export interface SSEService {
  addClient(req: IncomingMessage, res: ServerResponse): void;
  removeClient(client: Client): void;
  send(event?: string, data?: any): void;
}

type Client = ServerResponse;

@injectable()
export class SSEServiceImpl implements SSEService {
  private clients: Client[] = [];
  private msgId: number = 1;

  public addClient(req: IncomingMessage, res: ServerResponse) {
    req.socket.setTimeout(0);
    req.socket.setNoDelay(true);
    req.socket.setKeepAlive(true);
    req.on('close', () => this.removeClient(res));

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    this.clients.push(res);
  }

  public removeClient(client: Client) {
    const i = this.clients.indexOf(client);
    this.clients.splice(i, 1);
  }

  public send(event?: string, data?: any) {
    if (this.clients.length === 0) {
      return;
    }

    let msg = `id: ${this.msgId}\n`;
    this.msgId += 1;

    if (event !== undefined) {
      msg += `event: ${event}\n`;
    }

    if (data !== undefined) {
      msg += `data: ${JSON.stringify(data)}\n`;
    }

    msg += '\n';

    logger.debug(`pushing ${msg} to clients`);
    this.clients.forEach((client) => {
      client.write(msg);
    });
  }
}
