import * as svt from "simple-validation-tools";

import * as commands from "./commands";

export type ApiRequest = GetSearches | GetUsers;

export enum ApiRequestTag {
  GetSearches = "GetSearches",
  GetUsers = "GetUsers",
}

export type GetSearches = {
  type: ApiRequestTag.GetSearches;
};

export type GetUsers = {
  type: ApiRequestTag.GetUsers;
};

export function GetSearches(): GetSearches {
  return {type: ApiRequestTag.GetSearches};
}

export function GetUsers(): GetUsers {
  return {type: ApiRequestTag.GetUsers};
}

export function isApiRequest(value: unknown): value is ApiRequest {
  return [isGetSearches, isGetUsers].some((typePredicate) => typePredicate(value));
}

export function isGetSearches(value: unknown): value is GetSearches {
  return svt.isInterface<GetSearches>(value, {type: ApiRequestTag.GetSearches});
}

export function isGetUsers(value: unknown): value is GetUsers {
  return svt.isInterface<GetUsers>(value, {type: ApiRequestTag.GetUsers});
}

export function validateApiRequest(value: unknown): svt.ValidationResult<ApiRequest> {
  return svt.validateWithTypeTag<ApiRequest>(
    value,
    {[ApiRequestTag.GetSearches]: validateGetSearches, [ApiRequestTag.GetUsers]: validateGetUsers},
    "type"
  );
}

export function validateGetSearches(value: unknown): svt.ValidationResult<GetSearches> {
  return svt.validate<GetSearches>(value, {type: ApiRequestTag.GetSearches});
}

export function validateGetUsers(value: unknown): svt.ValidationResult<GetUsers> {
  return svt.validate<GetUsers>(value, {type: ApiRequestTag.GetUsers});
}

export type ClientEvent = ExecuteApiRequest;

export enum ClientEventTag {
  ExecuteApiRequest = "ExecuteApiRequest",
}

export type ExecuteApiRequest = {
  type: ClientEventTag.ExecuteApiRequest;
  data: ApiRequest;
};

export function ExecuteApiRequest(data: ApiRequest): ExecuteApiRequest {
  return {type: ClientEventTag.ExecuteApiRequest, data};
}

export function isClientEvent(value: unknown): value is ClientEvent {
  return [isExecuteApiRequest].some((typePredicate) => typePredicate(value));
}

export function isExecuteApiRequest(value: unknown): value is ExecuteApiRequest {
  return svt.isInterface<ExecuteApiRequest>(value, {
    type: ClientEventTag.ExecuteApiRequest,
    data: isApiRequest,
  });
}

export function validateClientEvent(value: unknown): svt.ValidationResult<ClientEvent> {
  return svt.validateWithTypeTag<ClientEvent>(
    value,
    {[ClientEventTag.ExecuteApiRequest]: validateExecuteApiRequest},
    "type"
  );
}

export function validateExecuteApiRequest(value: unknown): svt.ValidationResult<ExecuteApiRequest> {
  return svt.validate<ExecuteApiRequest>(value, {
    type: ClientEventTag.ExecuteApiRequest,
    data: validateApiRequest,
  });
}

export type ServerEvent = SearchesResult | UsersResult;

export enum ServerEventTag {
  SearchesResult = "SearchesResult",
  UsersResult = "UsersResult",
}

export type SearchesResult = {
  type: ServerEventTag.SearchesResult;
  data: commands.SearchCommand[];
};

export type UsersResult = {
  type: ServerEventTag.UsersResult;
  data: commands.BotUser[];
};

export function SearchesResult(data: commands.SearchCommand[]): SearchesResult {
  return {type: ServerEventTag.SearchesResult, data};
}

export function UsersResult(data: commands.BotUser[]): UsersResult {
  return {type: ServerEventTag.UsersResult, data};
}

export function isServerEvent(value: unknown): value is ServerEvent {
  return [isSearchesResult, isUsersResult].some((typePredicate) => typePredicate(value));
}

export function isSearchesResult(value: unknown): value is SearchesResult {
  return svt.isInterface<SearchesResult>(value, {
    type: ServerEventTag.SearchesResult,
    data: svt.arrayOf(commands.isSearchCommand),
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
