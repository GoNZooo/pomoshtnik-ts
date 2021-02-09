import {v4 as uuidv4} from "uuid";
import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as tmdb from "./tmdb";
import * as commands from "./commands";
import {assertUnreachable, getSearchFailureText} from "../pomoshtnik-shared/utilities";
import express from "express";
import {createServer} from "http";
import io from "socket.io";
import cors from "cors";
import {
  BotUser,
  Command,
  CommandTag,
  DiscordError,
  GitHubRepository,
  GitHubRepositorySearch,
  GitHubUser,
  GitHubUserSearch,
  Movie,
  MovieSearch,
  NoResults,
  Person,
  PersonSearch,
  RepositorySearchTypeTag,
  SearchCommand,
  SearchCommandTag,
  SearchEntry,
  SearchFailure,
  SearchResultTag,
  SearchSuccess,
  Show,
  ShowSearch,
  ValidationError,
} from "../pomoshtnik-shared/gotyno/commands";
import {getRepository, getUser, searchRepositoriesByTopic} from "./github";
import {CastEntry} from "../pomoshtnik-shared/gotyno/tmdb";
import {Db, MongoClient} from "mongodb";
import {Reply, replyTo} from "./discord";
import {
  addSearchCommandResult,
  addUserIfUnique,
  connectToDatabase,
  deleteSearchByMongoId,
  getSearches,
  getSearchesByResultLike,
  getUsers,
} from "./database";
import {GetSearchesFilterTag, validateGetSearchesFilter} from "../pomoshtnik-shared/gotyno/api";

const DEFAULT_APPLICATION_PORT = 2999;

dotenv.config();

const discordApiKey = process.env.DISCORD_API_KEY ?? "NOVALUE";
if (discordApiKey === "NOVALUE") throw new Error("No Discord API key specified.");

const tmdbApiKey = process.env.TMDB_API_KEY ?? "NOVALUE";
if (tmdbApiKey === "NOVALUE") throw new Error("No TMDB API key specified.");

const mongoUri = process.env.MONGO_URI ?? "NOVALUE";
if (mongoUri === "NOVALUE") throw new Error("No MongoDB URI specified.");

const applicationPort = Number(process.env.PORT ?? DEFAULT_APPLICATION_PORT);

const application = express();
application.use(express.json());
application.use(cors());

application.get("/api/searches", async function (request, response) {
  const searches = await getSearches(mongoDatabase);

  response.json(searches);
});

application.post("/api/searches", async function (request, response) {
  const maybeFilter = validateGetSearchesFilter(request.body);
  if (maybeFilter.type === "Valid") {
    const filter = maybeFilter.value;
    switch (filter.type) {
      case GetSearchesFilterTag.SearchesByResultLike: {
        const searches = await getSearchesByResultLike(mongoDatabase, filter.data);
        response.json(searches);

        return;
      }

      case GetSearchesFilterTag.SearchesByQueryLike: {
        const searches: SearchCommand[] = [];
        response.json(searches);

        return;
      }

      case GetSearchesFilterTag.NoSearchesFilter: {
        const searches = await getSearches(mongoDatabase);
        response.json(searches);

        return;
      }

      default:
        return assertUnreachable(filter);
    }
  }
});

application.delete("/api/searches/:mongoId", async function (request, response) {
  const mongoId = request.params.mongoId;
  const result = await deleteSearchByMongoId(mongoDatabase, mongoId);
  if (result) {
    console.log("Deleted: ", mongoId);
  }
  response.json(result);
});

application.get("/api/users", async function (request, response) {
  const users = await getUsers(mongoDatabase, {});

  response.json(users);
});

const server = createServer(application);
const socketServer = new io.Server(server);
socketServer.on("connection", (socket) => {
  console.log("Someone connected:", socket.id);
  socket.on("initializeFromReact", () => {
    console.log("FUCK!");
  });
  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
});
server.listen(applicationPort);

const discordClient = new Discord.Client();

