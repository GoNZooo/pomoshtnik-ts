import * as t from "io-ts";
import { Either, either, right } from "fp-ts/lib/Either";
import fetch from "isomorphic-fetch";

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
// Ordinarily this would just be a list of strings that make up the enum but `io-ts`
// encourages using `keyof` of an object to make the enum/union.

const profileDefinition = {
  w45: null,
  w185: null,
  w300: null,
  h632: null,
  original: null,
} as const;

const stillDefinition = {
  w92: null,
  w185: null,
  w300: null,
  h632: null,
  original: null,
} as const;

const backdropDefinition = {
  w300: null,
  w780: null,
  w1280: null,
  original: null,
} as const;

export const PosterSize = t.keyof(posterDefinition);

// Defines sizes for posters to link to; these are located at different trees on
// TMDB's server.
export type PosterSize = keyof typeof posterDefinition;

export const ProfileSize = t.keyof(profileDefinition);

// Defines sizes for profile pictures to link to; these are located at different
// trees on TMDB's server.
export type ProfileSize = keyof typeof profileDefinition;

export const StillSize = t.keyof(stillDefinition);

// Defines sizes for stills (movie/TV) to link to; these are located at different
// trees on TMDB's server.
export type StillSize = keyof typeof stillDefinition;

export const BackdropSize = t.keyof(backdropDefinition);

// Defines sizes for stills (movie/TV) to link to; these are located at different
// trees on TMDB's server.
export type BackdropSize = keyof typeof backdropDefinition;

export const preferredPosterSize: PosterSize = "w185";

export const preferredProfileSize: ProfileSize = "w185";

export const preferredStillSize: StillSize = "w185";

export const preferredBackdropSize: BackdropSize = "w300";

export const ImageConfigurationData = t.type({
  base_url: t.string,
  secure_base_url: t.string,
  poster_sizes: t.array(PosterSize),
  profile_sizes: t.array(ProfileSize),
  still_sizes: t.array(StillSize),
  backdrop_sizes: t.array(BackdropSize),
});

export const ConfigurationData = t.type({
  images: ImageConfigurationData,
  change_keys: t.array(t.string),
});

export type ConfigurationData = t.TypeOf<typeof ConfigurationData>;

export const CastEntry = t.type({
  // disabling this because it causes issues with different formats for TV and movies
  // cast_id: t.number,
  character: t.string,
  credit_id: t.string,
  id: t.number,
  name: t.string,
  order: t.number,
  profile_path: t.union([t.null, t.string]),
});

export type CastEntry = t.TypeOf<typeof CastEntry>;

export const CrewEntry = t.type({
  credit_id: t.string,
  department: t.string,
  id: t.number,
  name: t.string,
  job: t.string,
  profile_path: t.union([t.null, t.string]),
});

export type CrewEntry = t.TypeOf<typeof CrewEntry>;

export const Credits = t.type({
  id: t.union([t.undefined, t.number]),
  cast: t.array(CastEntry),
  crew: t.array(CrewEntry),
});

export type Credits = t.TypeOf<typeof Credits>;

export const Movie = t.type({
  poster_path: t.union([t.null, t.string]),
  id: t.number,
  title: t.union([t.undefined, t.string]),
  vote_average: t.number,
  release_date: t.union([t.undefined, t.string]),
  overview: t.string,
  credits: Credits,
});

export type Movie = t.TypeOf<typeof Movie>;

export const MovieCandidate = t.type({
  poster_path: t.union([t.null, t.string]),
  id: t.number,
  title: t.union([t.undefined, t.string]),
  vote_average: t.number,
  release_date: t.union([t.undefined, t.string]),
  overview: t.string,
});

export type MovieCandidate = t.TypeOf<typeof MovieCandidate>;

export const Episode = t.type({
  air_date: t.string,
  id: t.number,
  name: t.string,
  overview: t.string,
  season_number: t.number,
  episode_number: t.number,
  still_path: t.union([t.null, t.string]),
  vote_average: t.number,
  vote_count: t.number,
});

export type Episode = t.TypeOf<typeof Episode>;

