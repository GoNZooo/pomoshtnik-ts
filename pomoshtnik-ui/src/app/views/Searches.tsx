import * as React from "react";
import {SearchCommand, SearchCommandTag, SearchResultTag} from "../../shared/gotyno/commands";
import {assertUnreachable, getSearchFailureText, hasMongoId} from "../../shared/utilities";
import {Delete, GitHub as GitHubIcon, Movie, Person, Tv} from "@material-ui/icons";
import {
  ApplicationEvent,
  DeleteSearch,
  EventFromClient,
  ExecuteWebSocketRequest,
  GetSearchesFilter,
  GetSearchesFilterTag,
  NoSearchesFilter,
  SearchesByResultLike,
  SetGetSearchesFilter,
} from "../../shared/gotyno/api";
import {List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";

export type Props = {
  searches: SearchCommand[];
  dispatch: React.Dispatch<ApplicationEvent>;
  filter: GetSearchesFilter;
};

function Searches({searches, dispatch, filter}: Props) {
  function getIconAndTextFromSearchCommand(command: SearchCommand): [JSX.Element, string] {
    const color = command.data.result.type === SearchResultTag.SearchSuccess ? "primary" : "error";

    switch (command.type) {
      case SearchCommandTag.GitHubUserSearch: {
        const content =
          command.data.result.type === SearchResultTag.SearchSuccess
            ? command.data.result.data.login
            : getSearchFailureText(command.data.result.data);
        const icon = <GitHubIcon color={color} />;

        return [icon, content];
      }

      case SearchCommandTag.GitHubRepositorySearch: {
        const content =
          command.data.result.type === SearchResultTag.SearchSuccess
            ? command.data.result.data.full_name
            : getSearchFailureText(command.data.result.data);
        const icon = <GitHubIcon color={color} />;

        return [icon, content];
      }

      case SearchCommandTag.MovieSearch: {
        const content =
          command.data.result.type === SearchResultTag.SearchSuccess
            ? command.data.result.data.title ?? "Title not available"
            : getSearchFailureText(command.data.result.data);
        const icon = <Movie color={color} />;

        return [icon, content];
      }

      case SearchCommandTag.ShowSearch: {
        const content =
          command.data.result.type === SearchResultTag.SearchSuccess
            ? command.data.result.data.name
            : getSearchFailureText(command.data.result.data);
        const icon = <Tv color={color} />;

        return [icon, content];
      }

      case SearchCommandTag.PersonSearch: {
        const content =
          command.data.result.type === SearchResultTag.SearchSuccess
            ? command.data.result.data.name
            : getSearchFailureText(command.data.result.data);
        const icon = <Person color={color} />;

        return [icon, content];
      }

      default:
        return assertUnreachable(command);
    }
  }

  const searchResults = searches.map((s) => {
    function handleDeleteSearch({_id}: {_id: string}): (e: React.MouseEvent) => void {
      return function () {
        dispatch(EventFromClient(ExecuteWebSocketRequest(DeleteSearch(_id))));
      };
    }

    const [icon, text] = getIconAndTextFromSearchCommand(s);
    const removeListItemIcon = hasMongoId<SearchCommand>(s) ? (
      <ListItemIcon onClick={handleDeleteSearch(s)}>
        <Delete color="error" />
      </ListItemIcon>
    ) : null;

    return (
      <>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{text}</ListItemText>
        {removeListItemIcon}
      </>
    );
  });

  const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const filterToSet =
      e.target.value === "" ? NoSearchesFilter() : SearchesByResultLike(e.target.value);
    dispatch(EventFromClient(SetGetSearchesFilter(filterToSet)));
  };

  return (
    <>
      <h1>Searches</h1>
      <input type="text" value={searchFilterAsText(filter)} onChange={handleSearchFilterChange} />
      <List>
        {searchResults.map((r, index) => (
          <ListItem dense button key={index}>
            {r}
          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Searches;

function searchFilterAsText(filter: GetSearchesFilter): string {
  switch (filter.type) {
    case GetSearchesFilterTag.NoSearchesFilter: {
      return "";
    }

    case GetSearchesFilterTag.SearchesByResultLike: {
      return filter.data;
    }

    case GetSearchesFilterTag.SearchesByQueryLike: {
      return filter.data;
    }

    default:
      return assertUnreachable(filter);
  }
}
