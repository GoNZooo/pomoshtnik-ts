export const assertUnreachable = (value: never): never => {
  throw new Error("Reached unreachable code");
};
