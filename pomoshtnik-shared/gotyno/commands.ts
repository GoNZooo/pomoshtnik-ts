import * as svt from "simple-validation-tools";

import * as tmdb from "./tmdb";

import * as github from "./github";

export type RepositorySearchType = RepositoryByName | RepositoryByTopics;

export enum RepositorySearchTypeTag {
  RepositoryByName = "RepositoryByName",
  RepositoryByTopics = "RepositoryByTopics",
}

export type RepositoryByName = {
  type: RepositorySearchTypeTag.RepositoryByName;
  data: string;
};

export type RepositoryByTopics = {
  type: RepositorySearchTypeTag.RepositoryByTopics;
  data: string[];
};

export function RepositoryByName(data: string): RepositoryByName {
  return {type: RepositorySearchTypeTag.RepositoryByName, data};
}

export function RepositoryByTopics(data: string[]): RepositoryByTopics {
  return {type: RepositorySearchTypeTag.RepositoryByTopics, data};
}

export function isRepositorySearchType(value: unknown): value is RepositorySearchType {
  return [isRepositoryByName, isRepositoryByTopics].some((typePredicate) => typePredicate(value));
}

export function isRepositoryByName(value: unknown): value is RepositoryByName {
  return svt.isInterface<RepositoryByName>(value, {
    type: RepositorySearchTypeTag.RepositoryByName,
    data: svt.isString,
  });
}

export function isRepositoryByTopics(value: unknown): value is RepositoryByTopics {
  return svt.isInterface<RepositoryByTopics>(value, {
    type: RepositorySearchTypeTag.RepositoryByTopics,
    data: svt.arrayOf(svt.isString),
  });
}

export function validateRepositorySearchType(
  value: unknown
): svt.ValidationResult<RepositorySearchType> {
  return svt.validateWithTypeTag<RepositorySearchType>(
    value,
    {
      [RepositorySearchTypeTag.RepositoryByName]: validateRepositoryByName,
      [RepositorySearchTypeTag.RepositoryByTopics]: validateRepositoryByTopics,
    },
    "type"
  );
}

export function validateRepositoryByName(value: unknown): svt.ValidationResult<RepositoryByName> {
  return svt.validate<RepositoryByName>(value, {
    type: RepositorySearchTypeTag.RepositoryByName,
    data: svt.validateString,
  });
}

export function validateRepositoryByTopics(
  value: unknown
): svt.ValidationResult<RepositoryByTopics> {
  return svt.validate<RepositoryByTopics>(value, {
    type: RepositorySearchTypeTag.RepositoryByTopics,
    data: svt.validateArray(svt.validateString),
  });
}

export type Command =
  | Ping
  | WhoAreYou
  | Searches
  | Users
  | Movie
  | MovieById
  | MovieCandidates
  | Person
  | Show
  | GitHubUser
  | GitHubRepository;

export enum CommandTag {
  Ping = "Ping",
  WhoAreYou = "WhoAreYou",
  Searches = "Searches",
  Users = "Users",
  Movie = "Movie",
  MovieById = "MovieById",
  MovieCandidates = "MovieCandidates",
  Person = "Person",
  Show = "Show",
  GitHubUser = "GitHubUser",
  GitHubRepository = "GitHubRepository",
}

export type Ping = {
  type: CommandTag.Ping;
};

export type WhoAreYou = {
  type: CommandTag.WhoAreYou;
};

export type Searches = {
  type: CommandTag.Searches;
};

export type Users = {
  type: CommandTag.Users;
};

export type Movie = {
  type: CommandTag.Movie;
  data: string;
};

export type MovieById = {
  type: CommandTag.MovieById;
  data: number;
};

export type MovieCandidates = {
  type: CommandTag.MovieCandidates;
  data: string;
};

export type Person = {
  type: CommandTag.Person;
  data: string;
};

export type Show = {
  type: CommandTag.Show;
  data: string;
};

export type GitHubUser = {
  type: CommandTag.GitHubUser;
  data: string;
};

export type GitHubRepository = {
  type: CommandTag.GitHubRepository;
  data: RepositorySearchType;
};

export function Ping(): Ping {
  return {type: CommandTag.Ping};
}

export function WhoAreYou(): WhoAreYou {
  return {type: CommandTag.WhoAreYou};
}

export function Searches(): Searches {
  return {type: CommandTag.Searches};
}

