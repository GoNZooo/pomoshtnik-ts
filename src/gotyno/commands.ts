import * as svt from "simple-validation-tools";

import * as tmdb from "./tmdb";

import * as github from "./github";

export type Either<L, R> = Left<L> | Right<R>;

export enum EitherTag {
  Left = "Left",
  Right = "Right",
}

export type Left<L> = {
  type: EitherTag.Left;
  data: L;
};

export type Right<R> = {
  type: EitherTag.Right;
  data: R;
};

export function Left<L>(data: L): Left<L> {
  return {type: EitherTag.Left, data};
}

export function Right<R>(data: R): Right<R> {
  return {type: EitherTag.Right, data};
}

export function isEither<L, R>(
  isL: svt.TypePredicate<L>,
  isR: svt.TypePredicate<R>
): svt.TypePredicate<Either<L, R>> {
  return function isEitherLR(value: unknown): value is Either<L, R> {
    return [isLeft(isL), isRight(isR)].some((typePredicate) => typePredicate(value));
  };
}

export function isLeft<L>(isL: svt.TypePredicate<L>): svt.TypePredicate<Left<L>> {
  return function isLeftL(value: unknown): value is Left<L> {
    return svt.isInterface<Left<L>>(value, {type: EitherTag.Left, data: isL});
  };
}

export function isRight<R>(isR: svt.TypePredicate<R>): svt.TypePredicate<Right<R>> {
  return function isRightR(value: unknown): value is Right<R> {
    return svt.isInterface<Right<R>>(value, {type: EitherTag.Right, data: isR});
  };
}

export function validateEither<L, R>(
  validateL: svt.Validator<L>,
  validateR: svt.Validator<R>
): svt.Validator<Either<L, R>> {
  return function validateEitherLR(value: unknown): svt.ValidationResult<Either<L, R>> {
    return svt.validateWithTypeTag<Either<L, R>>(
      value,
      {[EitherTag.Left]: validateLeft(validateL), [EitherTag.Right]: validateRight(validateR)},
      "type"
    );
  };
}

export function validateLeft<L>(validateL: svt.Validator<L>): svt.Validator<Left<L>> {
  return function validateLeftL(value: unknown): svt.ValidationResult<Left<L>> {
    return svt.validate<Left<L>>(value, {type: EitherTag.Left, data: validateL});
  };
}

export function validateRight<R>(validateR: svt.Validator<R>): svt.Validator<Right<R>> {
  return function validateRightR(value: unknown): svt.ValidationResult<Right<R>> {
    return svt.validate<Right<R>>(value, {type: EitherTag.Right, data: validateR});
  };
}

export type Maybe<T> = Nothing | Just<T>;

export enum MaybeTag {
  Nothing = "Nothing",
  Just = "Just",
}

export type Nothing = {
  type: MaybeTag.Nothing;
};

export type Just<T> = {
  type: MaybeTag.Just;
  data: T;
};

export function Nothing(): Nothing {
  return {type: MaybeTag.Nothing};
}

export function Just<T>(data: T): Just<T> {
  return {type: MaybeTag.Just, data};
}

export function isMaybe<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<Maybe<T>> {
  return function isMaybeT(value: unknown): value is Maybe<T> {
    return [isNothing, isJust(isT)].some((typePredicate) => typePredicate(value));
  };
}

export function isNothing(value: unknown): value is Nothing {
  return svt.isInterface<Nothing>(value, {type: MaybeTag.Nothing});
}

export function isJust<T>(isT: svt.TypePredicate<T>): svt.TypePredicate<Just<T>> {
  return function isJustT(value: unknown): value is Just<T> {
    return svt.isInterface<Just<T>>(value, {type: MaybeTag.Just, data: isT});
  };
}

export function validateMaybe<T>(validateT: svt.Validator<T>): svt.Validator<Maybe<T>> {
  return function validateMaybeT(value: unknown): svt.ValidationResult<Maybe<T>> {
    return svt.validateWithTypeTag<Maybe<T>>(
      value,
      {[MaybeTag.Nothing]: validateNothing, [MaybeTag.Just]: validateJust(validateT)},
      "type"
    );
  };
}

