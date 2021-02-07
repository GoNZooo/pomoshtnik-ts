import {Db, MongoClient, ObjectId} from "mongodb";
import * as Discord from "discord.js";
import {
  BotUser,
  Command,
  SearchCommand,
  SearchCommandTag,
} from "../pomoshtnik-shared/gotyno/commands";
import {assertUnreachable} from "../pomoshtnik-shared/utilities";

export function connectToDatabase(client: MongoClient): Db {
  return client.db("pomoshtnik");
}

export async function getSearches(database: Db, limit?: number): Promise<SearchCommand[]> {
  const results = await database.collection("searches").find({}).sort("_id", DESCENDING_ORDER);

  return limit !== undefined ? results.limit(limit).toArray() : results.toArray();
}

export async function getSearchesByResultLike(
  database: Db,
  like: string
): Promise<SearchCommand[]> {
  const results = await database
    .collection("searches")
    .find({})
    .sort("_id", DESCENDING_ORDER)
    .toArray();

  return results.filter((c: SearchCommand) => searchResult(c).match(like));
}

function searchResult(command: SearchCommand): string {
  switch (command.type) {
    case SearchCommandTag.ShowSearch: {
      return command.data.type === "SearchSuccess" ? command.data.data.name : "";
    }

    case SearchCommandTag.MovieSearch: {
      return command.data.type === "SearchSuccess" ? command.data.data.title ?? "" : "";
    }

    case SearchCommandTag.PersonSearch: {
      return command.data.type === "SearchSuccess" ? command.data.data.name : "";
    }

    case SearchCommandTag.GitHubRepositorySearch: {
      return command.data.type === "SearchSuccess" ? command.data.data.full_name : "";
    }

    case SearchCommandTag.GitHubUserSearch: {
      return command.data.type === "SearchSuccess" ? command.data.data.login : "";
    }

    default:
      return assertUnreachable(command);
  }
}

export async function getUsers(database: Db): Promise<BotUser[]> {
  return await database
    .collection("users")
    .find({})
    .sort("lastSeen", DESCENDING_ORDER)
    .limit(10)
    .toArray();
}

export async function addSearchCommandResult(database: Db, result: SearchCommand): Promise<void> {
  await database.collection("searches").insertOne(result);
}

export async function addUserIfUnique(
  database: Db,
  user: Discord.User,
  lastCommand: Command
): Promise<void> {
  const lastSeen = new Date().toISOString();
  const nickname = user.username;
  const botUsers = await database.collection("users");
  const botUser = {lastCommand, lastSeen, nickname};

  const foundUser: unknown = await botUsers.findOne({nickname});
  if (foundUser === null) {
    await botUsers.insertOne(botUser);
  } else {
    await botUsers.replaceOne({nickname}, botUser);
  }
}

export async function deleteSearchByMongoId(database: Db, id: string): Promise<boolean> {
  const result = await database.collection("searches").deleteOne({_id: new ObjectId(id)});

  return result.result.ok === 1;
}

const DESCENDING_ORDER = -1;