export function Users(): Users {
  return {type: CommandTag.Users};
}

export function Movie(data: string): Movie {
  return {type: CommandTag.Movie, data};
}

export function MovieById(data: number): MovieById {
  return {type: CommandTag.MovieById, data};
}

export function MovieCandidates(data: string): MovieCandidates {
  return {type: CommandTag.MovieCandidates, data};
}

export function Person(data: string): Person {
  return {type: CommandTag.Person, data};
}

export function Show(data: string): Show {
  return {type: CommandTag.Show, data};
}

export function GitHubUser(data: string): GitHubUser {
  return {type: CommandTag.GitHubUser, data};
}

export function GitHubRepository(data: RepositorySearchType): GitHubRepository {
  return {type: CommandTag.GitHubRepository, data};
}

export function isCommand(value: unknown): value is Command {
  return [
    isPing,
    isWhoAreYou,
    isSearches,
    isUsers,
    isMovie,
    isMovieById,
    isMovieCandidates,
    isPerson,
    isShow,
    isGitHubUser,
    isGitHubRepository,
  ].some((typePredicate) => typePredicate(value));
}

export function isPing(value: unknown): value is Ping {
  return svt.isInterface<Ping>(value, {type: CommandTag.Ping});
}

export function isWhoAreYou(value: unknown): value is WhoAreYou {
  return svt.isInterface<WhoAreYou>(value, {type: CommandTag.WhoAreYou});
}

export function isSearches(value: unknown): value is Searches {
  return svt.isInterface<Searches>(value, {type: CommandTag.Searches});
}

export function isUsers(value: unknown): value is Users {
  return svt.isInterface<Users>(value, {type: CommandTag.Users});
}

export function isMovie(value: unknown): value is Movie {
  return svt.isInterface<Movie>(value, {type: CommandTag.Movie, data: svt.isString});
}

export function isMovieById(value: unknown): value is MovieById {
  return svt.isInterface<MovieById>(value, {type: CommandTag.MovieById, data: svt.isNumber});
}

export function isMovieCandidates(value: unknown): value is MovieCandidates {
  return svt.isInterface<MovieCandidates>(value, {
    type: CommandTag.MovieCandidates,
    data: svt.isString,
  });
}

export function isPerson(value: unknown): value is Person {
  return svt.isInterface<Person>(value, {type: CommandTag.Person, data: svt.isString});
}

export function isShow(value: unknown): value is Show {
  return svt.isInterface<Show>(value, {type: CommandTag.Show, data: svt.isString});
}

export function isGitHubUser(value: unknown): value is GitHubUser {
  return svt.isInterface<GitHubUser>(value, {type: CommandTag.GitHubUser, data: svt.isString});
}

export function isGitHubRepository(value: unknown): value is GitHubRepository {
  return svt.isInterface<GitHubRepository>(value, {
    type: CommandTag.GitHubRepository,
    data: isRepositorySearchType,
  });
}

export function validateCommand(value: unknown): svt.ValidationResult<Command> {
  return svt.validateWithTypeTag<Command>(
    value,
    {
      [CommandTag.Ping]: validatePing,
      [CommandTag.WhoAreYou]: validateWhoAreYou,
      [CommandTag.Searches]: validateSearches,
      [CommandTag.Users]: validateUsers,
      [CommandTag.Movie]: validateMovie,
      [CommandTag.MovieById]: validateMovieById,
      [CommandTag.MovieCandidates]: validateMovieCandidates,
      [CommandTag.Person]: validatePerson,
      [CommandTag.Show]: validateShow,
      [CommandTag.GitHubUser]: validateGitHubUser,
      [CommandTag.GitHubRepository]: validateGitHubRepository,
    },
    "type"
  );
}

export function validatePing(value: unknown): svt.ValidationResult<Ping> {
  return svt.validate<Ping>(value, {type: CommandTag.Ping});
}

export function validateWhoAreYou(value: unknown): svt.ValidationResult<WhoAreYou> {
  return svt.validate<WhoAreYou>(value, {type: CommandTag.WhoAreYou});
}

export function validateSearches(value: unknown): svt.ValidationResult<Searches> {
  return svt.validate<Searches>(value, {type: CommandTag.Searches});
}

export function validateUsers(value: unknown): svt.ValidationResult<Users> {
  return svt.validate<Users>(value, {type: CommandTag.Users});
}

