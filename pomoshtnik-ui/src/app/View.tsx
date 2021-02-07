import * as React from "react";
import {Switch, Route, BrowserRouter as Router, Link} from "react-router-dom";
import Users from "./views/Users";
import {State} from "./state";
import {ApplicationEvent} from "../shared/gotyno/api";
import Searches from "./views/Searches";

export type Props = {
  state: State;
  dispatch: React.Dispatch<ApplicationEvent>;
};

function View({state, dispatch}: Props) {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/searches">Searches</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/users">
            <Users users={state.users} dispatch={dispatch} />
          </Route>

          <Route path="/searches">
            <Searches
              searches={state.searches}
              dispatch={dispatch}
              filter={state.getSearchesFilter}
            />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default View;
