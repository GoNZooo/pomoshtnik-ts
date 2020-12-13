import * as svt from "simple-validation-tools";

export enum PosterSize {
  w92 = "w92",
  w154 = "w154",
  w185 = "w185",
  w342 = "w342",
  w500 = "w500",
  w780 = "w780",
  original = "original",
}

export function isPosterSize(value: unknown): value is PosterSize {
  return [
    PosterSize.w92,
    PosterSize.w154,
    PosterSize.w185,
    PosterSize.w342,
    PosterSize.w500,
    PosterSize.w780,
    PosterSize.original,
  ].some((v) => v === value);
}

export function validatePosterSize(value: unknown): svt.ValidationResult<PosterSize> {
  return svt.validateOneOf<PosterSize>(value, [
    svt.validateConstant<PosterSize.w92>(PosterSize.w92),
    svt.validateConstant<PosterSize.w154>(PosterSize.w154),
    svt.validateConstant<PosterSize.w185>(PosterSize.w185),
    svt.validateConstant<PosterSize.w342>(PosterSize.w342),
    svt.validateConstant<PosterSize.w500>(PosterSize.w500),
    svt.validateConstant<PosterSize.w780>(PosterSize.w780),
    svt.validateConstant<PosterSize.original>(PosterSize.original),
  ]);
}

export enum ProfileSize {
  w45 = "w45",
  w185 = "w185",
  w300 = "w300",
  h632 = "h632",
  original = "original",
}

export function isProfileSize(value: unknown): value is ProfileSize {
  return [
    ProfileSize.w45,
    ProfileSize.w185,
    ProfileSize.w300,
    ProfileSize.h632,
    ProfileSize.original,
  ].some((v) => v === value);
}

export function validateProfileSize(value: unknown): svt.ValidationResult<ProfileSize> {
  return svt.validateOneOf<ProfileSize>(value, [
    svt.validateConstant<ProfileSize.w45>(ProfileSize.w45),
    svt.validateConstant<ProfileSize.w185>(ProfileSize.w185),
    svt.validateConstant<ProfileSize.w300>(ProfileSize.w300),
    svt.validateConstant<ProfileSize.h632>(ProfileSize.h632),
    svt.validateConstant<ProfileSize.original>(ProfileSize.original),
  ]);
}

export enum StillSize {
  w92 = "w92",
  w185 = "w185",
  w300 = "w300",
  h632 = "h632",
  original = "original",
}

export function isStillSize(value: unknown): value is StillSize {
  return [StillSize.w92, StillSize.w185, StillSize.w300, StillSize.h632, StillSize.original].some(
    (v) => v === value
  );
}

export function validateStillSize(value: unknown): svt.ValidationResult<StillSize> {
  return svt.validateOneOf<StillSize>(value, [
    svt.validateConstant<StillSize.w92>(StillSize.w92),
    svt.validateConstant<StillSize.w185>(StillSize.w185),
    svt.validateConstant<StillSize.w300>(StillSize.w300),
    svt.validateConstant<StillSize.h632>(StillSize.h632),
    svt.validateConstant<StillSize.original>(StillSize.original),
  ]);
}

export enum BackdropSize {
  w300 = "w300",
  w780 = "w780",
  w1280 = "w1280",
  original = "original",
}

export function isBackdropSize(value: unknown): value is BackdropSize {
  return [BackdropSize.w300, BackdropSize.w780, BackdropSize.w1280, BackdropSize.original].some(
    (v) => v === value
  );
}

export function validateBackdropSize(value: unknown): svt.ValidationResult<BackdropSize> {
  return svt.validateOneOf<BackdropSize>(value, [
    svt.validateConstant<BackdropSize.w300>(BackdropSize.w300),
    svt.validateConstant<BackdropSize.w780>(BackdropSize.w780),
    svt.validateConstant<BackdropSize.w1280>(BackdropSize.w1280),
    svt.validateConstant<BackdropSize.original>(BackdropSize.original),
  ]);
}

export type ImageConfigurationData = {
  base_url: string;
  secure_base_url: string;
  poster_sizes: PosterSize[];
  profile_sizes: ProfileSize[];
  still_sizes: StillSize[];
  backdrop_sizes: BackdropSize[];
};