export function validateMovie(value: unknown): svt.ValidationResult<Movie> {
  return svt.validate<Movie>(value, {type: CommandTag.Movie, data: svt.validateString});
}

export function validateMovieById(value: unknown): svt.ValidationResult<MovieById> {
  return svt.validate<MovieById>(value, {type: CommandTag.MovieById, data: svt.validateNumber});
}

export function validateMovieCandidates(value: unknown): svt.ValidationResult<MovieCandidates> {
  return svt.validate<MovieCandidates>(value, {
    type: CommandTag.MovieCandidates,
    data: svt.validateString,
  });
}

export function validatePerson(value: unknown): svt.ValidationResult<Person> {
  return svt.validate<Person>(value, {type: CommandTag.Person, data: svt.validateString});
}

export function validateShow(value: unknown): svt.ValidationResult<Show> {
  return svt.validate<Show>(value, {type: CommandTag.Show, data: svt.validateString});
}

export function validateGitHubUser(value: unknown): svt.ValidationResult<GitHubUser> {
  return svt.validate<GitHubUser>(value, {type: CommandTag.GitHubUser, data: svt.validateString});
}

export function validateGitHubRepository(value: unknown): svt.ValidationResult<GitHubRepository> {
  return svt.validate<GitHubRepository>(value, {
    type: CommandTag.GitHubRepository,
    data: validateRepositorySearchType,
  });
}

export type DiscordErrorData = {
  commandText: string;
  name: string;
  message: string;
  method: string;
  path: string;
  code: number;
  httpStatus: number;
};

export function isDiscordErrorData(value: unknown): value is DiscordErrorData {
  return svt.isInterface<DiscordErrorData>(value, {
    commandText: svt.isString,
    name: svt.isString,
    message: svt.isString,
    method: svt.isString,
    path: svt.isString,
    code: svt.isNumber,
    httpStatus: svt.isNumber,
  });
}

export function validateDiscordErrorData(value: unknown): svt.ValidationResult<DiscordErrorData> {
  return svt.validate<DiscordErrorData>(value, {
    commandText: svt.validateString,
    name: svt.validateString,
    message: svt.validateString,
    method: svt.validateString,
    path: svt.validateString,
    code: svt.validateNumber,
    httpStatus: svt.validateNumber,
  });
}

export type ValidationErrorData = {
  commandText: string;
  reason: string;
};

export function isValidationErrorData(value: unknown): value is ValidationErrorData {
  return svt.isInterface<ValidationErrorData>(value, {
    commandText: svt.isString,
    reason: svt.isString,
  });
}

export function validateValidationErrorData(
  value: unknown
): svt.ValidationResult<ValidationErrorData> {
  return svt.validate<ValidationErrorData>(value, {
    commandText: svt.validateString,
    reason: svt.validateString,
  });
}

export type BotUser = {
  nickname: string;
  lastCommand: Command;
  lastSeen: string;
  uuid: string;
};

export function isBotUser(value: unknown): value is BotUser {
  return svt.isInterface<BotUser>(value, {
    nickname: svt.isString,
    lastCommand: isCommand,
    lastSeen: svt.isString,
    uuid: svt.isString,
  });
}

export function validateBotUser(value: unknown): svt.ValidationResult<BotUser> {
  return svt.validate<BotUser>(value, {
    nickname: svt.validateString,
    lastCommand: validateCommand,
    lastSeen: svt.validateString,
    uuid: svt.validateString,
  });
}

export type CommandError = DiscordError | ValidationError | NoResults;

export enum CommandErrorTag {
  DiscordError = "DiscordError",
  ValidationError = "ValidationError",
  NoResults = "NoResults",
}

export type DiscordError = {
  type: CommandErrorTag.DiscordError;
  data: DiscordErrorData;
};

export type ValidationError = {
  type: CommandErrorTag.ValidationError;
  data: ValidationErrorData;
};

export type NoResults = {
  type: CommandErrorTag.NoResults;
  data: string;
};

export function DiscordError(data: DiscordErrorData): DiscordError {
  return {type: CommandErrorTag.DiscordError, data};
}

export function ValidationError(data: ValidationErrorData): ValidationError {
  return {type: CommandErrorTag.ValidationError, data};
}

export function NoResults(data: string): NoResults {
  return {type: CommandErrorTag.NoResults, data};
}

