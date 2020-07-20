import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as tmdb from "./tmdb";
import * as either from "fp-ts/lib/Either";
import * as commands from "./commands";
import { assertUnreachable } from "./utilities";
import reporter from "io-ts-reporters";
import * as isbndb from "./isbndb";

dotenv.config();

const tmdbApiKey = process.env.TMDB_API_KEY ?? "NOVALUE";
if (tmdbApiKey === "NOVALUE") throw new Error("No TMDB API key specified.");

const isbndbApiKey = process.env.ISBNDB_KEY ?? "NOVALUE";
if (isbndbApiKey === "NOVALUE") throw new Error("No ISBDNDB API key specified.");

const client = new Discord.Client();

let imageBaseUrl: string;

client.on("ready", async () => {
  const configurationResponse = await tmdb.getConfiguration(tmdbApiKey);

  console.error(reporter.report(configurationResponse));

  if (either.isRight(configurationResponse)) {
    imageBaseUrl = `${configurationResponse.right.images.base_url}`;
  }

  console.log(`Logged in as: ${client.user?.tag ?? "N/A"}!`);
});

const handleCommand = async (
  command: commands.Command,
  message: Discord.Message
): Promise<void> => {
  switch (command.type) {
    case "!ping": {
      message.reply("Pong!");

      return;
    }

    case "!whoareyou": {
      const embed = new Discord.MessageEmbed({
        image: { url: "https://cms.qz.com/wp-content/uploads/2015/11/rtxm3g2.jpg" },
      });

      message.reply("I am Pomoshtnik, the helper bot!", embed);

      return;
    }

    case "!person": {
      handlePersonCommand(command, message);

      return;
    }

    case "!movie": {
      handleMovieCommand(command, message);

      return;
    }

    case "!show": {
      handleShowCommand(command, message);

      return;
    }

    case "!isbn": {
      handleISBNCommand(command, message);

      return;
    }

    default:
      assertUnreachable(command);
  }
};

client.on("message", (message) => {
  if (!message.author.bot) {
    const decodedCommand = commands.CommandFromList.decode(message.content.split(" "));

    switch (decodedCommand._tag) {
      case "Right": {
        handleCommand(decodedCommand.right, message);

        break;
      }

      case "Left": {
        console.error("Unable to decode message:", reporter.report(decodedCommand));

        break;
      }

      default:
        assertUnreachable(decodedCommand);
    }
  }
});

client.login("MzY4NzU5MDI3MTU4NDgyOTQ0.XxBC6Q.0mJKrCoEomFiZNLg9FJMC_4AJJE");

const handlePersonCommand = async (
  command: commands.PersonCommand,
  message: Discord.Message
): Promise<void> => {
  const maybePeople = await tmdb.searchPerson(tmdbApiKey, command.name);

  switch (maybePeople._tag) {
    case "Right": {
      if (maybePeople.right.length > 0) {
        const person = maybePeople.right[0];

        const posterUrl =
          person.profile_path !== null
            ? `${imageBaseUrl}${tmdb.preferredProfileSize}${person.profile_path}`
            : "";

        const embed = new Discord.MessageEmbed({
          title: person.name,
          image: { url: posterUrl },
          footer: {
            text: `Known for: ${person.known_for_department}    Popularity: ${person.popularity}`,
          },
        });

        person.known_for.forEach((media) => {
          const title = media.media_type === "movie" ? media.title ?? "N/A" : media.name ?? "N/A";

          const releaseDate =
            media.media_type === "movie"
              ? media.release_date ?? "N/A"
              : media.first_air_date ?? "N/A";

          embed.addField(`${releaseDate}: ${title} (${media.vote_average})`, media.overview);
        });

        message.reply(embed);
      } else {
        message.reply(`No results returned for '${command.name}'.`);
      }

      break;
    }

    case "Left": {
      console.error("error:", reporter.report(maybePeople).join(" "));

      break;
    }

    default:
      assertUnreachable(maybePeople);
  }
};

