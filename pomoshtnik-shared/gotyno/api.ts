import * as svt from "simple-validation-tools";

import * as commands from "./commands";

export type GetSearchesFilter = SearchesByQueryLike | SearchesByResultLike | NoSearchesFilter;

export enum GetSearchesFilterTag {
  SearchesByQueryLike = "SearchesByQueryLike",
  SearchesByResultLike = "SearchesByResultLike",
  NoSearchesFilter = "NoSearchesFilter",
}

export type SearchesByQueryLike = {
  type: GetSearchesFilterTag.SearchesByQueryLike;
  data: string;
};

export type SearchesByResultLike = {
  type: GetSearchesFilterTag.SearchesByResultLike;
  data: string;
};

export type NoSearchesFilter = {
  type: GetSearchesFilterTag.NoSearchesFilter;
};

export function SearchesByQueryLike(data: string): SearchesByQueryLike {
  return {type: GetSearchesFilterTag.SearchesByQueryLike, data};
}

export function SearchesByResultLike(data: string): SearchesByResultLike {
  return {type: GetSearchesFilterTag.SearchesByResultLike, data};
}

export function NoSearchesFilter(): NoSearchesFilter {
  return {type: GetSearchesFilterTag.NoSearchesFilter};
}

export function isGetSearchesFilter(value: unknown): value is GetSearchesFilter {
  return [isSearchesByQueryLike, isSearchesByResultLike, isNoSearchesFilter].some((typePredicate) =>
    typePredicate(value)
  );
}

export function isSearchesByQueryLike(value: unknown): value is SearchesByQueryLike {
  return svt.isInterface<SearchesByQueryLike>(value, {
    type: GetSearchesFilterTag.SearchesByQueryLike,
    data: svt.isString,
  });
}

export function isSearchesByResultLike(value: unknown): value is SearchesByResultLike {
  return svt.isInterface<SearchesByResultLike>(value, {
    type: GetSearchesFilterTag.SearchesByResultLike,
    data: svt.isString,
  });
}

export function isNoSearchesFilter(value: unknown): value is NoSearchesFilter {
  return svt.isInterface<NoSearchesFilter>(value, {type: GetSearchesFilterTag.NoSearchesFilter});
}

export function validateGetSearchesFilter(value: unknown): svt.ValidationResult<GetSearchesFilter> {
  return svt.validateWithTypeTag<GetSearchesFilter>(
    value,
    {
      [GetSearchesFilterTag.SearchesByQueryLike]: validateSearchesByQueryLike,
      [GetSearchesFilterTag.SearchesByResultLike]: validateSearchesByResultLike,
      [GetSearchesFilterTag.NoSearchesFilter]: validateNoSearchesFilter,
    },
    "type"
  );
}

export function validateSearchesByQueryLike(
  value: unknown
): svt.ValidationResult<SearchesByQueryLike> {
  return svt.validate<SearchesByQueryLike>(value, {
    type: GetSearchesFilterTag.SearchesByQueryLike,
    data: svt.validateString,
  });
}

export function validateSearchesByResultLike(
  value: unknown
): svt.ValidationResult<SearchesByResultLike> {
  return svt.validate<SearchesByResultLike>(value, {
    type: GetSearchesFilterTag.SearchesByResultLike,
    data: svt.validateString,
  });
}

export function validateNoSearchesFilter(value: unknown): svt.ValidationResult<NoSearchesFilter> {
  return svt.validate<NoSearchesFilter>(value, {type: GetSearchesFilterTag.NoSearchesFilter});
}

export type SearchesParameters = {
  filter: GetSearchesFilter;
};

export function isSearchesParameters(value: unknown): value is SearchesParameters {
  return svt.isInterface<SearchesParameters>(value, {filter: isGetSearchesFilter});
}

export function validateSearchesParameters(
  value: unknown
): svt.ValidationResult<SearchesParameters> {
  return svt.validate<SearchesParameters>(value, {filter: validateGetSearchesFilter});
}

export type ApiRequest = GetSearches | GetSearch | GetUsers;

export enum ApiRequestTag {
  GetSearches = "GetSearches",
  GetSearch = "GetSearch",
  GetUsers = "GetUsers",
}

export type GetSearches = {
  type: ApiRequestTag.GetSearches;
  data: GetSearchesFilter;
};

export type GetSearch = {
  type: ApiRequestTag.GetSearch;
  data: string;
};

export type GetUsers = {
  type: ApiRequestTag.GetUsers;
};

export function GetSearches(data: GetSearchesFilter): GetSearches {
  return {type: ApiRequestTag.GetSearches, data};
}

export function GetSearch(data: string): GetSearch {
  return {type: ApiRequestTag.GetSearch, data};
}

export function GetUsers(): GetUsers {
  return {type: ApiRequestTag.GetUsers};
}

export function isApiRequest(value: unknown): value is ApiRequest {
  return [isGetSearches, isGetSearch, isGetUsers].some((typePredicate) => typePredicate(value));
}

