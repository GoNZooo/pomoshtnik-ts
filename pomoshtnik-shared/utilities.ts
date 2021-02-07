export const assertUnreachable = (value: never): never => {
  throw new Error(`Reached unreachable code: ${value}`);
};

export function parseJSON(data: string): unknown {
  // tslint:disable-next-line:ban
  return JSON.parse(data) as unknown;
}
