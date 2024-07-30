// const URL_DEFAULT = 'http://localhost:3000';
// import { endpoints } from "./endpoints";
// import type { GetClacksResponse, PostClackResponse } from "./types";

import { ClientStateDefault, type ClientState } from "./ClientState";
import { ClientStateStore } from "./ClientStateStore";
import { MessageCount, Message, MessageType, MessageClack, MessageIdentity, MessageRateLimit } from '../../common/Message';

const URL_DEFAULT = 'ws://localhost:8080';

export class ClackerClient {
  state: ClientState = ClientStateDefault();
  socket: WebSocket;

  constructor(user: string, url?: string) {
    this.socket = new WebSocket(url ?? URL_DEFAULT);
    if (!this.socket) throw new Error('WebSocket connection not established.');

    ClientStateStore.update(state => ({...state, user}));
    ClientStateStore.subscribe(state => this.state = {...state});
    this.socket.addEventListener('open', () => this.onOpen(user));
    this.socket.addEventListener('message', this.onMessage.bind(this));
    this.socket.addEventListener('close', this.onClose.bind(this));
  }

  _sendMessage(message: Message) {
    if (!this.socket) throw new Error('WebSocket connection not established');
    if (!this.state.connected) return;
    this.socket.send(JSON.stringify(message));
  }

  sendClack() {
    const message = new MessageClack();
    this._sendMessage(message);
  }

  sendIdentity(user: string) {
    const message = new MessageIdentity(this.state.user);
    this._sendMessage(message);
  }

  onClose() {
    ClientStateStore.update(state => ({...state, connected: false}));
  }

  onOpen(user: string) {
    ClientStateStore.update(state => ({...state, connected: true}));
    this.sendIdentity(user);
  }

  onMessage(e: MessageEvent) {
    const message: Message = JSON.parse(e.data);
    switch(message.type) {
      case MessageType.Count:
        ClientStateStore.update(state => ({...state, count: (message as MessageCount).count}));
      case MessageType.RateLimit:
        ClientStateStore.update(state => ({...state, nextRefresh: (message as MessageRateLimit).nextRefresh}));
    }
  }

  // async getClacks(): Promise<GetClacksResponse> {
    // const endpoint = endpoints.getClacks(this.url);
    // return (await fetch(endpoint)).json();
  // }

  // async postClack(user: string): Promise<PostClackResponse> {
    // const endpoint = endpoints.postClack(this.url, user);
    // return (await fetch(endpoint, {method: 'POST'})).json();
  // }
}