export function isGetSearches(value: unknown): value is GetSearches {
  return svt.isInterface<GetSearches>(value, {
    type: ApiRequestTag.GetSearches,
    data: isGetSearchesFilter,
  });
}

export function isGetSearch(value: unknown): value is GetSearch {
  return svt.isInterface<GetSearch>(value, {type: ApiRequestTag.GetSearch, data: svt.isString});
}

export function isGetUsers(value: unknown): value is GetUsers {
  return svt.isInterface<GetUsers>(value, {type: ApiRequestTag.GetUsers});
}

export function validateApiRequest(value: unknown): svt.ValidationResult<ApiRequest> {
  return svt.validateWithTypeTag<ApiRequest>(
    value,
    {
      [ApiRequestTag.GetSearches]: validateGetSearches,
      [ApiRequestTag.GetSearch]: validateGetSearch,
      [ApiRequestTag.GetUsers]: validateGetUsers,
    },
    "type"
  );
}

export function validateGetSearches(value: unknown): svt.ValidationResult<GetSearches> {
  return svt.validate<GetSearches>(value, {
    type: ApiRequestTag.GetSearches,
    data: validateGetSearchesFilter,
  });
}

export function validateGetSearch(value: unknown): svt.ValidationResult<GetSearch> {
  return svt.validate<GetSearch>(value, {type: ApiRequestTag.GetSearch, data: svt.validateString});
}

export function validateGetUsers(value: unknown): svt.ValidationResult<GetUsers> {
  return svt.validate<GetUsers>(value, {type: ApiRequestTag.GetUsers});
}

export type ClientEvent = ExecuteApiRequest | ClearApiRequests | SetGetSearchesFilter;

export enum ClientEventTag {
  ExecuteApiRequest = "ExecuteApiRequest",
  ClearApiRequests = "ClearApiRequests",
  SetGetSearchesFilter = "SetGetSearchesFilter",
}

export type ExecuteApiRequest = {
  type: ClientEventTag.ExecuteApiRequest;
  data: ApiRequest;
};

export type ClearApiRequests = {
  type: ClientEventTag.ClearApiRequests;
};

export type SetGetSearchesFilter = {
  type: ClientEventTag.SetGetSearchesFilter;
  data: GetSearchesFilter;
};

export function ExecuteApiRequest(data: ApiRequest): ExecuteApiRequest {
  return {type: ClientEventTag.ExecuteApiRequest, data};
}

export function ClearApiRequests(): ClearApiRequests {
  return {type: ClientEventTag.ClearApiRequests};
}

export function SetGetSearchesFilter(data: GetSearchesFilter): SetGetSearchesFilter {
  return {type: ClientEventTag.SetGetSearchesFilter, data};
}

export function isClientEvent(value: unknown): value is ClientEvent {
  return [isExecuteApiRequest, isClearApiRequests, isSetGetSearchesFilter].some((typePredicate) =>
    typePredicate(value)
  );
}

export function isExecuteApiRequest(value: unknown): value is ExecuteApiRequest {
  return svt.isInterface<ExecuteApiRequest>(value, {
    type: ClientEventTag.ExecuteApiRequest,
    data: isApiRequest,
  });
}

export function isClearApiRequests(value: unknown): value is ClearApiRequests {
  return svt.isInterface<ClearApiRequests>(value, {type: ClientEventTag.ClearApiRequests});
}

export function isSetGetSearchesFilter(value: unknown): value is SetGetSearchesFilter {
  return svt.isInterface<SetGetSearchesFilter>(value, {
    type: ClientEventTag.SetGetSearchesFilter,
    data: isGetSearchesFilter,
  });
}

export function validateClientEvent(value: unknown): svt.ValidationResult<ClientEvent> {
  return svt.validateWithTypeTag<ClientEvent>(
    value,
    {
      [ClientEventTag.ExecuteApiRequest]: validateExecuteApiRequest,
      [ClientEventTag.ClearApiRequests]: validateClearApiRequests,
      [ClientEventTag.SetGetSearchesFilter]: validateSetGetSearchesFilter,
    },
    "type"
  );
}

export function validateExecuteApiRequest(value: unknown): svt.ValidationResult<ExecuteApiRequest> {
  return svt.validate<ExecuteApiRequest>(value, {
    type: ClientEventTag.ExecuteApiRequest,
    data: validateApiRequest,
  });
}

export function validateClearApiRequests(value: unknown): svt.ValidationResult<ClearApiRequests> {
  return svt.validate<ClearApiRequests>(value, {type: ClientEventTag.ClearApiRequests});
}

export function validateSetGetSearchesFilter(
  value: unknown
): svt.ValidationResult<SetGetSearchesFilter> {
  return svt.validate<SetGetSearchesFilter>(value, {
    type: ClientEventTag.SetGetSearchesFilter,
    data: validateGetSearchesFilter,
  });
}

export type ServerEvent = SearchesResult | SearchByUUIDResult | UsersResult;

export enum ServerEventTag {
  SearchesResult = "SearchesResult",
  SearchByUUIDResult = "SearchByUUIDResult",
  UsersResult = "UsersResult",
}

