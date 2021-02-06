import * as React from "react";
import {BotUser} from "../../../../pomoshtnik-shared/gotyno/commands";

export type Props = {
  users: BotUser[];
};

function Users({users}: Props) {
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