export function isCommandError(value: unknown): value is CommandError {
  return [isDiscordError, isValidationError, isNoResults].some((typePredicate) =>
    typePredicate(value)
  );
}

export function isDiscordError(value: unknown): value is DiscordError {
  return svt.isInterface<DiscordError>(value, {
    type: CommandErrorTag.DiscordError,
    data: isDiscordErrorData,
  });
}

export function isValidationError(value: unknown): value is ValidationError {
  return svt.isInterface<ValidationError>(value, {
    type: CommandErrorTag.ValidationError,
    data: isValidationErrorData,
  });
}

export function isNoResults(value: unknown): value is NoResults {
  return svt.isInterface<NoResults>(value, {type: CommandErrorTag.NoResults, data: svt.isString});
}

export function validateCommandError(value: unknown): svt.ValidationResult<CommandError> {
  return svt.validateWithTypeTag<CommandError>(
    value,
    {
      [CommandErrorTag.DiscordError]: validateDiscordError,
      [CommandErrorTag.ValidationError]: validateValidationError,
      [CommandErrorTag.NoResults]: validateNoResults,
    },
    "type"
  );
}

export function validateDiscordError(value: unknown): svt.ValidationResult<DiscordError> {
  return svt.validate<DiscordError>(value, {
    type: CommandErrorTag.DiscordError,
    data: validateDiscordErrorData,
  });
}

export function validateValidationError(value: unknown): svt.ValidationResult<ValidationError> {
  return svt.validate<ValidationError>(value, {
    type: CommandErrorTag.ValidationError,
    data: validateValidationErrorData,
  });
}

export function validateNoResults(value: unknown): svt.ValidationResult<NoResults> {
  return svt.validate<NoResults>(value, {
    type: CommandErrorTag.NoResults,
    data: svt.validateString,
  });
}

export type SearchResult<T> = SearchSuccess<T> | SearchFailure;

export enum SearchResultTag {
  SearchSuccess = "SearchSuccess",
  SearchFailure = "SearchFailure",
}

export type SearchSuccess<T> = {
  type: SearchResultTag.SearchSuccess;
  data: T;
};

export type SearchFailure = {
  type: SearchResultTag.SearchFailure;
  data: CommandError;
};

export function SearchSuccess<T>(data: T): SearchSuccess<T> {
  return {type: SearchResultTag.SearchSuccess, data};
}

export function SearchFailure(data: CommandError): SearchFailure {
  return {type: SearchResultTag.SearchFailure, data};
}

export function isSearchResult<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<SearchResult<T>> {
  return function isSearchResultT(value: unknown): value is SearchResult<T> {
    return [isSearchSuccess(isT), isSearchFailure].some((typePredicate) => typePredicate(value));
  };
}

export function isSearchSuccess<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<SearchSuccess<T>> {
  return function isSearchSuccessT(value: unknown): value is SearchSuccess<T> {
    return svt.isInterface<SearchSuccess<T>>(value, {
      type: SearchResultTag.SearchSuccess,
      data: isT,
    });
  };
}

export function isSearchFailure(value: unknown): value is SearchFailure {
  return svt.isInterface<SearchFailure>(value, {
    type: SearchResultTag.SearchFailure,
    data: isCommandError,
  });
}

export function validateSearchResult<T>(
  validateT: svt.Validator<T>
): svt.Validator<SearchResult<T>> {
  return function validateSearchResultT(value: unknown): svt.ValidationResult<SearchResult<T>> {
    return svt.validateWithTypeTag<SearchResult<T>>(
      value,
      {
        [SearchResultTag.SearchSuccess]: validateSearchSuccess(validateT),
        [SearchResultTag.SearchFailure]: validateSearchFailure,
      },
      "type"
    );
  };
}

export function validateSearchSuccess<T>(
  validateT: svt.Validator<T>
): svt.Validator<SearchSuccess<T>> {
  return function validateSearchSuccessT(value: unknown): svt.ValidationResult<SearchSuccess<T>> {
    return svt.validate<SearchSuccess<T>>(value, {
      type: SearchResultTag.SearchSuccess,
      data: validateT,
    });
  };
}

export function validateSearchFailure(value: unknown): svt.ValidationResult<SearchFailure> {
  return svt.validate<SearchFailure>(value, {
    type: SearchResultTag.SearchFailure,
    data: validateCommandError,
  });
}

