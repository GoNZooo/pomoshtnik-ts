import {DiscordAPIError, Message, MessageEmbed} from "discord.js";

export type ReplyResult = ReplySuccess | ReplyFailure;

export type ReplySuccess = {
  type: "ReplySuccess";
};
export type ReplyFailure = {
  type: "ReplyFailure";
  error: DiscordAPIError;
};

export type Reply = {
  text?: string;
  embed?: MessageEmbed;
};

export async function replyTo(message: Message, reply: Reply): Promise<ReplyResult> {
  try {
    await message.reply(reply.text, reply.embed);

    return {type: "ReplySuccess"};
  } catch (error) {
    if (error instanceof DiscordAPIError) {
      return {type: "ReplyFailure", error};
    } else {
      throw new Error(`Unrecognized error when sending message: ${error.toString()}`);
    }
  }
}
