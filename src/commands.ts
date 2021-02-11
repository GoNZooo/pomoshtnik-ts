import {
  AddNoteData,
  Command,
  CommandTag,
  GitHubRepository,
  RepositoryByName,
  RepositoryByTopics,
  RepositorySearchTypeTag,
  UpdateNoteData,
  validateCommand,
} from "../pomoshtnik-shared/gotyno/commands";
import {ValidationResult} from "simple-validation-tools";

export function commandFromStrings(strings: string[]): ValidationResult<Command> {
  const commandMap: {[key: string]: CommandTag} = {
    "!ping": CommandTag.Ping,
    "!whoareyou": CommandTag.WhoAreYou,
    "!searches": CommandTag.Searches,
    "!movie": CommandTag.Movie,
    "!movie-by-id": CommandTag.MovieById,
    "!movie-candidates": CommandTag.MovieCandidates,
    "!person": CommandTag.Person,
    "!show": CommandTag.Show,
    "!github-user": CommandTag.GitHubUser,
    "!github-repo": CommandTag.GitHubRepository,
    "!users": CommandTag.Users,
    "!add-note": CommandTag.AddNote,
    "!update-note": CommandTag.UpdateNote,
    "!remove-note": CommandTag.RemoveNote,
    "!search-note": CommandTag.SearchNote,
  };

  const githubRepositorySearchTypes: {[key: string]: RepositorySearchTypeTag} = {
    topic: RepositorySearchTypeTag.RepositoryByTopics,
    name: RepositorySearchTypeTag.RepositoryByName,
  };

  if (strings.length < 1) {
    return {type: "Invalid", errors: "String list has no entries"};
  } else {
    const [first, ...rest] = strings;
    const type = commandMap[first] ?? "INVALID";
    switch (type) {
      case CommandTag.GitHubRepository: {
        const [searchType, ...repositorySearchRest] = rest;
        const searchTypeTag = githubRepositorySearchTypes[searchType] ?? "INVALID";
        switch (searchTypeTag) {
          case RepositorySearchTypeTag.RepositoryByTopics: {
            return {
              type: "Valid",
              value: GitHubRepository(RepositoryByTopics(repositorySearchRest)),
            };
          }

          case RepositorySearchTypeTag.RepositoryByName: {
            return {
              type: "Valid",
              value: GitHubRepository(RepositoryByName(repositorySearchRest.join(" "))),
            };
          }

          default:
            return {type: "Invalid", errors: "Invalid search type"};
        }
      }

      case CommandTag.MovieById: {
        const data = parseInt(rest[0], 10);

        return validateCommand({type, data});
      }

      case CommandTag.AddNote: {
        const [title, ...bodyRest] = rest;
        const body = bodyRest.join(" ");
        const data: AddNoteData = {title, body};

        return validateCommand({type, data});
      }

      case CommandTag.UpdateNote: {
        const [uuid, title, ...bodyRest] = rest;
        const body = bodyRest.join(" ");
        const data: UpdateNoteData = {uuid, title, body};

        return validateCommand({type, data});
      }

      default: {
        const data = rest.join(" ");

        return validateCommand({type, data});
      }
    }
  }
}
