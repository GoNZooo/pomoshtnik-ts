import * as svt from "simple-validation-tools";

export type Command =
  | Ping
  | WhoAreYou
  | Movie
  | Person
  | Show
  | ISBN
  | GitHubUser
  | GitHubRepository;

export enum CommandTag {
  Ping = "Ping",
  WhoAreYou = "WhoAreYou",
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
  data: string;
};

export function Ping(): Ping {
  return {type: CommandTag.Ping};
}

export function WhoAreYou(): WhoAreYou {
  return {type: CommandTag.WhoAreYou};
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

export function GitHubRepository(data: string): GitHubRepository {
  return {type: CommandTag.GitHubRepository, data};
}

export function isCommand(value: unknown): value is Command {
  return [
    isPing,
    isWhoAreYou,
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
    data: svt.isString,
  });
}

export function validateCommand(value: unknown): svt.ValidationResult<Command> {
  return svt.validateOneOf<Command>(value, [
    validatePing,
    validateWhoAreYou,
    validateMovie,
    validatePerson,
    validateShow,
    validateISBN,
    validateGitHubUser,
    validateGitHubRepository,
  ]);
}

export function validatePing(value: unknown): svt.ValidationResult<Ping> {
  return svt.validate<Ping>(value, {type: CommandTag.Ping});
}

export function validateWhoAreYou(value: unknown): svt.ValidationResult<WhoAreYou> {
  return svt.validate<WhoAreYou>(value, {type: CommandTag.WhoAreYou});
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
    data: svt.validateString,
  });
}
