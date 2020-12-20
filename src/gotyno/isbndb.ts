import * as svt from "simple-validation-tools";

export type Book = {
  publisher: string;
  isbn13: string;
  isbn: string;
  authors: string[];
  title: string;
  publish_date: string;
  pages: number;
  image: string | null | undefined;
  overview: string | null | undefined;
  synopsys: string | null | undefined;
};

export function isBook(value: unknown): value is Book {
  return svt.isInterface<Book>(value, {
    publisher: svt.isString,
    isbn13: svt.isString,
    isbn: svt.isString,
    authors: svt.arrayOf(svt.isString),
    title: svt.isString,
    publish_date: svt.isString,
    pages: svt.isNumber,
    image: svt.optional(svt.isString),
    overview: svt.optional(svt.isString),
    synopsys: svt.optional(svt.isString),
  });
}

export function validateBook(value: unknown): svt.ValidationResult<Book> {
  return svt.validate<Book>(value, {
    publisher: svt.validateString,
    isbn13: svt.validateString,
    isbn: svt.validateString,
    authors: svt.validateArray(svt.validateString),
    title: svt.validateString,
    publish_date: svt.validateString,
    pages: svt.validateNumber,
    image: svt.validateOptional(svt.validateString),
    overview: svt.validateOptional(svt.validateString),
    synopsys: svt.validateOptional(svt.validateString),
  });
}
