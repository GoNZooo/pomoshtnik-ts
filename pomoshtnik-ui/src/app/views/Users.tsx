import * as React from "react";
import {BotUser} from "../../shared/gotyno/commands";
import {ApplicationEvent} from "../../shared/gotyno/api";
import {List, ListItem, ListItemText} from "@material-ui/core";

export type Props = {
  users: BotUser[];
  dispatch: React.Dispatch<ApplicationEvent>;
};

function Users({users}: Props) {
  return (
    <>
      <h1>Users</h1>
      <List>
        {users.map((u, index) => (
          <ListItem dense button key={index}>
            <ListItemText>
              {u.nickname} ({u.lastCommand.type} @ {u.lastSeen})
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Users;
