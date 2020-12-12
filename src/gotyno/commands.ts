import * as svt from "simple-validation-tools";

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
    return svt.validateOneOf<Either<L, R>>(value, [
      validateLeft(validateL),
      validateRight(validateR),
    ]);
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
    return svt.validateOneOf<Maybe<T>>(value, [validateNothing, validateJust(validateT)]);
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

export type Command = Ping | WhoAreYou | Movie | Person | Show | ISBN;

export enum CommandTag {
  Ping = "Ping",
  WhoAreYou = "WhoAreYou",
  Movie = "Movie",
  Person = "Person",
  Show = "Show",
  ISBN = "ISBN",
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

export function isCommand(value: unknown): value is Command {
  return [isPing, isWhoAreYou, isMovie, isPerson, isShow, isISBN].some((typePredicate) =>
    typePredicate(value)
  );
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

export function validateCommand(value: unknown): svt.ValidationResult<Command> {
  return svt.validateOneOf<Command>(value, [
    validatePing,
    validateWhoAreYou,
    validateMovie,
    validatePerson,
    validateShow,
    validateISBN,
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
