import {Repository, UserData, validateRepository, validateUserData} from "./gotyno/github";
import * as svt from "simple-validation-tools";
import fetch from "isomorphic-fetch";

const API_URL = "https://api.github.com";

export async function getUser(username: string): Promise<svt.ValidationResult<UserData>> {
  const url = API_URL + "/users/" + username;
  const result = await fetch(url);
  const json = await result.json();

  return validateUserData(json);
}

export async function getRepository(name: string): Promise<svt.ValidationResult<Repository>> {
  const url = API_URL + "/repos/" + name;
  const result = await fetch(url);
  const json = await result.json();

  return validateRepository(json);
}
