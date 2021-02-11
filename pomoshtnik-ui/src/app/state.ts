import {
  ApiRequest,
  ApplicationEvent,
  ApplicationEventTag,
  ClientEvent,
  ClientEventTag,
  GetSearchesFilter,
  GetSearchesFilterTag,
  NoSearchesFilter,
  ServerEvent,
  ServerEventTag,
} from "../shared/gotyno/api";
import {assertUnreachable, hasMongoId, searchResult} from "../shared/utilities";
import {BotUser, SearchCommand} from "../shared/gotyno/commands";
import SocketIO from "socket.io-client";

export type State = {
  users: BotUser[];
  searches: SearchCommand[];
  filteredSearches: SearchCommand[];
  apiRequests: ApiRequest[];
  webSocketRequests: ApiRequest[];
  getSearchesFilter: GetSearchesFilter;
  socket: SocketIOClient.Socket;
};

export function initialState(): State {
  const socket = SocketIO(`ws://${window.location.host}`, {
    autoConnect: false,
    upgrade: true,
  });

  return {
    users: [],
    searches: [],
    filteredSearches: [],
    apiRequests: [],
    webSocketRequests: [],
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

    case ClientEventTag.ExecuteWebSocketRequest: {
      return {...state, webSocketRequests: [...state.webSocketRequests, event.data]};
    }

    case ClientEventTag.ClearWebSocketRequests: {
      return {...state, webSocketRequests: []};
    }

    case ClientEventTag.SetGetSearchesFilter: {
      const filteredSearches = applyGetSearchesFilter(event.data, state.searches);

      return {...state, getSearchesFilter: event.data, filteredSearches};
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
    case ServerEventTag.ConnectedToWebSocket: {
      return state;
    }

    case ServerEventTag.SearchesResult: {
      return {
        ...state,
        searches: event.data,
        filteredSearches: applyGetSearchesFilter(state.getSearchesFilter, event.data),
      };
    }

    case ServerEventTag.SearchByUUIDResult: {
      return {...state, searches: [event.data]};
    }

    case ServerEventTag.UsersResult: {
      return {...state, users: event.data};
    }

    case ServerEventTag.SearchAdded: {
      const command = event.data;
      const searches = [command, ...state.searches];
      const filteredSearches = applyGetSearchesFilter(state.getSearchesFilter, searches);

      return {...state, searches, filteredSearches};
    }

    case ServerEventTag.SearchRemoved: {
      const id = event.data;
      const searches = state.searches.filter((s) => hasMongoId<SearchCommand>(s) && s._id !== id);
      const filteredSearches = applyGetSearchesFilter(state.getSearchesFilter, searches);

      return {...state, searches, filteredSearches};
    }

    default:
      return assertUnreachable(event);
  }
}

function applyGetSearchesFilter(
  filter: GetSearchesFilter,
  searches: SearchCommand[]
): SearchCommand[] {
  switch (filter.type) {
    case GetSearchesFilterTag.NoSearchesFilter: {
      return searches;
    }

    case GetSearchesFilterTag.SearchesByResultLike: {
      return searches.filter((s) => {
        const result = searchResult(s);

        return result.match(filter.data);
      });
    }

    case GetSearchesFilterTag.SearchesByQueryLike: {
      throw new Error("search by query not yet implemented");
    }

    default:
      return assertUnreachable(filter);
  }
}