export const Show = t.type({
  poster_path: t.union([t.null, t.string]),
  id: t.number,
  name: t.string,
  vote_average: t.number,
  first_air_date: t.union([t.undefined, t.string]),
  overview: t.string,
  credits: Credits,
  last_episode_to_air: t.union([t.null, Episode]),
});

export type Show = t.TypeOf<typeof Show>;

export const ShowCandidate = t.type({
  poster_path: t.union([t.null, t.string]),
  id: t.number,
  name: t.string,
  vote_average: t.number,
  first_air_date: t.union([t.undefined, t.string]),
  overview: t.string,
});

export type ShowCandidate = t.TypeOf<typeof ShowCandidate>;

export const KnownForMovie = t.type({
  media_type: t.literal("movie"),
  poster_path: t.union([t.undefined, t.string]),
  id: t.number,
  title: t.union([t.undefined, t.string]),
  vote_average: t.number,
  release_date: t.union([t.undefined, t.string]),
  overview: t.string,
});

export type KnownForMovie = t.TypeOf<typeof KnownForMovie>;

export const KnownForShow = t.type({
  media_type: t.literal("tv"),
  poster_path: t.union([t.undefined, t.string]),
  id: t.number,
  vote_average: t.number,
  overview: t.string,
  first_air_date: t.union([t.null, t.string]),
  name: t.union([t.undefined, t.string]),
});

export type KnownForShow = t.TypeOf<typeof KnownForShow>;

export const Person = t.type({
  popularity: t.number,
  name: t.string,
  id: t.number,
  profile_path: t.union([t.null, t.string]),
  known_for: t.array(t.union([KnownForMovie, KnownForShow])),
  known_for_department: t.string,
});

export type Person = t.TypeOf<typeof Person>;

export const PersonSearchResult = t.type({
  page: t.number,
  total_results: t.number,
  results: t.array(Person),
});

export const MovieSearchResult = t.type({
  page: t.number,
  total_results: t.number,
  results: t.array(MovieCandidate),
});

export const ShowSearchResult = t.type({
  page: t.number,
  total_results: t.number,
  results: t.array(ShowCandidate),
});

const configurationSuffix = `configuration`;
export const getConfiguration = async (
  apiKey: string
): Promise<Either<t.Errors, ConfigurationData>> => {
  return ConfigurationData.decode(
    await (await fetch(apiUrl + configurationSuffix + `?api_key=${apiKey}`)).json()
  );
};

export const searchMovie = async (
  apiKey: string,
  name: string
): Promise<Either<t.Errors, MovieCandidate[]>> => {
  const result = await fetch(
    `${apiUrl}search/movie?query=${name}&language=en-US&page=1&api_key=${apiKey}`
  );
  const json = await result.json();

  return either.chain(MovieSearchResult.decode(json), (searchResults) => {
    return right(searchResults.results);
  });
};

export const searchShow = async (
  apiKey: string,
  name: string
): Promise<Either<t.Errors, ShowCandidate[]>> => {
  const result = await fetch(
    `${apiUrl}search/tv?query=${name}&language=en-US&page=1&api_key=${apiKey}`
  );
  const json = await result.json();

  return either.chain(ShowSearchResult.decode(json), (searchResults) => {
    return right(searchResults.results);
  });
};

export const searchPerson = async (
  apiKey: string,
  name: string
): Promise<Either<t.Errors, Person[]>> => {
  const result = await fetch(
    `${apiUrl}search/person?query=${name}&language=en-US&page=1&api_key=${apiKey}`
  );
  const json = await result.json();

  return either.chain(PersonSearchResult.decode(json), (searchResults) => {
    return right(searchResults.results);
  });
};

export const getMovie = async (apiKey: string, id: number): Promise<Either<t.Errors, Movie>> => {
  const result = await fetch(
    `${apiUrl}movie/${id}?language=en-US&append_to_response=credits&api_key=${apiKey}`
  );
  const json = await result.json();

  return Movie.decode(json);
};

export const getShow = async (apiKey: string, id: number): Promise<Either<t.Errors, Show>> => {
  const result = await fetch(
    `${apiUrl}tv/${id}?language=en-US&append_to_response=credits&api_key=${apiKey}`
  );
  const json = await result.json();

  return Show.decode(json);
};
