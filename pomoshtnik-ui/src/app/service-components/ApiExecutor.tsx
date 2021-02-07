import * as React from "react";
import * as svt from "simple-validation-tools";
import {
  ApiRequest,
  ApiRequestTag,
  ApplicationEvent,
  EventFromServer,
  SearchesResult,
  UsersResult,
} from "../../shared/gotyno/api";
import {
  BotUser,
  SearchCommand,
  validateBotUser,
  validateSearchCommand,
} from "../../shared/gotyno/commands";
import {assertUnreachable} from "../../shared/utilities";

export type Props = {
  requests: ApiRequest[];
  dispatch: React.Dispatch<ApplicationEvent>;
};

function ApiExecutor({requests, dispatch}: Props) {
  React.useEffect(() => {
    requests.forEach(async (r) => {
      switch (r.type) {
        case ApiRequestTag.GetSearches: {
          const results = await getSearches();
          dispatch(EventFromServer(SearchesResult(results)));
          break;
        }

        case ApiRequestTag.GetUsers: {
          const results = await getUsers();
          dispatch(EventFromServer(UsersResult(results)));
          break;
        }

        default:
          assertUnreachable(r);
      }
    });
  }, [requests, dispatch]);

  return <></>;
}

export default ApiExecutor;

async function getSearches(): Promise<SearchCommand[]> {
  const result = await fetch("/searches", {mode: "cors"});
  const json = await result.json();
  const validationResult = svt.validateArray(validateSearchCommand)(json);

  if (validationResult.type === "Valid") {
    return validationResult.value;
  } else {
    throw new Error(`Unable to validate searches: ${JSON.stringify(validationResult.errors)}`);
  }
}

async function getUsers(): Promise<BotUser[]> {
  const result = await fetch("/users");
  const json = await result.json();
  const validationResult = svt.validateArray(validateBotUser)(json);

  if (validationResult.type === "Valid") {
    return validationResult.value;
  } else {
    throw new Error(`Unable to validate searches: ${JSON.stringify(validationResult.errors)}`);
  }
}
