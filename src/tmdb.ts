import * as svt from "simple-validation-tools";
import fetch from "isomorphic-fetch";
import {
  BackdropSize,
  ConfigurationData,
  PosterSize,
  ProfileSize,
  StillSize,
  validateConfigurationData,
  MovieData,
  Show,
  validateShow,
  validatePerson,
  Person,
  MovieCandidate,
  ShowCandidate,
  PersonCandidate,
  validateShowSearchResult,
  validatePersonSearchResult,
  validateMovieSearchResult,
  validateMovieData,
} from "./gotyno/tmdb";

const apiUrl = "https://api.themoviedb.org/3/";

export const preferredPosterSize: PosterSize = PosterSize.w185;

export const preferredProfileSize: ProfileSize = ProfileSize.w185;

export const preferredStillSize: StillSize = StillSize.w185;

export const preferredBackdropSize: BackdropSize = BackdropSize.w300;

const configurationSuffix = `configuration`;
export const getConfiguration = async (
  apiKey: string
): Promise<svt.ValidationResult<ConfigurationData>> => {
  const response = await fetch(apiUrl + configurationSuffix + `?api_key=${apiKey}`);
  const json = await response.json();

  return validateConfigurationData(json);
};

export const searchMovie = async (
  apiKey: string,
  name: string
): Promise<svt.ValidationResult<MovieCandidate[]>> => {
  const result = await fetch(
    `${apiUrl}search/movie?query=${name}&language=en-US&page=1&api_key=${apiKey}`
  );
  const json = await result.json();
  const searchResultValidation = validateMovieSearchResult(json);
  if (searchResultValidation.type === "Valid") {
    return {type: "Valid", value: searchResultValidation.value.results};
  } else {
    return searchResultValidation;
  }
};

export const searchShow = async (
  apiKey: string,
  name: string
): Promise<svt.ValidationResult<ShowCandidate[]>> => {
  const result = await fetch(
    `${apiUrl}search/tv?query=${name}&language=en-US&page=1&api_key=${apiKey}`
  );
  const json = await result.json();

  const searchResultValidation = validateShowSearchResult(json);
  if (searchResultValidation.type === "Valid") {
    return {type: "Valid", value: searchResultValidation.value.results};
  } else {
    return searchResultValidation;
  }
};

export const searchPerson = async (
  apiKey: string,
  name: string
): Promise<svt.ValidationResult<PersonCandidate[]>> => {
  const result = await fetch(
    `${apiUrl}search/person?query=${name}&language=en-US&page=1&api_key=${apiKey}`
  );
  const json = await result.json();
  const searchResultValidation = validatePersonSearchResult(json);
  if (searchResultValidation.type === "Valid") {
    return {type: "Valid", value: searchResultValidation.value.results};
  } else {
    return searchResultValidation;
  }
};

export const getPerson = async (
  apiKey: string,
  id: number
): Promise<svt.ValidationResult<Person>> => {
  const result = await fetch(
    `${apiUrl}person/${id}?language=en-US&append_to_response=combined_credits&api_key=${apiKey}`
  );
  const json = await result.json();

  return validatePerson(json);
};

export const getMovie = async (
  apiKey: string,
  id: number
): Promise<svt.ValidationResult<MovieData>> => {
  const result = await fetch(
    `${apiUrl}movie/${id}?language=en-US&append_to_response=credits&api_key=${apiKey}`
  );
  const json = await result.json();

  return validateMovieData(json);
};

export const getShow = async (apiKey: string, id: number): Promise<svt.ValidationResult<Show>> => {
  const result = await fetch(
    `${apiUrl}tv/${id}?language=en-US&append_to_response=credits,external_ids&api_key=${apiKey}`
  );
  const json = await result.json();

  return validateShow(json);
};
