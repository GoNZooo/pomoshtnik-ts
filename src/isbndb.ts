import * as t from "io-ts";
import fetch from "isomorphic-fetch";
import { Either } from "fp-ts/lib/Either";

const baseUrl = "https://api2.isbndb.com/";

export const Book = t.type({
  publisher: t.string,
  isbn13: t.string,
  isbn: t.string,
  authors: t.array(t.string),
  title: t.string,
  publish_date: t.string,
  pages: t.number,
  image: t.union([t.null, t.string]),
  overview: t.union([t.undefined, t.string]),
  synopsys: t.union([t.undefined, t.string]),
});

export type Book = t.TypeOf<typeof Book>;

export const getBookByISBN = async (key: string, isbn: string): Promise<Either<t.Errors, Book>> => {
  const response = await fetch(`${baseUrl}book/${isbn}`, { headers: { Authorization: key } });
  const json = await response.json();
  console.log(json.book);

  return Book.decode(json.book);
};
