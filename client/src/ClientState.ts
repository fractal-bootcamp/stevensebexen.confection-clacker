export type ClientState = {
  count: number;
  connected: boolean;
  user: string;
};

export const ClientStateDefault: () => ClientState = () => ({
  count: 0,
  connected: false,
  user: 'Someone'
});