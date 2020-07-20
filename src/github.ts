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
  created_at: t.number,
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

export const Pusher = t.type({ name: t.string, email: t.string });
export type Pusher = t.TypeOf<typeof Pusher>;

export const Author = t.type({ name: t.string, email: t.string, username: t.string });
export type Author = t.TypeOf<typeof Author>;

export const Commit = t.type({
  id: t.string,
  tree_id: t.string,
  distinct: t.boolean,
  message: t.string,
  timestamp: t.string,
  url: t.string,
  author: Author,
  committer: Author,
  added: t.array(t.string),
  removed: t.array(t.string),
  modified: t.array(t.string),
});
export type Commit = t.TypeOf<typeof Commit>;

export const PushedToRepository = t.type({
  action: t.literal("push"),
  repository: Repository,
  ref: t.string,
  before: t.string,
  after: t.string,
  pusher: Pusher,
  organization: Organization,
  sender: Sender,
  created: t.boolean,
  deleted: t.boolean,
  forced: t.boolean,
  compare: t.string,
  commits: t.array(Commit),
  head_commit: Commit,
});

export type PushedToRepository = t.TypeOf<typeof PushedToRepository>;

export const UnknownEvent = t.type({ action: t.literal("UnknownAction") });

// @TODO: add `PullRequestOpened`
// @TODO: maybe `PullRequestAssigned` too ,  or `PullRequestReviewRequested` instead
export const WebhookEvent = t.union([RepositoryCreated, PushedToRepository, UnknownEvent]);
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
          return RepositoryCreated.decode(u.body);
        }

        case "push": {
          if (typeof u.body === "object") {
            return PushedToRepository.decode({ ...u.body, action: "push" });
          } else {
            return left([]);
          }
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