export function isImageConfigurationData(value: unknown): value is ImageConfigurationData {
  return svt.isInterface<ImageConfigurationData>(value, {
    base_url: svt.isString,
    secure_base_url: svt.isString,
    poster_sizes: svt.arrayOf(isPosterSize),
    profile_sizes: svt.arrayOf(isProfileSize),
    still_sizes: svt.arrayOf(isStillSize),
    backdrop_sizes: svt.arrayOf(isBackdropSize),
  });
}

export function validateImageConfigurationData(
  value: unknown
): svt.ValidationResult<ImageConfigurationData> {
  return svt.validate<ImageConfigurationData>(value, {
    base_url: svt.validateString,
    secure_base_url: svt.validateString,
    poster_sizes: svt.validateArray(validatePosterSize),
    profile_sizes: svt.validateArray(validateProfileSize),
    still_sizes: svt.validateArray(validateStillSize),
    backdrop_sizes: svt.validateArray(validateBackdropSize),
  });
}

export type ConfigurationData = {
  images: ImageConfigurationData;
  change_keys: string[];
};

export function isConfigurationData(value: unknown): value is ConfigurationData {
  return svt.isInterface<ConfigurationData>(value, {
    images: isImageConfigurationData,
    change_keys: svt.arrayOf(svt.isString),
  });
}

export function validateConfigurationData(value: unknown): svt.ValidationResult<ConfigurationData> {
  return svt.validate<ConfigurationData>(value, {
    images: validateImageConfigurationData,
    change_keys: svt.validateArray(svt.validateString),
  });
}

export type CastEntry = {
  character: string;
  credit_id: string;
  id: number;
  name: string;
  order: number;
  profile_path: string | null | undefined;
};

export function isCastEntry(value: unknown): value is CastEntry {
  return svt.isInterface<CastEntry>(value, {
    character: svt.isString,
    credit_id: svt.isString,
    id: svt.isNumber,
    name: svt.isString,
    order: svt.isNumber,
    profile_path: svt.optional(svt.isString),
  });
}

export function validateCastEntry(value: unknown): svt.ValidationResult<CastEntry> {
  return svt.validate<CastEntry>(value, {
    character: svt.validateString,
    credit_id: svt.validateString,
    id: svt.validateNumber,
    name: svt.validateString,
    order: svt.validateNumber,
    profile_path: svt.validateOptional(svt.validateString),
  });
}

export type CrewEntry = {
  credit_id: string;
  department: string;
  id: number;
  name: string;
  job: string;
  profile_path: string | null | undefined;
};

export function isCrewEntry(value: unknown): value is CrewEntry {
  return svt.isInterface<CrewEntry>(value, {
    credit_id: svt.isString,
    department: svt.isString,
    id: svt.isNumber,
    name: svt.isString,
    job: svt.isString,
    profile_path: svt.optional(svt.isString),
  });
}

export function validateCrewEntry(value: unknown): svt.ValidationResult<CrewEntry> {
  return svt.validate<CrewEntry>(value, {
    credit_id: svt.validateString,
    department: svt.validateString,
    id: svt.validateNumber,
    name: svt.validateString,
    job: svt.validateString,
    profile_path: svt.validateOptional(svt.validateString),
  });
}

export type Credits = {
  id: number | null | undefined;
  cast: CastEntry[];
  crew: CrewEntry[];
};

export function isCredits(value: unknown): value is Credits {
  return svt.isInterface<Credits>(value, {
    id: svt.optional(svt.isNumber),
    cast: svt.arrayOf(isCastEntry),
    crew: svt.arrayOf(isCrewEntry),
  });
}

export function validateCredits(value: unknown): svt.ValidationResult<Credits> {
  return svt.validate<Credits>(value, {
    id: svt.validateOptional(svt.validateNumber),
    cast: svt.validateArray(validateCastEntry),
    crew: svt.validateArray(validateCrewEntry),
  });
}

export type Movie = {
  poster_path: string | null | undefined;
  id: number;
  imdb_id: string;
  title: string | null | undefined;
  vote_average: number;
  release_date: string | null | undefined;
  overview: string;
  credits: Credits;
};

