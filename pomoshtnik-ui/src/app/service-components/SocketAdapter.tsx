import * as React from "react";
import {
  ApiRequest,
  ApplicationEvent,
  ClearWebSocketRequests,
  ConnectToWebSocket,
  EventFromClient,
  EventFromServer,
  validateServerEvent,
} from "../../shared/gotyno/api";

export type Props = {
  socket: SocketIOClient.Socket;
  dispatch: React.Dispatch<ApplicationEvent>;
  requests: ApiRequest[];
};

function SocketAdapter({socket, dispatch, requests}: Props) {
  React.useEffect(() => {
    socket.on("ServerEvent", (payload: unknown) => {
      const validationResult = validateServerEvent(payload);
      if (validationResult.type === "Valid") {
        dispatch(EventFromServer(validationResult.value));
      } else {
        throw new Error(
          `Unrecognized websocket message: ${JSON.stringify(validationResult.errors)}`
        );
      }
    });

    dispatch(EventFromClient(ConnectToWebSocket()));
  }, [dispatch, socket]);

  React.useEffect(() => {
    if (requests.length !== 0) {
      requests.forEach((r) => {
        socket.emit("ClientRequest", r);
      });

      dispatch(EventFromClient(ClearWebSocketRequests()));
    }
  }, [dispatch, socket, requests]);

  return <></>;
}

export default SocketAdapter;
