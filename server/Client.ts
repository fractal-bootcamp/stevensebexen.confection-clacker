import WS from 'ws';

export type ClientInfo = {
  user: string;
};

export type Client = {
  info: ClientInfo;
  socket: WS;
};