export function isMovie(value: unknown): value is Movie {
  return svt.isInterface<Movie>(value, {
    poster_path: svt.optional(svt.isString),
    id: svt.isNumber,
    imdb_id: svt.isString,
    title: svt.optional(svt.isString),
    vote_average: svt.isNumber,
    release_date: svt.optional(svt.isString),
    overview: svt.isString,
    credits: isCredits,
  });
}

export function validateMovie(value: unknown): svt.ValidationResult<Movie> {
  return svt.validate<Movie>(value, {
    poster_path: svt.validateOptional(svt.validateString),
    id: svt.validateNumber,
    imdb_id: svt.validateString,
    title: svt.validateOptional(svt.validateString),
    vote_average: svt.validateNumber,
    release_date: svt.validateOptional(svt.validateString),
    overview: svt.validateString,
    credits: validateCredits,
  });
}

export type Episode = {
  air_date: string;
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_number: number;
  still_path: string | null | undefined;
  vote_average: number;
  vote_count: number;
};

export function isEpisode(value: unknown): value is Episode {
  return svt.isInterface<Episode>(value, {
    air_date: svt.isString,
    id: svt.isNumber,
    name: svt.isString,
    overview: svt.isString,
    season_number: svt.isNumber,
    episode_number: svt.isNumber,
    still_path: svt.optional(svt.isString),
    vote_average: svt.isNumber,
    vote_count: svt.isNumber,
  });
}

export function validateEpisode(value: unknown): svt.ValidationResult<Episode> {
  return svt.validate<Episode>(value, {
    air_date: svt.validateString,
    id: svt.validateNumber,
    name: svt.validateString,
    overview: svt.validateString,
    season_number: svt.validateNumber,
    episode_number: svt.validateNumber,
    still_path: svt.validateOptional(svt.validateString),
    vote_average: svt.validateNumber,
    vote_count: svt.validateNumber,
  });
}

export type ExternalIds = {
  imdb_id: string | null | undefined;
  freebase_mid: string | null | undefined;
  freebase_id: string | null | undefined;
  tvdb_id: number | null | undefined;
  tvrage_id: number | null | undefined;
};

export function isExternalIds(value: unknown): value is ExternalIds {
  return svt.isInterface<ExternalIds>(value, {
    imdb_id: svt.optional(svt.isString),
    freebase_mid: svt.optional(svt.isString),
    freebase_id: svt.optional(svt.isString),
    tvdb_id: svt.optional(svt.isNumber),
    tvrage_id: svt.optional(svt.isNumber),
  });
}

export function validateExternalIds(value: unknown): svt.ValidationResult<ExternalIds> {
  return svt.validate<ExternalIds>(value, {
    imdb_id: svt.validateOptional(svt.validateString),
    freebase_mid: svt.validateOptional(svt.validateString),
    freebase_id: svt.validateOptional(svt.validateString),
    tvdb_id: svt.validateOptional(svt.validateNumber),
    tvrage_id: svt.validateOptional(svt.validateNumber),
  });
}

export type Show = {
  poster_path: string | null | undefined;
  id: number;
  external_ids: ExternalIds;
  name: string;
  vote_average: number;
  first_air_date: string | null | undefined;
  overview: string;
  credits: Credits;
  last_episode_to_air: Episode | null | undefined;
};

export function isShow(value: unknown): value is Show {
  return svt.isInterface<Show>(value, {
    poster_path: svt.optional(svt.isString),
    id: svt.isNumber,
    external_ids: isExternalIds,
    name: svt.isString,
    vote_average: svt.isNumber,
    first_air_date: svt.optional(svt.isString),
    overview: svt.isString,
    credits: isCredits,
    last_episode_to_air: svt.optional(isEpisode),
  });
}

export function validateShow(value: unknown): svt.ValidationResult<Show> {
  return svt.validate<Show>(value, {
    poster_path: svt.validateOptional(svt.validateString),
    id: svt.validateNumber,
    external_ids: validateExternalIds,
    name: svt.validateString,
    vote_average: svt.validateNumber,
    first_air_date: svt.validateOptional(svt.validateString),
    overview: svt.validateString,
    credits: validateCredits,
    last_episode_to_air: svt.validateOptional(validateEpisode),
  });
}

