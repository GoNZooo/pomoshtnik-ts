import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as tmdb from "./tmdb";
import * as commands from "./commands";
import {assertUnreachable} from "./utilities";
import * as isbndb from "./isbndb";
import express from "express";
import {
  Command,
  CommandTag,
  GitHubRepository,
  GitHubRepositorySearch,
  GitHubUser,
  GitHubUserSearch,
  ISBN,
  Left,
  Movie,
  MovieSearch,
  Person,
  PersonSearch,
  Right,
  SearchCommand,
  SearchCommandTag,
  Show,
  ShowSearch,
} from "./gotyno/commands";
import {validatePush, WebhookEvent, WebhookEventTag} from "./gotyno/github";
import {getRepository, getUser} from "./github";

const DEFAULT_APPLICATION_PORT = 3000;

dotenv.config();

const searches: SearchCommand[] = [];

const discordApiKey = process.env.DISCORD_API_KEY ?? "NOVALUE";
if (discordApiKey === "NOVALUE") throw new Error("No Discord API key specified.");

const tmdbApiKey = process.env.TMDB_API_KEY ?? "NOVALUE";
if (tmdbApiKey === "NOVALUE") throw new Error("No TMDB API key specified.");

const isbndbApiKey = process.env.ISBNDB_KEY ?? "NOVALUE";
if (isbndbApiKey === "NOVALUE") throw new Error("No ISBDNDB API key specified.");

const githubWebhookSecret = process.env.GITHUB_WEBHOOK_SECRET ?? "NOVALUE";
if (githubWebhookSecret === "NOVALUE") throw new Error("No GitHub webhook secret specified.");

const githubWebhookId = process.env.GITHUB_WEBHOOK_ID ?? "NOVALUE";
if (githubWebhookId === "NOVALUE") throw new Error("No GitHub webhook ID specified.");

const githubWebhookToken = process.env.GITHUB_WEBHOOK_TOKEN ?? "NOVALUE";
if (githubWebhookToken === "NOVALUE") throw new Error("No GitHub webhook token specified.");

const applicationPort = Number(process.env.PORT ?? DEFAULT_APPLICATION_PORT);

const application = express();

const discordClient = new Discord.Client();

const discordWebhook = new Discord.WebhookClient(githubWebhookId, githubWebhookToken);

application.use(express.json());

application.post("/github-webhook", async (request, response) => {
  const requestData = {
    type: request.header("x-github-event") ?? "UnknownEvent",
    data: request.body,
  };
  const decodedEvent = validatePush(requestData);

  if (decodedEvent.type === "Valid") {
    await handleGitHubWebhookEvent(decodedEvent.value, discordWebhook);
  } else {
    console.error("Unable to decode event:", decodedEvent.errors);
  }

  response.sendStatus(OK_STATUS);
});

application.listen(applicationPort);

let tmdbImageBaseUrl: string;

discordClient.on("ready", async () => {
  const configurationResponse = await tmdb.getConfiguration(tmdbApiKey);

  if (configurationResponse.type === "Invalid") {
    console.error("Error fetching configuration:", configurationResponse.errors);
  } else {
    tmdbImageBaseUrl = `${configurationResponse.value.images.secure_base_url}`;
  }

  console.log(`Logged in as: ${discordClient.user?.tag ?? "N/A"}!`);
});

async function handleGitHubUserCommand(
  command: GitHubUser,
  message: Discord.Message
): Promise<void> {
  const userResult = await getUser(command.data);

  if (userResult.type === "Valid") {
    const user = userResult.value;
    searches.push(GitHubUserSearch(Right(userResult.value)));

    const embed = new Discord.MessageEmbed({
      title: user.login,
      url: user.html_url,
      image: {url: user.avatar_url},
      footer: {},
    });

    embed.addField("Bio", user.bio);
    if (user.location !== null && user.location !== undefined) {
      embed.addField("Location", user.location);
    }
    embed.addField("Public repositories", user.public_repos);
    embed.addField("Followers", user.followers);
    embed.addField("Following", user.following);
    embed.addField("Created", user.created_at);
    embed.addField("Updated", user.updated_at);
    if (user.blog !== null) {
      embed.addField("Website", user.blog);
    }

    await message.reply(embed);
  } else {
    searches.push(GitHubUserSearch(Left(command.data)));
    console.error("Error fetching user:", userResult.errors);
  }
}

