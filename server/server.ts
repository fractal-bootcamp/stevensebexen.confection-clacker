import WS from 'ws';
import { Client } from './Client';
import { Message, MessageClack, MessageCount, MessageType } from '../common/Message';
import { ServerState } from './ServerState';

const DEFAULT_PORT = 8080;

export class Server {
  socket: WS.Server;
  connectedClients: Client[] = [];
  serverState: ServerState = new ServerState();

  constructor(port?: number) {
    this.socket = new WS.WebSocketServer({ port: port ?? DEFAULT_PORT });
    this.socket.on('connection', this.onConnection.bind(this));
  }

  _sendMessage(message: Message, client: Client) {
    client.socket.send(JSON.stringify(message));
  }
  
  sendCount(client: Client) {
    const message = new MessageCount(this.serverState.clackCount);
    this._sendMessage(message, client);
  }
  
  broadcastCount() {
    this.connectedClients.forEach(client => {
      this.sendCount(client);
    });
  }
  
  clack() {
    this.serverState.clackCount += 1;
    this.broadcastCount();
  }

  onClientClose(clientToClose: Client) {
    const toCloseIndex = this.connectedClients.findIndex(client => client === clientToClose);
    if (toCloseIndex === -1) throw new Error('Unable to find client to close.');
    this.connectedClients.splice(toCloseIndex, 1);
  }
  
  onConnection(socket: WS) {
    console.log('Client connected');
    const client = new Client(socket);
    client.onClack = this.clack.bind(this);
    client.onClose = this.onClientClose.bind(this);
    this.sendCount(client);
    this.connectedClients.push(client);
  }
}