export type Person = {
  popularity: number;
  name: string;
  id: number;
  profile_path: string | null | undefined;
  known_for_department: string;
  imdb_id: string;
};

export function isPerson(value: unknown): value is Person {
  return svt.isInterface<Person>(value, {
    popularity: svt.isNumber,
    name: svt.isString,
    id: svt.isNumber,
    profile_path: svt.optional(svt.isString),
    known_for_department: svt.isString,
    imdb_id: svt.isString,
  });
}

export function validatePerson(value: unknown): svt.ValidationResult<Person> {
  return svt.validate<Person>(value, {
    popularity: svt.validateNumber,
    name: svt.validateString,
    id: svt.validateNumber,
    profile_path: svt.validateOptional(svt.validateString),
    known_for_department: svt.validateString,
    imdb_id: svt.validateString,
  });
}

export type MovieCandidate = {
  poster_path: string | null | undefined;
  id: number;
  title: string | null | undefined;
  vote_average: number;
  release_date: string | null | undefined;
  overview: string;
};

export function isMovieCandidate(value: unknown): value is MovieCandidate {
  return svt.isInterface<MovieCandidate>(value, {
    poster_path: svt.optional(svt.isString),
    id: svt.isNumber,
    title: svt.optional(svt.isString),
    vote_average: svt.isNumber,
    release_date: svt.optional(svt.isString),
    overview: svt.isString,
  });
}

export function validateMovieCandidate(value: unknown): svt.ValidationResult<MovieCandidate> {
  return svt.validate<MovieCandidate>(value, {
    poster_path: svt.validateOptional(svt.validateString),
    id: svt.validateNumber,
    title: svt.validateOptional(svt.validateString),
    vote_average: svt.validateNumber,
    release_date: svt.validateOptional(svt.validateString),
    overview: svt.validateString,
  });
}

export type ShowCandidate = {
  poster_path: string | null | undefined;
  id: number;
  name: string;
  vote_average: number;
  first_air_date: string | null | undefined;
  overview: string;
};

export function isShowCandidate(value: unknown): value is ShowCandidate {
  return svt.isInterface<ShowCandidate>(value, {
    poster_path: svt.optional(svt.isString),
    id: svt.isNumber,
    name: svt.isString,
    vote_average: svt.isNumber,
    first_air_date: svt.optional(svt.isString),
    overview: svt.isString,
  });
}

export function validateShowCandidate(value: unknown): svt.ValidationResult<ShowCandidate> {
  return svt.validate<ShowCandidate>(value, {
    poster_path: svt.validateOptional(svt.validateString),
    id: svt.validateNumber,
    name: svt.validateString,
    vote_average: svt.validateNumber,
    first_air_date: svt.validateOptional(svt.validateString),
    overview: svt.validateString,
  });
}

export type KnownForMovie = {
  media_type: "movie";
  poster_path: string | null | undefined;
  id: number;
  title: string | null | undefined;
  vote_average: number;
  release_date: string | null | undefined;
  overview: string;
};

export function isKnownForMovie(value: unknown): value is KnownForMovie {
  return svt.isInterface<KnownForMovie>(value, {
    media_type: "movie",
    poster_path: svt.optional(svt.isString),
    id: svt.isNumber,
    title: svt.optional(svt.isString),
    vote_average: svt.isNumber,
    release_date: svt.optional(svt.isString),
    overview: svt.isString,
  });
}

export function validateKnownForMovie(value: unknown): svt.ValidationResult<KnownForMovie> {
  return svt.validate<KnownForMovie>(value, {
    media_type: "movie",
    poster_path: svt.validateOptional(svt.validateString),
    id: svt.validateNumber,
    title: svt.validateOptional(svt.validateString),
    vote_average: svt.validateNumber,
    release_date: svt.validateOptional(svt.validateString),
    overview: svt.validateString,
  });
}

export type KnownForShow = {
  media_type: "tv";
  poster_path: string | null | undefined;
  id: number;
  vote_average: number;
  overview: string;
  first_air_date: string | null | undefined;
  name: string | null | undefined;
};

