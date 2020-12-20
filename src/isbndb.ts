import fetch from "isomorphic-fetch";
import * as svt from "simple-validation-tools";
import {Book, validateBook} from "./gotyno/isbndb";

const baseUrl = "https://api2.isbndb.com/";

export async function getBookByISBN(
  key: string,
  isbn: string
): Promise<svt.ValidationResult<Book>> {
  const response = await fetch(`${baseUrl}book/${isbn}`, {headers: {Authorization: key}});
  const json = (await response.json()) as {book: unknown};

  return validateBook(json.book);
}
