import {CommandError, CommandErrorTag, SearchCommand, SearchCommandTag} from "./gotyno/commands";

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

export function hasMongoId<T>(value: unknown): value is T & {_id: string} {
  return typeof value === "object" && value !== null && "_id" in value;
}

export function searchResult(command: SearchCommand): string {
  switch (command.type) {
    case SearchCommandTag.ShowSearch: {
      return command.data.result.type === "SearchSuccess" ? command.data.result.data.name : "";
    }

    case SearchCommandTag.MovieSearch: {
      return command.data.result.type === "SearchSuccess"
        ? command.data.result.data.title ?? ""
        : "";
    }

    case SearchCommandTag.PersonSearch: {
      return command.data.result.type === "SearchSuccess" ? command.data.result.data.name : "";
    }

    case SearchCommandTag.GitHubRepositorySearch: {
      return command.data.result.type === "SearchSuccess" ? command.data.result.data.full_name : "";
    }

    case SearchCommandTag.GitHubUserSearch: {
      return command.data.result.type === "SearchSuccess" ? command.data.result.data.login : "";
    }

    default:
      return assertUnreachable(command);
  }
}
