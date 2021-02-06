import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as tmdb from "./tmdb";
import * as commands from "./commands";
import {assertUnreachable} from "./utilities";
import express from "express";
import {
  Command,
  CommandError,
  CommandErrorTag,
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
  SearchFailure,
  SearchResult,
  SearchResultTag,
  SearchSuccess,
  Show,
  ShowSearch,
  ValidationError,
} from "./gotyno/commands";
import {getRepository, getUser, searchRepositoriesByTopic} from "./github";
import {CastEntry} from "./gotyno/tmdb";
import {Db, MongoClient} from "mongodb";
import {Reply, replyTo} from "./discord";
import {
  addSearchCommandResult,
  addUserIfUnique,
  connectToDatabase,
  getSearches,
  getUsers,
} from "./database";

const DEFAULT_APPLICATION_PORT = 3000;

dotenv.config();

const discordApiKey = process.env.DISCORD_API_KEY ?? "NOVALUE";
if (discordApiKey === "NOVALUE") throw new Error("No Discord API key specified.");

const tmdbApiKey = process.env.TMDB_API_KEY ?? "NOVALUE";
if (tmdbApiKey === "NOVALUE") throw new Error("No TMDB API key specified.");

const mongoUri = process.env.MONGO_URI ?? "NOVALUE";
if (mongoUri === "NOVALUE") throw new Error("No MongoDB URI specified.");

const applicationPort = Number(process.env.PORT ?? DEFAULT_APPLICATION_PORT);

const application = express();

const discordClient = new Discord.Client();

let mongoClient: MongoClient;
let mongoDatabase: Db;
(async () => {
  mongoClient = await MongoClient.connect(mongoUri);
  mongoDatabase = await connectToDatabase(mongoClient);
})();

application.use(express.json());

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

    await replyOrAddDiscordApiFailure(mongoDatabase, message, {embed}, GitHubUserSearch);
    await addSearchCommandResult(mongoDatabase, GitHubUserSearch(SearchSuccess(userResult.value)));
  } else {
    const error = SearchFailure(
      ValidationError({
        commandText: message.content,
        reason: JSON.stringify(userResult.errors, null, JSON_STRINGIFY_SPACING),
      })
    );
    await addSearchCommandResult(mongoDatabase, GitHubUserSearch(error));
    console.error("Error fetching user:", userResult.errors);
  }
}