export type SearchEntry<T> = {
  user: BotUser;
  uuid: string;
  result: SearchResult<T>;
};

export function isSearchEntry<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<SearchEntry<T>> {
  return function isSearchEntryT(value: unknown): value is SearchEntry<T> {
    return svt.isInterface<SearchEntry<T>>(value, {
      user: isBotUser,
      uuid: svt.isString,
      result: isSearchResult(isT),
    });
  };
}

export function validateSearchEntry<T>(validateT: svt.Validator<T>): svt.Validator<SearchEntry<T>> {
  return function validateSearchEntryT(value: unknown): svt.ValidationResult<SearchEntry<T>> {
    return svt.validate<SearchEntry<T>>(value, {
      user: validateBotUser,
      uuid: svt.validateString,
      result: validateSearchResult(validateT),
    });
  };
}

export type SearchCommand =
  | PersonSearch
  | MovieSearch
  | MovieSearchById
  | MovieCandidatesSearch
  | ShowSearch
  | GitHubUserSearch
  | GitHubRepositorySearch;

export enum SearchCommandTag {
  PersonSearch = "PersonSearch",
  MovieSearch = "MovieSearch",
  MovieSearchById = "MovieSearchById",
  MovieCandidatesSearch = "MovieCandidatesSearch",
  ShowSearch = "ShowSearch",
  GitHubUserSearch = "GitHubUserSearch",
  GitHubRepositorySearch = "GitHubRepositorySearch",
}

export type PersonSearch = {
  type: SearchCommandTag.PersonSearch;
  data: SearchEntry<tmdb.Person>;
};

export type MovieSearch = {
  type: SearchCommandTag.MovieSearch;
  data: SearchEntry<tmdb.MovieData>;
};

export type MovieSearchById = {
  type: SearchCommandTag.MovieSearchById;
  data: SearchEntry<tmdb.MovieData>;
};

export type MovieCandidatesSearch = {
  type: SearchCommandTag.MovieCandidatesSearch;
  data: SearchEntry<tmdb.MovieCandidate[]>;
};

export type ShowSearch = {
  type: SearchCommandTag.ShowSearch;
  data: SearchEntry<tmdb.Show>;
};

export type GitHubUserSearch = {
  type: SearchCommandTag.GitHubUserSearch;
  data: SearchEntry<github.UserData>;
};

export type GitHubRepositorySearch = {
  type: SearchCommandTag.GitHubRepositorySearch;
  data: SearchEntry<github.Repository>;
};

export function PersonSearch(data: SearchEntry<tmdb.Person>): PersonSearch {
  return {type: SearchCommandTag.PersonSearch, data};
}

export function MovieSearch(data: SearchEntry<tmdb.MovieData>): MovieSearch {
  return {type: SearchCommandTag.MovieSearch, data};
}

export function MovieSearchById(data: SearchEntry<tmdb.MovieData>): MovieSearchById {
  return {type: SearchCommandTag.MovieSearchById, data};
}

export function MovieCandidatesSearch(
  data: SearchEntry<tmdb.MovieCandidate[]>
): MovieCandidatesSearch {
  return {type: SearchCommandTag.MovieCandidatesSearch, data};
}

export function ShowSearch(data: SearchEntry<tmdb.Show>): ShowSearch {
  return {type: SearchCommandTag.ShowSearch, data};
}

export function GitHubUserSearch(data: SearchEntry<github.UserData>): GitHubUserSearch {
  return {type: SearchCommandTag.GitHubUserSearch, data};
}

export function GitHubRepositorySearch(
  data: SearchEntry<github.Repository>
): GitHubRepositorySearch {
  return {type: SearchCommandTag.GitHubRepositorySearch, data};
}

export function isSearchCommand(value: unknown): value is SearchCommand {
  return [
    isPersonSearch,
    isMovieSearch,
    isMovieSearchById,
    isMovieCandidatesSearch,
    isShowSearch,
    isGitHubUserSearch,
    isGitHubRepositorySearch,
  ].some((typePredicate) => typePredicate(value));
}

export function isPersonSearch(value: unknown): value is PersonSearch {
  return svt.isInterface<PersonSearch>(value, {
    type: SearchCommandTag.PersonSearch,
    data: isSearchEntry(tmdb.isPerson),
  });
}

