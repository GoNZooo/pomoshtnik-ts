import * as React from "react";
import {Switch, Route} from "react-router-dom";
import Users from "./views/Users";
import {State} from "./state";
import {ClientEvent} from "./gotyno/events";

export type Props = {
  state: State;
  dispatch: ClientEvent;
};

function View<E>({state, dispatch}: Props) {
  return (
    <Switch>
      <Route path="/users">
        <Users users={state.users} />
      </Route>

      {/*<Route path="/searches">*/}
      {/*  <Searches searches={state.searches} />*/}
      {/*</Route>*/}
    </Switch>
  );
}

export default View;
