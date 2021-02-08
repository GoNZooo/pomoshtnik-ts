import * as React from "react";
import {ApplicationEvent, ConnectToWebSocket, EventFromClient} from "../../shared/gotyno/api";

export type Props = {
  socket: SocketIOClient.Socket;
  dispatch: React.Dispatch<ApplicationEvent>;
};

function SocketAdapter({dispatch}: Props) {
  React.useEffect(() => {
    dispatch(EventFromClient(ConnectToWebSocket()));
  }, [dispatch]);

  return <></>;
}

export default SocketAdapter;
