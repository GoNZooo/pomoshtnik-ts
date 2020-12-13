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
