import * as React from "react";
import {BotUser} from "../../shared/gotyno/commands";
import {
  EventFromClient,
  ExecuteApiRequest,
  ApplicationEvent,
  GetUsers,
} from "../../shared/gotyno/api";

export type Props = {
  users: BotUser[];
  dispatch: React.Dispatch<ApplicationEvent>;
};

function Users({users, dispatch}: Props) {
  React.useEffect(() => {
    dispatch(EventFromClient(ExecuteApiRequest(GetUsers())));
  }, [dispatch]);

  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li>{u.nickname}</li>
        ))}
      </ul>
    </>
  );
}

export default Users;
