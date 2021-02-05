import {Db, MongoClient} from "mongodb";
import * as Discord from "discord.js";
import {BotUser, Command, CommandError, SearchCommand} from "./gotyno/commands";

export function connectToDatabase(client: MongoClient): Db {
  return client.db("pomoshtnik");
}

export async function addCommandError(database: Db, error: CommandError): Promise<void> {
  await database.collection("commandErrors").insertOne(error);
}

export async function getSearches(database: Db): Promise<SearchCommand[]> {
  return await database
    .collection("searches")
    .find({})
    .sort("_id", DESCENDING_ORDER)
    .limit(10)
    .toArray();
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
  const lastSeen = Date.now().toString();
  const nickname = user.username;
  const botUser = {lastCommand, lastSeen, nickname};

  await database.collection("users").insertOne(botUser);
}

const DESCENDING_ORDER = -1;
