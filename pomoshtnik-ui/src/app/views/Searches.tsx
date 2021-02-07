import * as React from "react";
import {SearchCommand, SearchCommandTag, SearchResultTag} from "../../shared/gotyno/commands";
import {assertUnreachable} from "../../shared/utilities";
import {GitHub as GitHubIcon, Movie, Person, Tv} from "@material-ui/icons";
import {ApplicationEvent} from "../../../../pomoshtnik-shared/gotyno/api";
import {EventFromClient, ExecuteApiRequest, GetSearches} from "../../shared/gotyno/api";

export type Props = {
  searches: SearchCommand[];
  dispatch: React.Dispatch<ApplicationEvent>;
};

function Searches({searches, dispatch}: Props) {
  React.useEffect(() => {
    dispatch(EventFromClient(ExecuteApiRequest(GetSearches())));
  }, [dispatch]);

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

  return (
    <>
      <h1>Searches</h1>
      <ul>
        {searchResults.map((r, index) => (
          <li key={index}>{r}</li>
        ))}
      </ul>
    </>
  );
}

export default Searches;
