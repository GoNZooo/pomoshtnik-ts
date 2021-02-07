import {
  ApiRequest,
  ApplicationEvent,
  ApplicationEventTag,
  ClientEvent,
  ClientEventTag,
  ServerEvent,
  ServerEventTag,
} from "../shared/gotyno/api";
import {assertUnreachable} from "../shared/utilities";
import {BotUser, SearchCommand} from "../shared/gotyno/commands";

export type State = {
  users: BotUser[];
  searches: SearchCommand[];
  apiRequests: ApiRequest[];
};

export const initialState: State = {
  users: [],
  searches: [],
  apiRequests: [],
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

    default:
      return assertUnreachable(event.type);
  }
}

function handleServerEvent(state: State, event: ServerEvent): State {
  switch (event.type) {
    case ServerEventTag.SearchesResult: {
      return {...state, searches: event.data};
    }

    case ServerEventTag.UsersResult: {
      return {...state, users: event.data};
    }

    default:
      return assertUnreachable(event);
  }
}
