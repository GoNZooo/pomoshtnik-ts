import {Db, FilterQuery, MongoClient, ObjectId} from "mongodb";
import {BotUser, SearchCommand} from "../pomoshtnik-shared/gotyno/commands";
import {searchResult} from "../pomoshtnik-shared/utilities";
import SocketIO from "socket.io";
import {SearchAdded} from "../pomoshtnik-shared/gotyno/api";

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

export type GetUsersOptions = {
  limit?: number;
  sort?: [string, "ascending" | "descending"];
  filter?: FilterQuery<unknown>;
};

export async function getUsers(database: Db, options: GetUsersOptions): Promise<BotUser[]> {
  const collection = database.collection("users");
  const filter = options.filter ?? {};
  const filtered = collection.find(filter);
  const sorted =
    options.sort !== undefined
      ? filtered.sort(
          options.sort[0],
          options.sort[1] === "descending" ? DESCENDING_ORDER : ASCENDING_ORDER
        )
      : filtered;
  const limited = options.limit !== undefined ? sorted.limit(options.limit) : sorted;

  return await limited.toArray();
}

export async function addSearchCommandResult<T>(
  database: Db,
  command: SearchCommand,
  socketServer: SocketIO.Server
): Promise<void> {
  await database.collection("searches").insertOne(command);
  socketServer.emit("ServerEvent", SearchAdded(command));
}

export async function addUserIfUnique(database: Db, user: BotUser): Promise<void> {
  const botUsers = await database.collection("users");

  const foundUser: unknown = await botUsers.findOne({nickname: user.nickname});
  if (foundUser === null) {
    await botUsers.insertOne(user);
  } else {
    await botUsers.replaceOne({nickname: user.nickname}, user);
  }
}

export async function deleteSearchByMongoId(database: Db, id: string): Promise<boolean> {
  const result = await database.collection("searches").deleteOne({_id: new ObjectId(id)});

  return result.result.ok === 1;
}

const DESCENDING_ORDER = -1;
const ASCENDING_ORDER = 1;
