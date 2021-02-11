import {Db, FilterQuery, MongoClient, ObjectId} from "mongodb";
import {BotUser, Note, SearchCommand} from "../pomoshtnik-shared/gotyno/commands";
import {HasMongoId, searchResult} from "../pomoshtnik-shared/utilities";
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

export async function addNote(database: Db, note: Note): Promise<HasMongoId<Note>> {
  const result = await database.collection("notes").insertOne(note);
  if (result.insertedCount === 1) {
    return {_id: result.insertedId, ...note};
  } else {
    throw new Error("Unable to insert note");
  }
}

export async function removeNote(database: Db, nickname: string, uuid: string): Promise<boolean> {
  const result = await database
    .collection("notes")
    .deleteOne({$and: [{"user.nickname": nickname}, {uuid}]});

  return result.deletedCount === 1;
}

export async function updateNote(
  database: Db,
  nickname: string,
  uuid: string,
  title: string,
  body: string,
  nowTimestamp: string
): Promise<boolean> {
  const result = await database
    .collection("notes")
    .updateOne(
      {$and: [{"user.nickname": nickname}, {uuid}]},
      {$set: {title, body, updated: nowTimestamp}}
    );

  return result.modifiedCount === 1;
}

export async function searchNote(database: Db, nickname: string, query: string): Promise<Note[]> {
  const queryAsRegex = new RegExp(query);

  return await database
    .collection("notes")
    .find({
      $and: [{"user.nickname": nickname}, {$or: [{title: queryAsRegex}, {body: queryAsRegex}]}],
    })
    .toArray();
}

const DESCENDING_ORDER = -1;
const ASCENDING_ORDER = 1;
