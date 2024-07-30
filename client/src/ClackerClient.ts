// const URL_DEFAULT = 'http://localhost:3000';
// import { endpoints } from "./endpoints";
// import type { GetClacksResponse, PostClackResponse } from "./types";

import { ClackMessage, IdentityMessage, MessageType } from "./types";

const URL_DEFAULT = 'ws://localhost:8080';

export class ClackerClient {
  clackCount: number = 0;
  user: string;
  socket: WebSocket;

  public get connected() {
    return this.socket && this.socket.readyState === this.socket.OPEN;
  }

  constructor(user: string, url?: string) {
    this.user = user;

    this.socket = new WebSocket(url ?? URL_DEFAULT);
    if (!this.socket) throw new Error('WebSocket connection not established.');
    this.socket.addEventListener('open', this.sendIdentity.bind(this));
  }

  sendClack() {
    if (!this.socket) throw new Error('WebSocket connection not established.');
    const message = new ClackMessage();
    this.socket.send(JSON.stringify(message));
  }

  sendIdentity() {
    if (!this.socket) throw new Error('WebSocket connection not established.');
    const message = new IdentityMessage(this.user);
    this.socket.send(JSON.stringify(message));
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
