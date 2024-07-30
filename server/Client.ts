import WS from 'ws';
import { ClientInfo } from './ClientInfo';
import { Message, MessageIdentity, MessageType } from '../common/Message';

export class Client {
  socket: WS;
  info: ClientInfo | null = null;
  onClack: ((client: Client) => void) | null = null;
  onClose: ((clientToClose: Client) => void) | null = null;

  constructor(socket: WS) {
    this.socket = socket;
    this.socket.on('message', this.onMessage.bind(this));
    this.socket.on('close', this._onClose.bind(this));
  }

  onMessage(data: string) {
    console.log(`Client '${this.info?.user}' sent message: ${data}`);
    const message: Message = JSON.parse(data);
    switch(message.type) {
      case MessageType.Identity:
        this.establishIdentity((message as MessageIdentity).user);
        break;
      case MessageType.Clack:
        this.clack();
        break;
    }
  }

  _onClose() {
    if (!this.onClose) return;
    this.onClose(this);
  }

  establishIdentity(user: string) {
    this.info = new ClientInfo(user);
  }

  clack() {
    if (!this.onClack) return;
    this.onClack(this);
  }
}