export type SearchesResult = {
  type: ServerEventTag.SearchesResult;
  data: commands.SearchCommand[];
};

export type SearchByUUIDResult = {
  type: ServerEventTag.SearchByUUIDResult;
  data: commands.SearchCommand;
};

export type UsersResult = {
  type: ServerEventTag.UsersResult;
  data: commands.BotUser[];
};

export function SearchesResult(data: commands.SearchCommand[]): SearchesResult {
  return {type: ServerEventTag.SearchesResult, data};
}

export function SearchByUUIDResult(data: commands.SearchCommand): SearchByUUIDResult {
  return {type: ServerEventTag.SearchByUUIDResult, data};
}

export function UsersResult(data: commands.BotUser[]): UsersResult {
  return {type: ServerEventTag.UsersResult, data};
}

export function isServerEvent(value: unknown): value is ServerEvent {
  return [isSearchesResult, isSearchByUUIDResult, isUsersResult].some((typePredicate) =>
    typePredicate(value)
  );
}

export function isSearchesResult(value: unknown): value is SearchesResult {
  return svt.isInterface<SearchesResult>(value, {
    type: ServerEventTag.SearchesResult,
    data: svt.arrayOf(commands.isSearchCommand),
  });
}

export function isSearchByUUIDResult(value: unknown): value is SearchByUUIDResult {
  return svt.isInterface<SearchByUUIDResult>(value, {
    type: ServerEventTag.SearchByUUIDResult,
    data: commands.isSearchCommand,
  });
}

export function isUsersResult(value: unknown): value is UsersResult {
  return svt.isInterface<UsersResult>(value, {
    type: ServerEventTag.UsersResult,
    data: svt.arrayOf(commands.isBotUser),
  });
}

export function validateServerEvent(value: unknown): svt.ValidationResult<ServerEvent> {
  return svt.validateWithTypeTag<ServerEvent>(
    value,
    {
      [ServerEventTag.SearchesResult]: validateSearchesResult,
      [ServerEventTag.SearchByUUIDResult]: validateSearchByUUIDResult,
      [ServerEventTag.UsersResult]: validateUsersResult,
    },
    "type"
  );
}

export function validateSearchesResult(value: unknown): svt.ValidationResult<SearchesResult> {
  return svt.validate<SearchesResult>(value, {
    type: ServerEventTag.SearchesResult,
    data: svt.validateArray(commands.validateSearchCommand),
  });
}

export function validateSearchByUUIDResult(
  value: unknown
): svt.ValidationResult<SearchByUUIDResult> {
  return svt.validate<SearchByUUIDResult>(value, {
    type: ServerEventTag.SearchByUUIDResult,
    data: commands.validateSearchCommand,
  });
}

export function validateUsersResult(value: unknown): svt.ValidationResult<UsersResult> {
  return svt.validate<UsersResult>(value, {
    type: ServerEventTag.UsersResult,
    data: svt.validateArray(commands.validateBotUser),
  });
}

export type ApplicationEvent = EventFromClient | EventFromServer;

export enum ApplicationEventTag {
  EventFromClient = "EventFromClient",
  EventFromServer = "EventFromServer",
}

export type EventFromClient = {
  type: ApplicationEventTag.EventFromClient;
  data: ClientEvent;
};

export type EventFromServer = {
  type: ApplicationEventTag.EventFromServer;
  data: ServerEvent;
};

export function EventFromClient(data: ClientEvent): EventFromClient {
  return {type: ApplicationEventTag.EventFromClient, data};
}

export function EventFromServer(data: ServerEvent): EventFromServer {
  return {type: ApplicationEventTag.EventFromServer, data};
}

export function isApplicationEvent(value: unknown): value is ApplicationEvent {
  return [isEventFromClient, isEventFromServer].some((typePredicate) => typePredicate(value));
}

export function isEventFromClient(value: unknown): value is EventFromClient {
  return svt.isInterface<EventFromClient>(value, {
    type: ApplicationEventTag.EventFromClient,
    data: isClientEvent,
  });
}

export function isEventFromServer(value: unknown): value is EventFromServer {
  return svt.isInterface<EventFromServer>(value, {
    type: ApplicationEventTag.EventFromServer,
    data: isServerEvent,
  });
}

export function validateApplicationEvent(value: unknown): svt.ValidationResult<ApplicationEvent> {
  return svt.validateWithTypeTag<ApplicationEvent>(
    value,
    {
      [ApplicationEventTag.EventFromClient]: validateEventFromClient,
      [ApplicationEventTag.EventFromServer]: validateEventFromServer,
    },
    "type"
  );
}

export function validateEventFromClient(value: unknown): svt.ValidationResult<EventFromClient> {
  return svt.validate<EventFromClient>(value, {
    type: ApplicationEventTag.EventFromClient,
    data: validateClientEvent,
  });
}

export function validateEventFromServer(value: unknown): svt.ValidationResult<EventFromServer> {
  return svt.validate<EventFromServer>(value, {
    type: ApplicationEventTag.EventFromServer,
    data: validateServerEvent,
  });
}
