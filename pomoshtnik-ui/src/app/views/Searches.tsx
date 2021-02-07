import * as React from "react";
import {SearchCommand, SearchCommandTag, SearchResultTag} from "../../shared/gotyno/commands";
import {assertUnreachable} from "../../shared/utilities";
import {GitHub as GitHubIcon, Movie, Person, Tv} from "@material-ui/icons";
import {
  EventFromClient,
  ExecuteApiRequest,
  GetSearches,
  GetSearchesFilter,
  GetSearchesFilterTag,
  SearchesByResultLike,
  ApplicationEvent,
  SetGetSearchesFilter,
} from "../../shared/gotyno/api";

export type Props = {
  searches: SearchCommand[];
  dispatch: React.Dispatch<ApplicationEvent>;
  filter: GetSearchesFilter;
};

function Searches({searches, dispatch, filter}: Props) {
  React.useEffect(() => {
    dispatch(EventFromClient(ExecuteApiRequest(GetSearches(filter))));
  }, [dispatch, filter]);

  const searchResults = searches.map((s) => {
    const color = s.data.type === SearchResultTag.SearchSuccess ? "primary" : "error";

    switch (s.type) {
      case SearchCommandTag.GitHubUserSearch: {
        const content =
          s.data.type === SearchResultTag.SearchSuccess ? (
            <>{s.data.data.login}</>
          ) : (
            <span>fail lol</span>
          );
        const icon = <GitHubIcon color={color} />;

        return (
          <span>
            <>
              {icon}
              {content}
            </>
          </span>
        );
      }

      case SearchCommandTag.GitHubRepositorySearch: {
        const content =
          s.data.type === SearchResultTag.SearchSuccess ? (
            <>{s.data.data.full_name}</>
          ) : (
            <span>fail lol</span>
          );
        const icon = <GitHubIcon color={color} />;

        return (
          <span>
            <>
              {icon}
              {content}
            </>
          </span>
        );
      }

      case SearchCommandTag.MovieSearch: {
        const content =
          s.data.type === SearchResultTag.SearchSuccess ? (
            <>{s.data.data.title}</>
          ) : (
            <span>fail lol</span>
          );
        const icon = <Movie color={color} />;

        return (
          <span>
            <>
              {icon}
              {content}
            </>
          </span>
        );
      }

      case SearchCommandTag.ShowSearch: {
        const content =
          s.data.type === SearchResultTag.SearchSuccess ? (
            <>{s.data.data.name}</>
          ) : (
            <span>fail lol</span>
          );
        const icon = <Tv color={color} />;

        return (
          <span>
            <>
              {icon}
              {content}
            </>
          </span>
        );
      }

      case SearchCommandTag.PersonSearch: {
        const content =
          s.data.type === SearchResultTag.SearchSuccess ? (
            <>{s.data.data.name}</>
          ) : (
            <span>fail lol</span>
          );
        const icon = <Person color={color} />;

        return (
          <span>
            <>
              {icon}
              {content}
            </>
          </span>
        );
      }

      default:
        return assertUnreachable(s);
    }
  });

  const handleSearchFilterChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(EventFromClient(SetGetSearchesFilter(SearchesByResultLike(e.target.value))));
  };

  return (
    <>
      <h1>Searches</h1>
      <input type="text" value={searchFilterAsText(filter)} onChange={handleSearchFilterChange} />
      <ul>
        {searchResults.map((r, index) => (
          <li key={index}>{r}</li>
        ))}
      </ul>
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