export function validateNothing(value: unknown): svt.ValidationResult<Nothing> {
  return svt.validate<Nothing>(value, {type: MaybeTag.Nothing});
}

export function validateJust<T>(validateT: svt.Validator<T>): svt.Validator<Just<T>> {
  return function validateJustT(value: unknown): svt.ValidationResult<Just<T>> {
    return svt.validate<Just<T>>(value, {type: MaybeTag.Just, data: validateT});
  };
}

export type SearchCommand =
  | PersonSearch
  | MovieSearch
  | ShowSearch
  | GitHubUserSearch
  | GitHubRepositorySearch;

export enum SearchCommandTag {
  PersonSearch = "PersonSearch",
  MovieSearch = "MovieSearch",
  ShowSearch = "ShowSearch",
  GitHubUserSearch = "GitHubUserSearch",
  GitHubRepositorySearch = "GitHubRepositorySearch",
}

export type PersonSearch = {
  type: SearchCommandTag.PersonSearch;
  data: Either<string, tmdb.Person>;
};

export type MovieSearch = {
  type: SearchCommandTag.MovieSearch;
  data: Either<string, tmdb.MovieData>;
};

export type ShowSearch = {
  type: SearchCommandTag.ShowSearch;
  data: Either<string, tmdb.Show>;
};

export type GitHubUserSearch = {
  type: SearchCommandTag.GitHubUserSearch;
  data: Either<string, github.UserData>;
};

export type GitHubRepositorySearch = {
  type: SearchCommandTag.GitHubRepositorySearch;
  data: Either<string, github.Repository>;
};

export function PersonSearch(data: Either<string, tmdb.Person>): PersonSearch {
  return {type: SearchCommandTag.PersonSearch, data};
}

export function MovieSearch(data: Either<string, tmdb.MovieData>): MovieSearch {
  return {type: SearchCommandTag.MovieSearch, data};
}

export function ShowSearch(data: Either<string, tmdb.Show>): ShowSearch {
  return {type: SearchCommandTag.ShowSearch, data};
}

export function GitHubUserSearch(data: Either<string, github.UserData>): GitHubUserSearch {
  return {type: SearchCommandTag.GitHubUserSearch, data};
}

export function GitHubRepositorySearch(
  data: Either<string, github.Repository>
): GitHubRepositorySearch {
  return {type: SearchCommandTag.GitHubRepositorySearch, data};
}

export function isSearchCommand(value: unknown): value is SearchCommand {
  return [
    isPersonSearch,
    isMovieSearch,
    isShowSearch,
    isGitHubUserSearch,
    isGitHubRepositorySearch,
  ].some((typePredicate) => typePredicate(value));
}

export function isPersonSearch(value: unknown): value is PersonSearch {
  return svt.isInterface<PersonSearch>(value, {
    type: SearchCommandTag.PersonSearch,
    data: isEither(svt.isString, tmdb.isPerson),
  });
}

export function isMovieSearch(value: unknown): value is MovieSearch {
  return svt.isInterface<MovieSearch>(value, {
    type: SearchCommandTag.MovieSearch,
    data: isEither(svt.isString, tmdb.isMovieData),
  });
}

export function isShowSearch(value: unknown): value is ShowSearch {
  return svt.isInterface<ShowSearch>(value, {
    type: SearchCommandTag.ShowSearch,
    data: isEither(svt.isString, tmdb.isShow),
  });
}

export function isGitHubUserSearch(value: unknown): value is GitHubUserSearch {
  return svt.isInterface<GitHubUserSearch>(value, {
    type: SearchCommandTag.GitHubUserSearch,
    data: isEither(svt.isString, github.isUserData),
  });
}

export function isGitHubRepositorySearch(value: unknown): value is GitHubRepositorySearch {
  return svt.isInterface<GitHubRepositorySearch>(value, {
    type: SearchCommandTag.GitHubRepositorySearch,
    data: isEither(svt.isString, github.isRepository),
  });
}

