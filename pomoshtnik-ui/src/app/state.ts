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
import {assertUnreachable, hasMongoId} from "../shared/utilities";
import {BotUser, SearchCommand} from "../shared/gotyno/commands";
import SocketIO from "socket.io-client";

export type State = {
  users: BotUser[];
  searches: SearchCommand[];
  apiRequests: ApiRequest[];
  getSearchesFilter: GetSearchesFilter;
  socket: SocketIOClient.Socket;
};

export function initialState(): State {
  const socket = SocketIO(`ws://${window.location.host}`, {autoConnect: false});

  return {
    users: [],
    searches: [],
    apiRequests: [],
    getSearchesFilter: NoSearchesFilter(),
    socket,
  };
}

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

    case ClientEventTag.ConnectToWebSocket: {
      console.log("Connecting to websocket");
      const {socket} = state;
      socket.connect();

      return state;
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

    case ServerEventTag.SearchRemoved: {
      const id = event.data;
      const searches = state.searches.filter((s) => hasMongoId<SearchCommand>(s) && s._id !== id);

      return {...state, searches};
    }

    default:
      return assertUnreachable(event);
  }
}
