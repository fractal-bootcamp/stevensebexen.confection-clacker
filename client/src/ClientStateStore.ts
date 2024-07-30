import { writable } from "svelte/store";
import { ClientStateDefault, type ClientState } from "./ClientState";

export const ClientStateStore = writable<ClientState>(ClientStateDefault());