export function validateSearchCommand(value: unknown): svt.ValidationResult<SearchCommand> {
  return svt.validateWithTypeTag<SearchCommand>(
    value,
    {
      [SearchCommandTag.PersonSearch]: validatePersonSearch,
      [SearchCommandTag.MovieSearch]: validateMovieSearch,
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
    data: validateEither(svt.validateString, tmdb.validatePerson),
  });
}

export function validateMovieSearch(value: unknown): svt.ValidationResult<MovieSearch> {
  return svt.validate<MovieSearch>(value, {
    type: SearchCommandTag.MovieSearch,
    data: validateEither(svt.validateString, tmdb.validateMovieData),
  });
}

export function validateShowSearch(value: unknown): svt.ValidationResult<ShowSearch> {
  return svt.validate<ShowSearch>(value, {
    type: SearchCommandTag.ShowSearch,
    data: validateEither(svt.validateString, tmdb.validateShow),
  });
}

export function validateGitHubUserSearch(value: unknown): svt.ValidationResult<GitHubUserSearch> {
  return svt.validate<GitHubUserSearch>(value, {
    type: SearchCommandTag.GitHubUserSearch,
    data: validateEither(svt.validateString, github.validateUserData),
  });
}

export function validateGitHubRepositorySearch(
  value: unknown
): svt.ValidationResult<GitHubRepositorySearch> {
  return svt.validate<GitHubRepositorySearch>(value, {
    type: SearchCommandTag.GitHubRepositorySearch,
    data: validateEither(svt.validateString, github.validateRepository),
  });
}

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
  | Movie
  | Person
  | Show
  | ISBN
  | GitHubUser
  | GitHubRepository;

export enum CommandTag {
  Ping = "Ping",
  WhoAreYou = "WhoAreYou",
  Searches = "Searches",
  Movie = "Movie",
  Person = "Person",
  Show = "Show",
  ISBN = "ISBN",
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

export type Movie = {
  type: CommandTag.Movie;
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

export type ISBN = {
  type: CommandTag.ISBN;
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

export function Movie(data: string): Movie {
  return {type: CommandTag.Movie, data};
}

export function Person(data: string): Person {
  return {type: CommandTag.Person, data};
}

export function Show(data: string): Show {
  return {type: CommandTag.Show, data};
}

export function ISBN(data: string): ISBN {
  return {type: CommandTag.ISBN, data};
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
    isMovie,
    isPerson,
    isShow,
    isISBN,
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

export function isMovie(value: unknown): value is Movie {
  return svt.isInterface<Movie>(value, {type: CommandTag.Movie, data: svt.isString});
}

export function isPerson(value: unknown): value is Person {
  return svt.isInterface<Person>(value, {type: CommandTag.Person, data: svt.isString});
}

export function isShow(value: unknown): value is Show {
  return svt.isInterface<Show>(value, {type: CommandTag.Show, data: svt.isString});
}

export function isISBN(value: unknown): value is ISBN {
  return svt.isInterface<ISBN>(value, {type: CommandTag.ISBN, data: svt.isString});
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
      [CommandTag.Movie]: validateMovie,
      [CommandTag.Person]: validatePerson,
      [CommandTag.Show]: validateShow,
      [CommandTag.ISBN]: validateISBN,
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

export function validateMovie(value: unknown): svt.ValidationResult<Movie> {
  return svt.validate<Movie>(value, {type: CommandTag.Movie, data: svt.validateString});
}

export function validatePerson(value: unknown): svt.ValidationResult<Person> {
  return svt.validate<Person>(value, {type: CommandTag.Person, data: svt.validateString});
}

export function validateShow(value: unknown): svt.ValidationResult<Show> {
  return svt.validate<Show>(value, {type: CommandTag.Show, data: svt.validateString});
}

export function validateISBN(value: unknown): svt.ValidationResult<ISBN> {
  return svt.validate<ISBN>(value, {type: CommandTag.ISBN, data: svt.validateString});
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