export const handleMovieCommand = async (
  command: commands.MovieCommand,
  message: Discord.Message
): Promise<void> => {
  const maybeMovies = await tmdb.searchMovie(tmdbApiKey, command.name);

  switch (maybeMovies._tag) {
    case "Right": {
      if (maybeMovies.right.length > 0) {
        const movieCandidate = maybeMovies.right[0];

        const posterUrl =
          movieCandidate.poster_path !== null
            ? `${imageBaseUrl}${tmdb.preferredProfileSize}${movieCandidate.poster_path}`
            : "";

        const maybeMovie = await tmdb.getMovie(tmdbApiKey, movieCandidate.id);

        switch (maybeMovie._tag) {
          case "Right": {
            const movie = maybeMovie.right;

            const embed = new Discord.MessageEmbed({
              title: `${movie.title} (${movie.vote_average}, ${movie.release_date})`,
              image: { url: posterUrl },
            });

            const castEntries = movie.credits.cast
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry) => `**${castEntry.name}** as ${castEntry.character}`);

            embed.addField("Description", movie.overview);
            embed.addField("Cast", castEntries.join("\n"));
            message.reply(embed);

            break;
          }

          case "Left": {
            console.error(reporter.report(maybeMovie));

            break;
          }

          default:
            assertUnreachable(maybeMovie);
        }
      } else {
        message.reply(`No results returned for '${command.name}'.`);
      }

      break;
    }

    case "Left": {
      console.error("error:", reporter.report(maybeMovies).join("\n"));

      break;
    }

    default:
      assertUnreachable(maybeMovies);
  }
};

export const handleShowCommand = async (
  command: commands.ShowCommand,
  message: Discord.Message
): Promise<void> => {
  const maybeShows = await tmdb.searchShow(tmdbApiKey, command.name);

  switch (maybeShows._tag) {
    case "Right": {
      if (maybeShows.right.length > 0) {
        const showCandidate = maybeShows.right[0];

        const posterUrl =
          showCandidate.poster_path !== null
            ? `${imageBaseUrl}${tmdb.preferredProfileSize}${showCandidate.poster_path}`
            : "";

        const maybeShow = await tmdb.getShow(tmdbApiKey, showCandidate.id);

        switch (maybeShow._tag) {
          case "Right": {
            const show = maybeShow.right;

            const lastEpisode = show.last_episode_to_air;

            const lastEpisodeDescription =
              lastEpisode !== null
                ? [
                    `**${lastEpisode?.name}** (S${lastEpisode?.season_number
                      .toFixed(0)
                      .padStart(2, "0")}E${lastEpisode?.episode_number
                      .toFixed(0)
                      .padStart(2, "0")}) aired on **${lastEpisode?.air_date ?? "N/A"}**`,
                    `${lastEpisode?.overview ?? "N/A"}`,
                  ].join("\n")
                : "N/A";

            const embed = new Discord.MessageEmbed({
              title: `${show.name} (${show.vote_average}, ${show.first_air_date})`,
              image: { url: posterUrl },
            });

            embed.addField("Description", show.overview);
            embed.addField("Last Episode", lastEpisodeDescription);

            const castEntries = show.credits.cast
              .slice(0, MAX_EMBED_CAST_ENTRIES)
              .map((castEntry) => `**${castEntry.name}** as ${castEntry.character}`);

            embed.addField("Cast", castEntries.join("\n"));
            message.reply(embed);

            break;
          }

          case "Left": {
            console.error(`Unable to get credits: ${reporter.report(maybeShow)}`);

            break;
          }

          default:
            assertUnreachable(maybeShow);
        }

        break;
      }
      break;
    }

    case "Left": {
      console.error("error:", reporter.report(maybeShows).join("\n"));

      break;
    }

    default:
      assertUnreachable(maybeShows);
  }
};

export const handleISBNCommand = async (
  command: commands.ISBNCommand,
  message: Discord.Message
): Promise<void> => {
  const maybeBook = await isbndb.getBookByISBN(isbndbApiKey, command.isbn);

  switch (maybeBook._tag) {
    case "Right": {
      const book = maybeBook.right;

      const embed = new Discord.MessageEmbed({
        title: book.title,
        image: { url: book.image ?? "" },
      });

      embed.addField("Overview", book.overview ?? "N/A");
      embed.addField("Published", book.publish_date);
      embed.addField("Authors", book.authors.join(", "));
      embed.addField("Pages", book.pages);
      embed.addField("Publisher", book.publisher);
      embed.addField("ISBN", `${book.isbn} & ${book.isbn13}`);

      message.reply(embed);

      break;
    }

    case "Left": {
      console.error("error:", reporter.report(maybeBook));

      break;
    }

    default:
      assertUnreachable(maybeBook);
  }
};

const MAX_EMBED_CAST_ENTRIES = 25;
