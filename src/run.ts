import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as tmdb from "./tmdb";
import * as commands from "./commands";
import {assertUnreachable} from "./utilities";
import * as isbndb from "./isbndb";
import express from "express";
import {Command, CommandTag, ISBN, Movie, Person, Show} from "./gotyno/commands";
import {validatePush, WebhookEvent, WebhookEventTag} from "./gotyno/github";

const DEFAULT_APPLICATION_PORT = 3000;

dotenv.config();

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
        console.error("Unable to decode message:", decodedCommand.errors);

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
        await message.reply(`No results returned for '${command.data}'.`);
      }

      break;
    }

    case "Invalid": {
      console.error("error:", maybePeople.errors);

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
