import {CommandError, CommandErrorTag} from "./gotyno/commands";

export const assertUnreachable = (value: never): never => {
  throw new Error(`Reached unreachable code: ${value}`);
};

export function parseJSON(data: string): unknown {
  // tslint:disable-next-line:ban
  return JSON.parse(data) as unknown;
}

export function getSearchFailureText(failure: CommandError): string {
  switch (failure.type) {
    case CommandErrorTag.NoResults: {
      return `No results found for query '${failure.data}'`;
    }

    case CommandErrorTag.DiscordError: {
      return `Discord error for query '${failure.data.commandText}'`;
    }

    case CommandErrorTag.ValidationError: {
      return `Validation error for query '${failure.data.commandText}': `;
    }

    default:
      return assertUnreachable(failure);
  }
}
