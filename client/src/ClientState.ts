export type ClientState = {
  count: number;
  connected: boolean;
  user: string;
  nextRefresh: number;
};

export const ClientStateDefault: () => ClientState = () => ({
  count: 0,
  connected: false,
  user: 'Clacker',
  nextRefresh: 0
});