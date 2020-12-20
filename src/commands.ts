import {Command, CommandTag, validateCommand} from "./gotyno/commands";
import {ValidationResult} from "simple-validation-tools";

export function commandFromStrings(strings: string[]): ValidationResult<Command> {
  const commandMap: {[key: string]: CommandTag} = {
    "!ping": CommandTag.Ping,
    "!whoareyou": CommandTag.WhoAreYou,
    "!movie": CommandTag.Movie,
    "!person": CommandTag.Person,
    "!show": CommandTag.Show,
    "!isbn": CommandTag.ISBN,
  };
  if (strings.length < 1) {
    return {type: "Invalid", errors: "String list has no entries"};
  } else {
    const [first, ...rest] = strings;
    const type = commandMap[first];
    const data = rest.join(" ");

    return validateCommand({type, data});
  }
}
