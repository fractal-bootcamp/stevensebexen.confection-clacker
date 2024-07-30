type EndpointBaseFn = (...args: string[]) => string
type EndpointFnRestArgs<T> = T extends (...args: infer RestArgs) => string ? RestArgs : never;

function endpoint(route: string): (base: string) => string;
function endpoint<T extends EndpointBaseFn>(route: T): (base: string, ...args: EndpointFnRestArgs<T>) => string;

function endpoint<T extends EndpointBaseFn>(route: string | T) {
  if (typeof route === 'string') {
    return ((base: string) => `${base}${route}`);
  } else {
    return ((base: string, ...args: EndpointFnRestArgs<T>) => `${base}${route(...args)}`);
  }
}

export const endpoints = {
  getClacks: endpoint('/clack'),
  postClack: endpoint((user: string) => `/clack/${user}`)
}