async function handleGitHubRepositoryCommand(
  command: GitHubRepository,
  message: Discord.Message
): Promise<void> {
  const repositoryResult = await getRepository(command.data);

  if (repositoryResult.type === "Valid") {
    const repository = repositoryResult.value;
    searches.push(GitHubRepositorySearch(Right(repository)));

    const embed = new Discord.MessageEmbed({
      title: repository.full_name,
      url: repository.html_url,
      footer: {},
    });

    embed.addField("Description", repository.description);
    embed.addField("Creator", repository.owner.login);
    embed.addField("Language", repository.language);

    await message.reply(embed);
  } else {
    searches.push(GitHubRepositorySearch(Left(command.data)));
    console.error("Error fetching repository:", repositoryResult.errors);
  }
}

const handleCommand = async (command: Command, message: Discord.Message): Promise<void> => {
  switch (command.type) {
    case CommandTag.Ping: {
      await message.reply("Pong!");

      return;
    }

    case CommandTag.WhoAreYou: {
      const embed = new Discord.MessageEmbed({
        image: {
          url: "https://cms.qz.com/wp-content/uploads/2015/11/rtxm3g2.jpg",
        },
      });

      await message.reply("I am Pomoshtnik, the helper bot!", embed);

      return;
    }

    case CommandTag.Searches: {
      const embed = new Discord.MessageEmbed();
      const joinedSearches = searches
        .map((searchCommand) => {
          switch (searchCommand.type) {
            case SearchCommandTag.GitHubUserSearch: {
              if (searchCommand.data.type === "Right") {
                const user = searchCommand.data.data;

                return `GitHub user found: ${user.login} (${user.url}, ${user.bio})`;
              } else {
                return `GitHub user not found for search: ${searchCommand.data.data}`;
              }
            }

            case SearchCommandTag.GitHubRepositorySearch: {
              if (searchCommand.data.type === "Right") {
                const repository = searchCommand.data.data;

                return `GitHub repository found: ${repository.url} (${repository.html_url})`;
              } else {
                return `GitHub repository not found for search: ${searchCommand.data.data}`;
              }
            }

            case SearchCommandTag.PersonSearch: {
              if (searchCommand.data.type === "Right") {
                const person = searchCommand.data.data;

                return `Person found: ${person.name} (https://imdb.com/name/${person.imdb_id})`;
              } else {
                return `Person not found for search: ${searchCommand.data.data}`;
              }
            }

            case SearchCommandTag.MovieSearch: {
              if (searchCommand.data.type === "Right") {
                const movie = searchCommand.data.data;

                return `Movie found: ${movie.title} (https://imdb.com/title/${movie.id})`;
              } else {
                return `Movie not found for search: ${searchCommand.data.data}`;
              }
            }

            case SearchCommandTag.ShowSearch: {
              if (searchCommand.data.type === "Right") {
                const show = searchCommand.data.data;

                return `Show found: ${show.name} (https://imdb.com/title/${show.id})`;
              } else {
                return `Show not found for search: ${searchCommand.data.data}`;
              }
            }

            default:
              assertUnreachable(searchCommand);
          }
        })
        .join("\n\n");

      embed.addField("Searches", joinedSearches);

      await message.reply("Searches", embed);

      return;
    }

    case CommandTag.Person: {
      await handlePersonCommand(command, message);

      return;
    }

    case CommandTag.Movie: {
      await handleMovieCommand(command, message);

      return;
    }

    case CommandTag.Show: {
      await handleShowCommand(command, message);

      return;
    }

    case CommandTag.ISBN: {
      await handleISBNCommand(command, message);

      return;
    }

    case CommandTag.GitHubUser: {
      await handleGitHubUserCommand(command, message);

      return;
    }

    case CommandTag.GitHubRepository: {
      await handleGitHubRepositoryCommand(command, message);

      return;
    }

    default:
      assertUnreachable(command);
  }
};

discordClient.on("message", async (message) => {
  if (!message.author.bot) {
    const decodedCommand = commands.commandFromStrings(message.content.split(" "));

    switch (decodedCommand.type) {
      case "Valid": {
        await handleCommand(decodedCommand.value, message);

        break;
      }

      case "Invalid": {
        await message.reply("Unable to recognize command.");

        break;
      }

      default:
        assertUnreachable(decodedCommand);
    }
  }
});