let mongoClient: MongoClient;
let mongoDatabase: Db;
(async () => {
  mongoClient = await MongoClient.connect(mongoUri);
  mongoDatabase = await connectToDatabase(mongoClient);
})();

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
  botUser: BotUser,
  uuid: string,
  message: Discord.Message
): Promise<void> {
  const userResult = await getUser(command.data);

  if (userResult.type === "Valid") {
    const user = userResult.value;

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

    await replyOrAddDiscordApiFailure(
      mongoDatabase,
      message,
      {embed},
      GitHubUserSearch,
      botUser,
      uuid
    );
    await addSearchCommandResult(
      mongoDatabase,
      GitHubUserSearch({user: botUser, uuid, result: SearchSuccess(userResult.value)})
    );
  } else {
    const error = SearchFailure(
      ValidationError({
        commandText: message.content,
        reason: JSON.stringify(userResult.errors, null, JSON_STRINGIFY_SPACING),
      })
    );
    await addSearchCommandResult(
      mongoDatabase,
      GitHubUserSearch({user: botUser, uuid, result: error})
    );
    console.error("Error fetching user:", userResult.errors);
  }
}

async function handleGitHubRepositoryCommand(
  command: GitHubRepository,
  botUser: BotUser,
  uuid: string,
  message: Discord.Message
): Promise<void> {
  switch (command.data.type) {
    case RepositorySearchTypeTag.RepositoryByName: {
      const repositoryResult = await getRepository(command.data.data);

      if (repositoryResult.type === "Valid") {
        const repository = repositoryResult.value;
        await addSearchCommandResult(
          mongoDatabase,
          GitHubRepositorySearch({user: botUser, uuid, result: SearchSuccess(repository)})
        );

        const embed = new Discord.MessageEmbed({
          title: repository.full_name,
          url: repository.html_url,
          footer: {},
        });

        embed.addField("Description", repository.description);
        embed.addField("Creator", repository.owner.login);
        embed.addField("Language", repository.language);

        await replyOrAddDiscordApiFailure(
          mongoDatabase,
          message,
          {embed},
          GitHubRepositorySearch,
          botUser,
          uuid
        );

        return;
      } else {
        const error = SearchFailure(
          ValidationError({
            commandText: message.content,
            reason: JSON.stringify(repositoryResult.errors, null, JSON_STRINGIFY_SPACING),
          })
        );
        await addSearchCommandResult(
          mongoDatabase,
          GitHubRepositorySearch({user: botUser, uuid, result: error})
        );
        console.error(
          "Error fetching repository:",
          JSON.stringify(repositoryResult.errors, null, JSON_STRINGIFY_SPACING)
        );

        return;
      }
    }

    case RepositorySearchTypeTag.RepositoryByTopics: {
      const repositoryResults = await searchRepositoriesByTopic(command.data.data);

      if (repositoryResults.type === "Valid") {
        const repositories = repositoryResults.value.items;

        const lines = repositories.map((r) => `[${r.full_name}](${r.html_url})`);
        const reply = lines.join("\n");
        const embed = new Discord.MessageEmbed({description: reply});

        await replyOrAddDiscordApiFailure(
          mongoDatabase,
          message,
          {embed},
          GitHubRepositorySearch,
          botUser,
          uuid
        );

        return;
      } else {
        console.error(
          "Error fetching repository:",
          JSON.stringify(repositoryResults.errors, null, JSON_STRINGIFY_SPACING)
        );

        return;
      }
    }

    default:
      assertUnreachable(command.data);
  }
}

