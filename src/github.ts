import * as t from "io-ts";
import { Request } from "express";
import { left, either } from "fp-ts/lib/Either";

export const Owner = t.type({
  id: t.number,
  login: t.string,
  url: t.string,
  html_url: t.string,
  followers_url: t.string,
  gists_url: t.string,
  repos_url: t.string,
  type: t.string,
  site_admin: t.boolean,
});

export type Owner = t.TypeOf<typeof Owner>;
export const Repository = t.type({
  id: t.number,
  name: t.string,
  full_name: t.string,
  private: t.boolean,
  fork: t.boolean,
  created_at: t.string,
  updated_at: t.string,
  description: t.union([t.null, t.string]),
  owner: Owner,
});

export type Repository = t.TypeOf<typeof Repository>;

export const Sender = t.type({
  login: t.string,
  id: t.number,
  avatar_url: t.string,
  url: t.string,
  html_url: t.string,
  followers_url: t.string,
  gists_url: t.string,
  repos_url: t.string,
  type: t.string,
  site_admin: t.boolean,
});

export type Sender = t.TypeOf<typeof Sender>;

export const Organization = t.type({
  login: t.string,
  id: t.number,
  avatar_url: t.string,
  url: t.string,
  members_url: t.string,
  repos_url: t.string,
  description: t.union([t.null, t.string]),
});

export type Organization = t.TypeOf<typeof Organization>;

export const RepositoryCreated = t.type({
  action: t.literal("created"),
  repository: Repository,
  organization: Organization,
  sender: Sender,
});

export type RepositoryCreated = t.TypeOf<typeof RepositoryCreated>;

export const UnknownEvent = t.type({ action: t.literal("UnknownAction") });

export const WebhookEvent = t.union([RepositoryCreated, UnknownEvent]);

export type WebhookEvent = t.TypeOf<typeof WebhookEvent>;

export const RequestData = t.type({
  event: t.string,
  body: t.unknown,
});

type RequestData = t.TypeOf<typeof RequestData>;

export const WebhookEventFromRequestData = new t.Type<WebhookEvent, RequestData, unknown>(
  "WebhookEventFromRequest",
  WebhookEvent.is,
  (u, c) => {
    if (RequestData.is(u)) {
      switch (u.event) {
        case "repository": {
          console.log("got repository event");

          return RepositoryCreated.decode(u.body);
        }

        case "UnknownEvent": {
          return t.success({ action: "UnknownAction" });
        }

        default:
          return left([]);
      }
    } else {
      return t.failure(u, c);
    }
  },
  (rc) => {
    return { event: "repository", body: JSON.stringify(rc) };
  }
);

interface EventDecoders<P extends t.Props> {
  [key: string]: t.TypeC<P>;
}
