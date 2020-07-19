import * as t from "io-ts";
import { either } from "fp-ts/lib/Either";
import { assertUnreachable } from "./utilities";

export const MovieCommand = t.type({ type: t.literal("!movie"), name: t.string });

export const PersonCommand = t.type({ type: t.literal("!person"), name: t.string });

export const ShowCommand = t.type({ type: t.literal("!show"), name: t.string });

export const ISBNCommand = t.type({ type: t.literal("!isbn"), isbn: t.string });

export const PingCommand = t.type({ type: t.literal("!ping") });

export const WhoAreYouCommand = t.type({ type: t.literal("!whoareyou") });

export const Command = t.union(
  [PingCommand, WhoAreYouCommand, MovieCommand, PersonCommand, ShowCommand, ISBNCommand],
  "Command"
);

export type Command = t.TypeOf<typeof Command>;

export const CommandFromList = new t.Type<Command, string[], unknown>(
  "CommandFromList",
  (u): u is Command =>
    ["!ping", "!whoareyou", "!movie", "!person", "!show", "!isbn"].some(
      (v) => typeof u === "string" && u.startsWith(v)
    ),
  (u, c) => {
    return either.chain(t.array(t.string).validate(u, c), (stringArray) => {
      const [messageType, ...args] = stringArray;

      switch (messageType) {
        case "!person": {
          return t.success({ type: "!person", name: args.join(" ") });
        }

        case "!movie": {
          return t.success({ type: "!movie", name: args.join(" ") });
        }

        case "!show": {
          return t.success({ type: "!show", name: args.join(" ") });
        }

        case "!isbn": {
          return t.success({ type: "!isbn", isbn: args.join(" ") });
        }

        case "!ping": {
          return t.success({ type: "!ping" });
        }

        case "!whoareyou": {
          return t.success({ type: "!whoareyou" });
        }

        default:
          return t.failure(u, c);
      }
    });
  },
  (c) => {
    switch (c.type) {
      case "!person": {
        return ["!person", ...c.name.split(" ")];
      }

      case "!movie": {
        return ["!movie", ...c.name.split(" ")];
      }

      case "!show": {
        return ["!show", ...c.name.split(" ")];
      }

      case "!isbn": {
        return ["!isbn", ...c.isbn.split(" ")];
      }

      case "!ping": {
        return ["!ping"];
      }

      case "!whoareyou": {
        return ["!whoareyou"];
      }

      default:
        return assertUnreachable(c);
    }
  }
);
