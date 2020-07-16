import * as t from "io-ts";
import { Either, either, isRight, left, right } from "fp-ts/lib/Either";
import fetch from "isomorphic-fetch";
import { Option, none, some } from "fp-ts/lib/Option";

const apiUrl = "https://api.themoviedb.org/3/";

const posterDefinition = {
  w92: null,
  w154: null,
  w185: null,
  w342: null,
  w500: null,
  w780: null,
  original: null,
} as const;

const profileDefinition = {
  w45: null,
  w185: null,
  w300: null,
  original: null,
} as const;

export const PosterSize = t.keyof(posterDefinition);

export type PosterSize = keyof typeof posterDefinition;

export const ProfileSize = t.keyof(profileDefinition);

export type ProfileSize = keyof typeof profileDefinition;

export const preferredPosterSize: PosterSize = "w185";

export const preferredProfileSize: ProfileSize = "w185";

export const ImageConfigurationData = t.type({
  base_url: t.string,
  secure_base_url: t.string,
  poster_sizes: t.array(PosterSize),
});

export const ConfigurationData = t.type({ images: ImageConfigurationData });

export type ConfigurationData = t.TypeOf<typeof ConfigurationData>;

export const Actor = t.type({
  popularity: t.number,
  name: t.string,
  id: t.number,
  profile_path: t.string,
});

export type Actor = t.TypeOf<typeof Actor>;

export const ActorSearchResult = t.type({
  page: t.number,
  total_results: t.number,
  results: t.array(Actor),
});

const configurationSuffix = `configuration`;
export const getConfiguration = async (
  apiKey: string
): Promise<Either<t.Errors, ConfigurationData>> => {
  return ConfigurationData.decode(
    await (await fetch(apiUrl + configurationSuffix + `?api_key=${apiKey}`)).json()
  );
};

export const searchActor = async (
  apiKey: string,
  name: string
): Promise<Either<t.Errors, Actor[]>> => {
  const result = await fetch(`${apiUrl}search/person/?query=${name}&page=1&api_key=${apiKey}`);
  const json = await result.json();

  return either.chain(ActorSearchResult.decode(json), (searchResults) => {
    return right(searchResults.results);
  });
};
