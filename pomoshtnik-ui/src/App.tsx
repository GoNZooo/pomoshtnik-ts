import * as React from "react";
import "./App.css";
import {reduce, initialState} from "./app/state";
import View from "./app/View";
import ApiExecutor from "./app/service-components/ApiExecutor";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {CssBaseline} from "@material-ui/core";
import {lightBlue} from "@material-ui/core/colors";
import SocketAdapter from "./app/service-components/SocketAdapter";

const BASE_INTENSITY = 600;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightBlue[BASE_INTENSITY],
    },
    type: "dark",
  },
});

function App() {
  const [state, dispatch] = React.useReducer(reduce, initialState());

  return (
    <div className="App">
      <ApiExecutor requests={state.apiRequests} dispatch={dispatch} />
      <SocketAdapter requests={state.webSocketRequests} socket={state.socket} dispatch={dispatch} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <View state={state} dispatch={dispatch} />
      </ThemeProvider>
    </div>
  );
}

export default App;
