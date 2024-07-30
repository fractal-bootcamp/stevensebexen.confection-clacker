// const URL_DEFAULT = 'http://localhost:3000';
// import { endpoints } from "./endpoints";
// import type { GetClacksResponse, PostClackResponse } from "./types";

import { ClackMessage, IdentityMessage, MessageType } from "./types";

const URL_DEFAULT = 'ws://localhost:8080';

export class ClackerClient {
  clackCount: number = 0;
  user: string;
  url: string | null = null;
  socket: WebSocket | null = null;

  constructor(user: string, url?: string) {
    this.user = user;
    if (url) this.connect(url);
  }

  sendClack() {
    if (!this.socket) throw new Error();
    const message = new ClackMessage();
    this.socket.send(JSON.stringify(message));
  }

  sendIdentity() {
    if (!this.socket) throw new Error();
    const message = new IdentityMessage(this.user);
    this.socket.send(JSON.stringify(message));
  }

  connect(url?: string) {
    this.socket = new WebSocket(url ?? URL_DEFAULT);
    if (!this.socket) throw new Error();
    this.socket.addEventListener('open', this.sendIdentity.bind(this));
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