async function handleGitHubRepositoryCommand(
  command: GitHubRepository,
  message: Discord.Message
): Promise<void> {
  switch (command.data.type) {
    case RepositorySearchTypeTag.RepositoryByName: {
      const repositoryResult = await getRepository(command.data.data);

      if (repositoryResult.type === "Valid") {
        const repository = repositoryResult.value;
        await addSearchCommandResult(
          mongoDatabase,
          GitHubRepositorySearch(SearchSuccess(repository))
        );

        const embed = new Discord.MessageEmbed({
          title: repository.full_name,
          url: repository.html_url,
          footer: {},
        });

        embed.addField("Description", repository.description);
        embed.addField("Creator", repository.owner.login);
        embed.addField("Language", repository.language);

        await replyOrAddDiscordApiFailure(mongoDatabase, message, {embed}, GitHubRepositorySearch);

        return;
      } else {
        const error = SearchFailure(
          ValidationError({
            commandText: message.content,
            reason: JSON.stringify(repositoryResult.errors, null, JSON_STRINGIFY_SPACING),
          })
        );
        await addSearchCommandResult(mongoDatabase, GitHubRepositorySearch(error));
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

        await replyOrAddDiscordApiFailure(mongoDatabase, message, {embed}, GitHubRepositorySearch);

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
  await addUserIfUnique(mongoDatabase, message.author, command);
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

    case CommandTag.GitHubUser: {
      await handleGitHubUserCommand(command, message);

      return;
    }

    case CommandTag.GitHubRepository: {
      await handleGitHubRepositoryCommand(command, message);

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
  const users = await getUsers(mongoDatabase);
  const joinedUsers = users
    .map((u) => `${u.nickname} (${u.lastCommand.type}) @ ${u.lastSeen}`)
    .join("\n");

  await message.reply(joinedUsers);
}

async function handleSearchesCommand(command: Command, message: Discord.Message): Promise<void> {
  const embed = new Discord.MessageEmbed();
  const searches = await getSearches(mongoDatabase);
  if (searches.length === 0) {
    embed.description = "No searches executed yet.";
  } else {
    const joinedSearches = searches
      .map((searchCommand) => {
        switch (searchCommand.type) {
          case SearchCommandTag.GitHubUserSearch: {
            if (searchCommand.data.type === SearchResultTag.SearchSuccess) {
              const user = searchCommand.data.data;

              return `GitHub user found: ${user.login} (${user.url}, ${user.bio})`;
            } else {
              return getSearchFailureText(searchCommand.data.data);
            }
          }

          case SearchCommandTag.GitHubRepositorySearch: {
            if (searchCommand.data.type === SearchResultTag.SearchSuccess) {
              const repository = searchCommand.data.data;

              return `GitHub repository found: ${repository.url} (${repository.html_url})`;
            } else {
              return getSearchFailureText(searchCommand.data.data);
            }
          }

          case SearchCommandTag.PersonSearch: {
            if (searchCommand.data.type === SearchResultTag.SearchSuccess) {
              const person = searchCommand.data.data;

              return `Person found: ${person.name} (https://imdb.com/name/${person.imdb_id})`;
            } else {
              return getSearchFailureText(searchCommand.data.data);
            }
          }

          case SearchCommandTag.MovieSearch: {
            if (searchCommand.data.type === SearchResultTag.SearchSuccess) {
              const movie = searchCommand.data.data;

              return `Movie found: ${movie.title} (https://imdb.com/title/${movie.id})`;
            } else {
              return getSearchFailureText(searchCommand.data.data);
            }
          }

          case SearchCommandTag.ShowSearch: {
            if (searchCommand.data.type === SearchResultTag.SearchSuccess) {
              const show = searchCommand.data.data;

              return `Show found: ${show.name} (https://imdb.com/title/${show.id})`;
            } else {
              return getSearchFailureText(searchCommand.data.data);
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
            await addSearchCommandResult(mongoDatabase, PersonSearch(SearchSuccess(person)));
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

            await replyOrAddDiscordApiFailure(mongoDatabase, message, {embed}, PersonSearch);

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
        await addSearchCommandResult(mongoDatabase, PersonSearch(error));

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
            await addSearchCommandResult(mongoDatabase, MovieSearch(SearchSuccess(movie)));

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
            await replyOrAddDiscordApiFailure(mongoDatabase, message, {embed}, MovieSearch);

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
        await addSearchCommandResult(mongoDatabase, MovieSearch(error));

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

            const castEntries = (show.credits.cast ?? [])
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry) => `**${castEntry.name}** as ${castEntry.character}`);
            const castContent = castEntries.length === 0 ? "N/A" : castEntries.join("\n");

            embed.addField("Cast", castContent);

            const seasonEntries = show.seasons.map(
              (s) => `${s.season_number}: ${s.episode_count} episodes (${s.air_date ?? "N/A"})`
            );

            embed.addField("Seasons", seasonEntries.join("\n"));

            await replyOrAddDiscordApiFailure(mongoDatabase, message, {embed}, ShowSearch);
            await addSearchCommandResult(mongoDatabase, ShowSearch(SearchSuccess(show)));

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
        await addSearchCommandResult(mongoDatabase, ShowSearch(error));

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
  constructor: (data: SearchResult<T>) => SearchCommand
): Promise<void> {
  const replyResult = await replyTo(message, reply);
  switch (replyResult.type) {
    case "ReplySuccess": {
      break;
    }

    case "ReplyFailure": {
      await addSearchCommandResult(
        mongoDatabase,
        constructor(
          SearchFailure(DiscordError({...replyResult.error, commandText: message.content}))
        )
      );

      break;
    }

    default:
      assertUnreachable(replyResult);
  }
}

const MAX_EMBED_CAST_ENTRIES = 20;

const JSON_STRINGIFY_SPACING = 2;

function getSearchFailureText(failure: CommandError): string {
  switch (failure.type) {
    case CommandErrorTag.NoResults: {
      return `No results found for query '${failure.data}'`;
    }

    case CommandErrorTag.DiscordError: {
      return `Discord error for query '${failure.data.commandText}'`;
    }

    case CommandErrorTag.ValidationError: {
      return `Validation error for query '${failure.data.commandText}': `;
    }

    default:
      return assertUnreachable(failure);
  }
}
