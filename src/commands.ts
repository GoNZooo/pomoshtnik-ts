import {
  Command,
  CommandTag,
  GitHubRepository,
  RepositoryByName,
  RepositoryByTopics,
  RepositorySearchTypeTag,
  validateCommand,
} from "./gotyno/commands";
import {ValidationResult} from "simple-validation-tools";

export function commandFromStrings(strings: string[]): ValidationResult<Command> {
  const commandMap: {[key: string]: CommandTag} = {
    "!ping": CommandTag.Ping,
    "!whoareyou": CommandTag.WhoAreYou,
    "!searches": CommandTag.Searches,
    "!movie": CommandTag.Movie,
    "!person": CommandTag.Person,
    "!show": CommandTag.Show,
    "!isbn": CommandTag.ISBN,
    "!github-user": CommandTag.GitHubUser,
    "!github-repo": CommandTag.GitHubRepository,
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
    if (type === CommandTag.GitHubRepository) {
      const [searchType, ...repositorySearchRest] = rest;
      const searchTypeTag = githubRepositorySearchTypes[searchType] ?? "INVALID";
      switch (searchTypeTag) {
        case RepositorySearchTypeTag.RepositoryByTopics: {
          return {type: "Valid", value: GitHubRepository(RepositoryByTopics(repositorySearchRest))};
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
    } else {
      const data = rest.join(" ");

      return validateCommand({type, data});
    }
  }
}
