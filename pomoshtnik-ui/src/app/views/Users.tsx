import * as React from "react";
import {BotUser} from "../../shared/gotyno/commands";
import {ApplicationEvent} from "../../shared/gotyno/api";

export type Props = {
  users: BotUser[];
  dispatch: React.Dispatch<ApplicationEvent>;
};

function Users({users}: Props) {
  return (
    <>
      <h1>Users</h1>
      <ul>
        {users.map((u, index) => (
          <li key={index}>{u.nickname}</li>
        ))}
      </ul>
    </>
  );
}

export default Users;