const handleCommand = async (command: Command, message: Discord.Message): Promise<void> => {
  const lastSeen = new Date().toISOString();
  const nickname = message.author.username;
  const lastCommand = command;
  const uuid = uuidv4();
  const botUser = {lastSeen, lastCommand, nickname, uuid};
  await addUserIfUnique(mongoDatabase, botUser);
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
      await handleSearchesCommand(command, message);

      return;
    }

    case CommandTag.Person: {
      await handlePersonCommand(command, botUser, uuid, message);

      return;
    }

    case CommandTag.Movie: {
      await handleMovieCommand(command, botUser, uuid, message);

      return;
    }

    case CommandTag.Show: {
      await handleShowCommand(command, botUser, uuid, message);

      return;
    }

    case CommandTag.GitHubUser: {
      await handleGitHubUserCommand(command, botUser, uuid, message);

      return;
    }

    case CommandTag.GitHubRepository: {
      await handleGitHubRepositoryCommand(command, botUser, uuid, message);

      return;
    }

    case CommandTag.Users: {
      await handleUsersCommand(command, message);

      return;
    }

    default:
      assertUnreachable(command);
  }
};

async function handleUsersCommand(_command: Command, message: Discord.Message): Promise<void> {
  const users = await getUsers(mongoDatabase, {limit: 20, sort: ["lastSeen", "descending"]});
  const joinedUsers = users
    .map((u) => `${u.nickname} (${u.lastCommand.type}) @ ${u.lastSeen}`)
    .join("\n");

  await message.reply(joinedUsers);
}

async function handleSearchesCommand(command: Command, message: Discord.Message): Promise<void> {
  const embed = new Discord.MessageEmbed();
  const searches = await getSearches(mongoDatabase, 10);
  if (searches.length === 0) {
    embed.description = "No searches executed yet.";
  } else {
    const joinedSearches = searches
      .map((searchCommand) => {
        switch (searchCommand.type) {
          case SearchCommandTag.GitHubUserSearch: {
            if (searchCommand.data.result.type === SearchResultTag.SearchSuccess) {
              const user = searchCommand.data.result.data;

              return `GitHub user found: ${user.login} (${user.url}, ${user.bio})`;
            } else {
              return getSearchFailureText(searchCommand.data.result.data);
            }
          }

          case SearchCommandTag.GitHubRepositorySearch: {
            if (searchCommand.data.result.type === SearchResultTag.SearchSuccess) {
              const repository = searchCommand.data.result.data;

              return `GitHub repository found: ${repository.url} (${repository.html_url})`;
            } else {
              return getSearchFailureText(searchCommand.data.result.data);
            }
          }

          case SearchCommandTag.PersonSearch: {
            if (searchCommand.data.result.type === SearchResultTag.SearchSuccess) {
              const person = searchCommand.data.result.data;

              return `Person found: ${person.name} (https://imdb.com/name/${person.imdb_id})`;
            } else {
              return getSearchFailureText(searchCommand.data.result.data);
            }
          }

          case SearchCommandTag.MovieSearch: {
            if (searchCommand.data.result.type === SearchResultTag.SearchSuccess) {
              const movie = searchCommand.data.result.data;

              return `Movie found: ${movie.title} (https://imdb.com/title/${movie.id})`;
            } else {
              return getSearchFailureText(searchCommand.data.result.data);
            }
          }

          case SearchCommandTag.ShowSearch: {
            if (searchCommand.data.result.type === SearchResultTag.SearchSuccess) {
              const show = searchCommand.data.result.data;

              return `Show found: ${show.name} (https://imdb.com/title/${show.id})`;
            } else {
              return getSearchFailureText(searchCommand.data.result.data);
            }
          }

          default:
            assertUnreachable(searchCommand);
        }
      })
      .join("\n\n");

    embed.addField("Searches", joinedSearches);
  }

  await message.reply("Searches", embed);
}

