import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as tmdb from "./tmdb";
import { PathReporter } from "io-ts/lib/PathReporter";
import * as either from "fp-ts/lib/Either";
import * as commands from "./commands";
import { assertUnreachable } from "./utilities";

dotenv.config();

const tmdbApiKey = process.env.TMDB_API_KEY ?? "NOVALUE";
if (tmdbApiKey === "NOVALUE") throw new Error("No TMDB API key specified.");

const client = new Discord.Client();

let imageBaseUrl: string;

client.on("ready", async () => {
  const configurationResponse = await tmdb.getConfiguration(tmdbApiKey);

  console.log(PathReporter.report(configurationResponse));

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
      const maybePeople = await tmdb.searchActor(tmdbApiKey, command.name);
      switch (maybePeople._tag) {
        case "Right": {
          const person = maybePeople.right[0];
          const posterUrl = `${imageBaseUrl}${tmdb.preferredProfileSize}${person.profile_path}`;
          const embed = new Discord.MessageEmbed({
            title: person.name,
            image: { url: posterUrl },
            footer: {
              text: `Known for: ${person.known_for_department}    Popularity: ${person.popularity}`,
            },
          });
          person.known_for.forEach((movie) => {
            embed.addField(
              `${movie.release_date}: ${movie.title} (${movie.vote_average})`,
              movie.overview
            );
          });
          message.reply(embed);

          break;
        }

        case "Left": {
          message.reply(`Unable to decode response: ${JSON.stringify(maybePeople.left)}`);
          break;
        }

        default:
          assertUnreachable(maybePeople);
      }

      return;
    }

    case "!movie": {
      message.reply(`Search for movie: ${command.name}`);

      return;
    }

    case "!show": {
      message.reply(`Search for actor: ${command.name}`);

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
      case "Left": {
        break;
      }

      case "Right": {
        if (commands.Command.is(decodedCommand.right)) {
          handleCommand(decodedCommand.right, message);
        } else {
          console.error("Unable to decode message:", decodedCommand.right);
        }
        break;
      }

      default:
        assertUnreachable(decodedCommand);
    }
  }
});

client.login("MzY4NzU5MDI3MTU4NDgyOTQ0.XxBC6Q.0mJKrCoEomFiZNLg9FJMC_4AJJE");