discordClient
  .login(discordApiKey)
  .then((_token) => {})
  .catch((error) => {
    console.error("Unable to log in:", error);
  });

const handlePersonCommand = async (command: Person, message: Discord.Message): Promise<void> => {
  const maybePeople = await tmdb.searchPerson(tmdbApiKey, command.data);

  switch (maybePeople.type) {
    case "Valid": {
      if (maybePeople.value.length > 0) {
        const personCandidate = maybePeople.value[0];
        const maybePerson = await tmdb.getPerson(tmdbApiKey, personCandidate.id);
        switch (maybePerson.type) {
          case "Valid": {
            const person = maybePerson.value;
            searches.push(PersonSearch(Right(person)));
            const posterUrl =
              personCandidate.profile_path !== null
                ? `${tmdbImageBaseUrl}${tmdb.preferredProfileSize}${personCandidate.profile_path}`
                : "";

            const embed = new Discord.MessageEmbed({
              title: personCandidate.name,
              url: `https://imdb.com/name/${person.imdb_id}`,
              image: {url: posterUrl},
              footer: {
                text: `Known for: ${personCandidate.known_for_department}    Popularity: ${personCandidate.popularity}`,
              },
            });

            personCandidate.known_for.forEach((media) => {
              const title =
                media.media_type === "movie" ? media.title ?? "N/A" : media.name ?? "N/A";

              const releaseDate =
                media.media_type === "movie"
                  ? media.release_date ?? "N/A"
                  : media.first_air_date ?? "N/A";

              embed.addField(`${releaseDate}: ${title} (${media.vote_average})`, media.overview);
            });

            await message.reply(embed);

            break;
          }

          case "Invalid": {
            break;
          }

          default:
            assertUnreachable(maybePerson);
        }
      } else {
        searches.push(PersonSearch(Left(command.data)));
        await message.reply(`No results returned for '${command.data}'.`);
      }

      break;
    }

    case "Invalid": {
      console.error("error:", JSON.stringify(maybePeople.errors, null, JSON_STRINGIFY_SPACING));

      break;
    }

    default:
      assertUnreachable(maybePeople);
  }
};

export const handleMovieCommand = async (
  command: Movie,
  message: Discord.Message
): Promise<void> => {
  const maybeMovies = await tmdb.searchMovie(tmdbApiKey, command.data);

  switch (maybeMovies.type) {
    case "Valid": {
      if (maybeMovies.value.length > 0) {
        const movieCandidate = maybeMovies.value[0];

        const posterUrl =
          movieCandidate.poster_path !== null
            ? `${tmdbImageBaseUrl}${tmdb.preferredProfileSize}${movieCandidate.poster_path}`
            : "";

        const maybeMovie = await tmdb.getMovie(tmdbApiKey, movieCandidate.id);

        switch (maybeMovie.type) {
          case "Valid": {
            const movie = maybeMovie.value;
            searches.push(MovieSearch(Right(movie)));

            const embed = new Discord.MessageEmbed({
              url: `https://imdb.com/title/${movie.imdb_id}`,
              title: `${movie.title} (${movie.vote_average}, ${movie.release_date})`,
              image: {url: posterUrl},
            });

            const castEntries = movie.credits.cast
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry) => `**${castEntry.name}** as ${castEntry.character}`);

            embed.addField("Description", movie.overview);
            embed.addField("Cast", castEntries.join("\n"));
            await message.reply(embed);

            break;
          }

          case "Invalid": {
            console.error(maybeMovie.errors);

            break;
          }

          default:
            assertUnreachable(maybeMovie);
        }
      } else {
        searches.push(MovieSearch(Left(command.data)));
        await message.reply(`No results returned for '${command.data}'.`);
      }

      break;
    }

    case "Invalid": {
      console.error("error:", maybeMovies.errors);

      break;
    }

    default:
      assertUnreachable(maybeMovies);
  }
};

