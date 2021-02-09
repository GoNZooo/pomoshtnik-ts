import * as React from "react";
import * as svt from "simple-validation-tools";
import {
  ApiRequest,
  ApiRequestTag,
  ApplicationEvent,
  ClearApiRequests,
  EventFromClient,
  EventFromServer,
  GetSearchesFilter,
  SearchByUUIDResult,
  SearchesResult,
  SearchRemoved,
  UsersResult,
} from "../../shared/gotyno/api";
import {
  BotUser,
  SearchCommand,
  validateBotUser,
  validateSearchCommand,
} from "../../shared/gotyno/commands";
import {assertUnreachable} from "../../shared/utilities";
import {None, Option, OptionTag, Some} from "../../shared/gotyno/utilityTypes";

export type Props = {
  requests: ApiRequest[];
  dispatch: React.Dispatch<ApplicationEvent>;
};

function ApiExecutor({requests, dispatch}: Props) {
  React.useEffect(() => {
    if (requests.length !== 0) {
      requests.forEach(async (r) => {
        switch (r.type) {
          case ApiRequestTag.GetSearches: {
            const results = await getSearches(r.data);
            dispatch(EventFromServer(SearchesResult(results)));
            break;
          }

          case ApiRequestTag.GetSearch: {
            const results = await getSearchByUuid(r.data);
            dispatch(EventFromServer(SearchByUUIDResult(results)));
            break;
          }

          case ApiRequestTag.GetUsers: {
            const results = await getUsers();
            dispatch(EventFromServer(UsersResult(results)));
            break;
          }

          case ApiRequestTag.DeleteSearch: {
            const deleteResult = await deleteSearchByMongoId(r.data);
            if (deleteResult.type === OptionTag.Some) {
              dispatch(EventFromServer(SearchRemoved(deleteResult.data)));
            } else {
              throw new Error("Unable to delete search, TODO");
            }
            break;
          }

          default:
            assertUnreachable(r);
        }
      });
      dispatch(EventFromClient(ClearApiRequests()));
    }
  }, [requests, dispatch]);

  return <></>;
}

export default ApiExecutor;

async function getSearches(filter: GetSearchesFilter): Promise<SearchCommand[]> {
  console.log("getting searches");
  const result = await fetch("/api/searches", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(filter),
    headers: {"Content-Type": "application/json"},
  });
  const json = await result.json();
  const validationResult = svt.validateArray(validateSearchCommand)(json);

  if (validationResult.type === "Valid") {
    return validationResult.value;
  } else {
    throw new Error(`Unable to validate searches: ${JSON.stringify(validationResult.errors)}`);
  }
}

async function getSearchByUuid(uuid: string): Promise<SearchCommand> {
  const result = await fetch("/api/search/" + uuid, {mode: "cors"});
  const json = await result.json();
  const validationResult = validateSearchCommand(json);

  if (validationResult.type === "Valid") {
    return validationResult.value;
  } else {
    throw new Error(`Unable to validate search: ${JSON.stringify(validationResult.errors)}`);
  }
}

async function getUsers(): Promise<BotUser[]> {
  const result = await fetch("/api/users");
  const json = await result.json();
  const validationResult = svt.validateArray(validateBotUser)(json);

  if (validationResult.type === "Valid") {
    return validationResult.value;
  } else {
    throw new Error(`Unable to validate searches: ${JSON.stringify(validationResult.errors)}`);
  }
}

async function deleteSearchByMongoId(id: string): Promise<Option<string>> {
  const result = await fetch("/api/searches/" + id, {method: "DELETE", mode: "cors"});
  const json = (await result.json()) as unknown;

  return svt.isBoolean(json) ? Some(id) : None();
}