export function isMovieSearch(value: unknown): value is MovieSearch {
  return svt.isInterface<MovieSearch>(value, {
    type: SearchCommandTag.MovieSearch,
    data: isSearchEntry(tmdb.isMovieData),
  });
}

export function isMovieSearchById(value: unknown): value is MovieSearchById {
  return svt.isInterface<MovieSearchById>(value, {
    type: SearchCommandTag.MovieSearchById,
    data: isSearchEntry(tmdb.isMovieData),
  });
}

export function isMovieCandidatesSearch(value: unknown): value is MovieCandidatesSearch {
  return svt.isInterface<MovieCandidatesSearch>(value, {
    type: SearchCommandTag.MovieCandidatesSearch,
    data: isSearchEntry(svt.arrayOf(tmdb.isMovieCandidate)),
  });
}

export function isShowSearch(value: unknown): value is ShowSearch {
  return svt.isInterface<ShowSearch>(value, {
    type: SearchCommandTag.ShowSearch,
    data: isSearchEntry(tmdb.isShow),
  });
}

export function isGitHubUserSearch(value: unknown): value is GitHubUserSearch {
  return svt.isInterface<GitHubUserSearch>(value, {
    type: SearchCommandTag.GitHubUserSearch,
    data: isSearchEntry(github.isUserData),
  });
}

export function isGitHubRepositorySearch(value: unknown): value is GitHubRepositorySearch {
  return svt.isInterface<GitHubRepositorySearch>(value, {
    type: SearchCommandTag.GitHubRepositorySearch,
    data: isSearchEntry(github.isRepository),
  });
}

export function validateSearchCommand(value: unknown): svt.ValidationResult<SearchCommand> {
  return svt.validateWithTypeTag<SearchCommand>(
    value,
    {
      [SearchCommandTag.PersonSearch]: validatePersonSearch,
      [SearchCommandTag.MovieSearch]: validateMovieSearch,
      [SearchCommandTag.MovieSearchById]: validateMovieSearchById,
      [SearchCommandTag.MovieCandidatesSearch]: validateMovieCandidatesSearch,
      [SearchCommandTag.ShowSearch]: validateShowSearch,
      [SearchCommandTag.GitHubUserSearch]: validateGitHubUserSearch,
      [SearchCommandTag.GitHubRepositorySearch]: validateGitHubRepositorySearch,
    },
    "type"
  );
}

export function validatePersonSearch(value: unknown): svt.ValidationResult<PersonSearch> {
  return svt.validate<PersonSearch>(value, {
    type: SearchCommandTag.PersonSearch,
    data: validateSearchEntry(tmdb.validatePerson),
  });
}

export function validateMovieSearch(value: unknown): svt.ValidationResult<MovieSearch> {
  return svt.validate<MovieSearch>(value, {
    type: SearchCommandTag.MovieSearch,
    data: validateSearchEntry(tmdb.validateMovieData),
  });
}

export function validateMovieSearchById(value: unknown): svt.ValidationResult<MovieSearchById> {
  return svt.validate<MovieSearchById>(value, {
    type: SearchCommandTag.MovieSearchById,
    data: validateSearchEntry(tmdb.validateMovieData),
  });
}

export function validateMovieCandidatesSearch(
  value: unknown
): svt.ValidationResult<MovieCandidatesSearch> {
  return svt.validate<MovieCandidatesSearch>(value, {
    type: SearchCommandTag.MovieCandidatesSearch,
    data: validateSearchEntry(svt.validateArray(tmdb.validateMovieCandidate)),
  });
}

export function validateShowSearch(value: unknown): svt.ValidationResult<ShowSearch> {
  return svt.validate<ShowSearch>(value, {
    type: SearchCommandTag.ShowSearch,
    data: validateSearchEntry(tmdb.validateShow),
  });
}

export function validateGitHubUserSearch(value: unknown): svt.ValidationResult<GitHubUserSearch> {
  return svt.validate<GitHubUserSearch>(value, {
    type: SearchCommandTag.GitHubUserSearch,
    data: validateSearchEntry(github.validateUserData),
  });
}

export function validateGitHubRepositorySearch(
  value: unknown
): svt.ValidationResult<GitHubRepositorySearch> {
  return svt.validate<GitHubRepositorySearch>(value, {
    type: SearchCommandTag.GitHubRepositorySearch,
    data: validateSearchEntry(github.validateRepository),
  });
}
