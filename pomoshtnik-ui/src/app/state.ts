import * as React from "react";
import {ClientEvent, ClientEventTag} from "./gotyno/events";
import {assertUnreachable} from "../shared/utilities";
import {BotUser} from "../shared/gotyno/commands";

export type State = {
  users: BotUser[];
};

export const initialState: State = {
  users: [],
};

export function reduce(state: State, event: ClientEvent): State {
  switch (event.type) {
    case ClientEventTag.Click: {
      return {...state};
    }

    default:
      return assertUnreachable(event.type);
  }
}