export const handleShowCommand = async (command: Show, message: Discord.Message): Promise<void> => {
  const maybeShows = await tmdb.searchShow(tmdbApiKey, command.data);

  switch (maybeShows.type) {
    case "Valid": {
      if (maybeShows.value.length > 0) {
        const showCandidate = maybeShows.value[0];

        const posterUrl =
          showCandidate.poster_path !== null
            ? `${tmdbImageBaseUrl}${tmdb.preferredProfileSize}${showCandidate.poster_path}`
            : "";

        const maybeShow = await tmdb.getShow(tmdbApiKey, showCandidate.id);

        switch (maybeShow.type) {
          case "Valid": {
            const show = maybeShow.value;
            searches.push(ShowSearch(Right(show)));

            const lastEpisode = show.last_episode_to_air;

            const padding = 2;
            const lastEpisodeDescription =
              lastEpisode !== null
                ? [
                    `**${lastEpisode?.name}** (S${lastEpisode?.season_number
                      .toFixed(0)
                      .padStart(padding, "0")}E${lastEpisode?.episode_number
                      .toFixed(0)
                      .padStart(padding, "0")}) aired on **${lastEpisode?.air_date ?? "N/A"}**`,
                    `${lastEpisode?.overview ?? "N/A"}`,
                  ].join("\n")
                : "N/A";

            const url =
              show.external_ids.imdb_id !== null
                ? `https://imdb.com/title/${show.external_ids.imdb_id}`
                : undefined;

            const embed = new Discord.MessageEmbed({
              url,
              title: `${show.name} (${show.vote_average}, ${show.first_air_date})`,
              image: {url: posterUrl},
            });

            embed.addField("Description", show.overview);
            embed.addField("Last Episode", lastEpisodeDescription);

            const castEntries = show.credits.cast
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry) => `**${castEntry.name}** as ${castEntry.character}`);

            embed.addField("Cast", castEntries.join("\n"));
            await message.reply(embed);

            break;
          }

          case "Invalid": {
            console.error(`Unable to get credits: ${maybeShow.errors}`);

            break;
          }

          default:
            assertUnreachable(maybeShow);
        }

        break;
      } else {
        searches.push(ShowSearch(Left(command.data)));
        await message.reply(`No results returned for '${command.data}'.`);
      }
      break;
    }

    case "Invalid": {
      console.error("error:", maybeShows.errors);

      break;
    }

    default:
      assertUnreachable(maybeShows);
  }
};

export const handleISBNCommand = async (command: ISBN, message: Discord.Message): Promise<void> => {
  const maybeBook = await isbndb.getBookByISBN(isbndbApiKey, command.data);

  switch (maybeBook.type) {
    case "Valid": {
      const book = maybeBook.value;

      const embed = new Discord.MessageEmbed({
        title: book.title,
        image: {url: book.image ?? ""},
      });

      embed.addField("Overview", book.overview ?? "N/A");
      embed.addField("Published", book.publish_date);
      embed.addField("Authors", book.authors.join(", "));
      embed.addField("Pages", book.pages);
      embed.addField("Publisher", book.publisher);
      embed.addField("ISBN", `${book.isbn} & ${book.isbn13}`);

      await message.reply(embed);

      break;
    }

    case "Invalid": {
      console.error("error:", maybeBook.errors);

      break;
    }

    default:
      assertUnreachable(maybeBook);
  }
};

const handleGitHubWebhookEvent = async (
  event: WebhookEvent,
  hook: Discord.WebhookClient
): Promise<void> => {
  switch (event.type) {
    case WebhookEventTag.push: {
      const commitLines = event.data.commits
        .reverse()
        .slice(0, MAX_COMMITS_DESCRIPTION)
        .map((c) => `[${c.id}](${c.url})\n**${truncateCommitMessage(c.message)}**`)
        .join("\n---\n");
      const nameIndex = 2;
      const refName = event.data.ref.split("/")[nameIndex];
      const description = `${event.data.sender.login} pushed to a repository: [${event.data.repository.name}/${refName}](${event.data.head_commit.url})`;
      const content = [description, commitLines].join("\n");

      await hook.send(content);

      break;
    }

    default:
      assertUnreachable(event.type);
  }
};

const truncateCommitMessage = (message: string): string => {
  return truncateString(message.split("\n")[0], MAX_COMMIT_MESSAGE_LENGTH);
};

const truncateString = (stringToTruncate: string, length: number): string => {
  const removeLength = 3;

  return stringToTruncate.length >= length
    ? stringToTruncate.substring(0, length - removeLength) + "..."
    : stringToTruncate;
};

const MAX_EMBED_CAST_ENTRIES = 20;

const MAX_COMMITS_DESCRIPTION = 8;

const MAX_COMMIT_MESSAGE_LENGTH = 60;

const OK_STATUS = 200;

const JSON_STRINGIFY_SPACING = 2;