export function isKnownForShow(value: unknown): value is KnownForShow {
  return svt.isInterface<KnownForShow>(value, {
    media_type: "tv",
    poster_path: svt.optional(svt.isString),
    id: svt.isNumber,
    vote_average: svt.isNumber,
    overview: svt.isString,
    first_air_date: svt.optional(svt.isString),
    name: svt.optional(svt.isString),
  });
}

export function validateKnownForShow(value: unknown): svt.ValidationResult<KnownForShow> {
  return svt.validate<KnownForShow>(value, {
    media_type: "tv",
    poster_path: svt.validateOptional(svt.validateString),
    id: svt.validateNumber,
    vote_average: svt.validateNumber,
    overview: svt.validateString,
    first_air_date: svt.validateOptional(svt.validateString),
    name: svt.validateOptional(svt.validateString),
  });
}

export type KnownFor = KnownForShow | KnownForMovie;

export function isKnownFor(value: unknown): value is KnownFor {
  return [isKnownForShow, isKnownForMovie].some((typePredicate) => typePredicate(value));
}

export function validateKnownFor(value: unknown): svt.ValidationResult<KnownFor> {
  return svt.validateOneOf<KnownFor>(value, [validateKnownForShow, validateKnownForMovie]);
}

export type PersonCandidate = {
  popularity: number;
  name: string;
  id: number;
  profile_path: string | null | undefined;
  known_for: KnownFor[];
  known_for_department: string;
};

export function isPersonCandidate(value: unknown): value is PersonCandidate {
  return svt.isInterface<PersonCandidate>(value, {
    popularity: svt.isNumber,
    name: svt.isString,
    id: svt.isNumber,
    profile_path: svt.optional(svt.isString),
    known_for: svt.arrayOf(isKnownFor),
    known_for_department: svt.isString,
  });
}

export function validatePersonCandidate(value: unknown): svt.ValidationResult<PersonCandidate> {
  return svt.validate<PersonCandidate>(value, {
    popularity: svt.validateNumber,
    name: svt.validateString,
    id: svt.validateNumber,
    profile_path: svt.validateOptional(svt.validateString),
    known_for: svt.validateArray(validateKnownFor),
    known_for_department: svt.validateString,
  });
}

export type PersonSearchResult = {
  page: number;
  total_results: number;
  results: PersonCandidate[];
};

export function isPersonSearchResult(value: unknown): value is PersonSearchResult {
  return svt.isInterface<PersonSearchResult>(value, {
    page: svt.isNumber,
    total_results: svt.isNumber,
    results: svt.arrayOf(isPersonCandidate),
  });
}

export function validatePersonSearchResult(
  value: unknown
): svt.ValidationResult<PersonSearchResult> {
  return svt.validate<PersonSearchResult>(value, {
    page: svt.validateNumber,
    total_results: svt.validateNumber,
    results: svt.validateArray(validatePersonCandidate),
  });
}

export type MovieSearchResult = {
  page: number;
  total_results: number;
  results: MovieCandidate[];
};

export function isMovieSearchResult(value: unknown): value is MovieSearchResult {
  return svt.isInterface<MovieSearchResult>(value, {
    page: svt.isNumber,
    total_results: svt.isNumber,
    results: svt.arrayOf(isMovieCandidate),
  });
}

export function validateMovieSearchResult(value: unknown): svt.ValidationResult<MovieSearchResult> {
  return svt.validate<MovieSearchResult>(value, {
    page: svt.validateNumber,
    total_results: svt.validateNumber,
    results: svt.validateArray(validateMovieCandidate),
  });
}

export type ShowSearchResult = {
  page: number;
  total_results: number;
  results: ShowCandidate[];
};

export function isShowSearchResult(value: unknown): value is ShowSearchResult {
  return svt.isInterface<ShowSearchResult>(value, {
    page: svt.isNumber,
    total_results: svt.isNumber,
    results: svt.arrayOf(isShowCandidate),
  });
}

export function validateShowSearchResult(value: unknown): svt.ValidationResult<ShowSearchResult> {
  return svt.validate<ShowSearchResult>(value, {
    page: svt.validateNumber,
    total_results: svt.validateNumber,
    results: svt.validateArray(validateShowCandidate),
  });
}