discordClient.on("message", async (message) => {
  if (message.content.startsWith("!") && !message.author.bot) {
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

const handlePersonCommand = async (
  command: Person,
  botUser: BotUser,
  uuid: string,
  message: Discord.Message
): Promise<void> => {
  const maybePeople = await tmdb.searchPerson(tmdbApiKey, command.data);

  switch (maybePeople.type) {
    case "Valid": {
      if (maybePeople.value.length > 0) {
        const personCandidate = maybePeople.value[0];
        const maybePerson = await tmdb.getPerson(tmdbApiKey, personCandidate.id);
        switch (maybePerson.type) {
          case "Valid": {
            const person = maybePerson.value;
            await addSearchCommandResult(
              mongoDatabase,
              PersonSearch({user: botUser, uuid, result: SearchSuccess(person)})
            );
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

            await replyOrAddDiscordApiFailure(
              mongoDatabase,
              message,
              {embed},
              PersonSearch,
              botUser,
              uuid
            );

            break;
          }

          case "Invalid": {
            break;
          }

          default:
            assertUnreachable(maybePerson);
        }
      } else {
        const error = SearchFailure(NoResults(message.content));
        await addSearchCommandResult(
          mongoDatabase,
          PersonSearch({user: botUser, uuid, result: error})
        );

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
  botUser: BotUser,
  uuid: string,
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
            await addSearchCommandResult(
              mongoDatabase,
              MovieSearch({user: botUser, uuid, result: SearchSuccess(movie)})
            );

            const embed = new Discord.MessageEmbed({
              url: `https://imdb.com/title/${movie.imdb_id}`,
              title: `${movie.title} (${movie.vote_average}, ${movie.release_date})`,
              image: {url: posterUrl},
            });

            const castEntries = (movie.credits.cast ?? [])
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry: CastEntry) => `**${castEntry.name}** as ${castEntry.character}`);

            embed.addField("Description", movie.overview);
            embed.addField("Cast", castEntries.join("\n"));
            await replyOrAddDiscordApiFailure(
              mongoDatabase,
              message,
              {embed},
              MovieSearch,
              botUser,
              uuid
            );

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
        const error = SearchFailure(NoResults(message.content));
        await addSearchCommandResult(
          mongoDatabase,
          MovieSearch({user: botUser, uuid, result: error})
        );

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

export const handleShowCommand = async (
  command: Show,
  botUser: BotUser,
  uuid: string,
  message: Discord.Message
): Promise<void> => {
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

            const castEntries = (show.credits.cast ?? [])
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry) => `**${castEntry.name}** as ${castEntry.character}`);
            const castContent = castEntries.length === 0 ? "N/A" : castEntries.join("\n");

            embed.addField("Cast", castContent);

            const seasonEntries = show.seasons.map(
              (s) => `${s.season_number}: ${s.episode_count} episodes (${s.air_date ?? "N/A"})`
            );

            embed.addField("Seasons", seasonEntries.join("\n"));

            await replyOrAddDiscordApiFailure(
              mongoDatabase,
              message,
              {embed},
              ShowSearch,
              botUser,
              uuid
            );
            await addSearchCommandResult(
              mongoDatabase,
              ShowSearch({user: botUser, uuid, result: SearchSuccess(show)})
            );

            break;
          }

          case "Invalid": {
            console.error(
              `Unable to get show: ${JSON.stringify(
                maybeShow.errors,
                null,
                JSON_STRINGIFY_SPACING
              )}`
            );

            break;
          }

          default:
            assertUnreachable(maybeShow);
        }

        break;
      } else {
        const error = SearchFailure(NoResults(message.content));
        await addSearchCommandResult(
          mongoDatabase,
          ShowSearch({user: botUser, uuid, result: error})
        );

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

async function replyOrAddDiscordApiFailure<T>(
  database: Db,
  message: Discord.Message,
  reply: Reply,
  constructor: (data: SearchEntry<T>) => SearchCommand,
  user: BotUser,
  uuid: string
): Promise<void> {
  const replyResult = await replyTo(message, reply);
  switch (replyResult.type) {
    case "ReplySuccess": {
      break;
    }

    case "ReplyFailure": {
      await addSearchCommandResult(
        mongoDatabase,
        constructor({
          user,
          uuid,
          result: SearchFailure(DiscordError({...replyResult.error, commandText: message.content})),
        })
      );

      break;
    }

    default:
      assertUnreachable(replyResult);
  }
}

const MAX_EMBED_CAST_ENTRIES = 20;

const JSON_STRINGIFY_SPACING = 2;
