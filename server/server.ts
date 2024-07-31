import { WebSocket, WebSocketServer } from 'ws';
import { Client } from './Client.js';
import { Message, MessageCount, MessageRateLimit, } from './Message.js';
import { ClackRateLimiter } from './ClackRateLimiter.js';
import { redis } from './redis.js';
import { ClackStore } from './ClackStore.js';

const DEFAULT_PORT = 8080;

export class Server {
  socket: WebSocketServer;
  connectedClients: Client[] = [];
  rateLimiter: ClackRateLimiter = new ClackRateLimiter(redis);
  clackStore: ClackStore = new ClackStore(redis);

  constructor(port?: number) {
    this.socket = new WebSocketServer({ port: port ?? DEFAULT_PORT });
    this.socket.on('connection', this.onConnection.bind(this));
  }

  _sendMessage(message: Message, client: Client) {
    client.socket.send(JSON.stringify(message));
  }
  
  async sendCount(client: Client) {
    const message = new MessageCount(await this.clackStore.getCount());
    this._sendMessage(message, client);
  }

  sendRateLimit(client: Client) {
    const message = new MessageRateLimit(this.rateLimiter.nextRefresh)
    this._sendMessage(message, client);
  }
  
  broadcastCount() {
    this.connectedClients.forEach(client => {
      this.sendCount(client);
    });
  }
  
  async clack(client: Client) {
    if (!client.info?.user) return;
    if (!(await this.rateLimiter.request(client.info?.user))) {
      this.sendRateLimit(client);
      return;
    }
    await this.clackStore.incr();
    this.broadcastCount();
  }

  onClientClose(clientToClose: Client) {
    const toCloseIndex = this.connectedClients.findIndex(client => client === clientToClose);
    if (toCloseIndex === -1) throw new Error('Unable to find client to close.');
    this.connectedClients.splice(toCloseIndex, 1);
  }
  
  onConnection(socket: WebSocket) {
    console.log('Client connected');
    const client = new Client(socket);
    client.onClack = this.clack.bind(this);
    client.onClose = this.onClientClose.bind(this);
    this.sendCount(client);
    this.connectedClients.push(client);
  }
}