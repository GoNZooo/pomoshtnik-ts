import * as React from "react";
import "./App.css";
import {reduce, initialState} from "./app/state";
import View from "./app/View";
import ApiExecutor from "./app/service-components/ApiExecutor";

function App() {
  const [state, dispatch] = React.useReducer(reduce, initialState);

  return (
    <div className="App">
      <ApiExecutor requests={state.apiRequests} dispatch={dispatch} />
      <View state={state} dispatch={dispatch} />
    </div>
  );
}

export default App;
