import {
  ApiRequest,
  ApplicationEvent,
  ApplicationEventTag,
  ClientEvent,
  ClientEventTag,
  GetSearchesFilter,
  NoSearchesFilter,
  ServerEvent,
  ServerEventTag,
} from "../shared/gotyno/api";
import {assertUnreachable} from "../shared/utilities";
import {BotUser, SearchCommand} from "../shared/gotyno/commands";

export type State = {
  users: BotUser[];
  searches: SearchCommand[];
  apiRequests: ApiRequest[];
  getSearchesFilter: GetSearchesFilter;
};

export const initialState: State = {
  users: [],
  searches: [],
  apiRequests: [],
  getSearchesFilter: NoSearchesFilter(),
};

export function reduce(state: State, event: ApplicationEvent): State {
  switch (event.type) {
    case ApplicationEventTag.EventFromClient: {
      return handleClientEvent(state, event.data);
    }

    case ApplicationEventTag.EventFromServer: {
      return handleServerEvent(state, event.data);
    }

    default:
      return assertUnreachable(event);
  }
}

function handleClientEvent(state: State, event: ClientEvent): State {
  switch (event.type) {
    case ClientEventTag.ExecuteApiRequest: {
      return {...state, apiRequests: [...state.apiRequests, event.data]};
    }

    case ClientEventTag.ClearApiRequests: {
      return {...state, apiRequests: []};
    }

    case ClientEventTag.SetGetSearchesFilter: {
      return {...state, getSearchesFilter: event.data};
    }

    default:
      return assertUnreachable(event);
  }
}

function handleServerEvent(state: State, event: ServerEvent): State {
  switch (event.type) {
    case ServerEventTag.SearchesResult: {
      return {...state, searches: event.data};
    }

    case ServerEventTag.SearchByUUIDResult: {
      return {...state, searches: [event.data]};
    }

    case ServerEventTag.UsersResult: {
      return {...state, users: event.data};
    }

    default:
      return assertUnreachable(event);
  }
}
