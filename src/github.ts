import * as t from "io-ts";
import { left } from "fp-ts/lib/Either";

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
  created_at: t.union([t.number, t.string]),
  updated_at: t.string,
  description: t.union([t.null, t.string]),
  owner: Owner,
  url: t.string,
  html_url: t.string,
});

export type Repository = t.TypeOf<typeof Repository>;

export const User = t.type({
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

export type User = t.TypeOf<typeof User>;

export const Sender = User;

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
  event_type: t.literal("RepositoryCreated"),
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
  event_type: t.literal("PushedToRepository"),
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

export const Label = t.type({
  id: t.number,
  url: t.string,
  name: t.string,
  color: t.string,
  default: t.boolean,
  description: t.string,
});

export const Issue = t.type({
  id: t.number,
  url: t.string,
  repository_url: t.string,
  number: t.number,
  title: t.string,
  user: User,
  labels: t.array(Label),
  state: t.string,
  locked: t.boolean,
  assignee: t.union([t.null, User]),
  assignees: t.array(User),
  comments: t.number,
  created_at: t.string,
  updated_at: t.string,
  closed_at: t.union([t.null, t.string]),
  author_association: t.string,
  body: t.string,
});

export const IssueOpened = t.type({
  event_type: t.literal("IssueOpened"),
  action: t.literal("opened"),
  issue: Issue,
  repository: Repository,
  organization: Organization,
  sender: User,
});

export type IssueOpened = t.TypeOf<typeof IssueOpened>;

export const PullRequest = t.type({
  id: t.number,
  url: t.string,
  number: t.number,
  state: t.string,
  locked: t.boolean,
  title: t.string,
  user: User,
  body: t.string,
  created_at: t.string,
  updated_at: t.string,
  assignee: User,
  assignees: t.array(User),
  labels: t.array(Label),
  draft: t.boolean,
});

export const PullRequestOpened = t.type({
  event_type: t.literal("PullRequestOpened"),
  action: t.literal("opened"),
  number: t.number,
  pull_request: PullRequest,
  repository: Repository,
  organization: Organization,
  sender: User,
});

export type PullRequestOpened = t.TypeOf<typeof PullRequestOpened>;

export const PullRequestMerged = t.type({
  event_type: t.literal("PullRequestMerged"),
  action: t.literal("merged"),
  number: t.number,
  pull_request: PullRequest,
  repository: Repository,
  organization: Organization,
  sender: User,
});

export type PullRequestMerged = t.TypeOf<typeof PullRequestMerged>;

export const PullRequestClosed = t.type({
  event_type: t.literal("PullRequestClosed"),
  action: t.literal("closed"),
  number: t.number,
  pull_request: PullRequest,
  repository: Repository,
  organization: Organization,
  sender: User,
});

export type PullRequestClosed = t.TypeOf<typeof PullRequestClosed>;

export const PullRequestEvent = t.union([PullRequestOpened, PullRequestMerged, PullRequestClosed]);
export type PullRequestEvent = t.TypeOf<typeof PullRequestEvent>;

export const UnknownEvent = t.type({
  event_type: t.literal("UnknownEvent"),
  action: t.literal("UnknownAction"),
});

// @TODO: add `PullRequestOpened`
// @TODO: maybe `PullRequestAssigned` too ,  or `PullRequestReviewRequested` instead
export const WebhookEvent = t.union([
  RepositoryCreated,
  PushedToRepository,
  IssueOpened,
  PullRequestEvent,
  UnknownEvent,
]);
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
          if (t.UnknownRecord.is(u.body)) {
            return RepositoryCreated.decode({ ...u.body, event_type: "RepositoryCreated" });
          } else {
            return left([
              {
                value: u.body,
                context: c,
                message: "expecting object at 'body'",
              },
            ]);
          }
        }

        case "push": {
          if (t.UnknownRecord.is(u.body)) {
            return PushedToRepository.decode({
              ...u.body,
              event_type: "PushedToRepository",
              action: "push",
            });
          } else {
            return left([
              {
                value: u.body,
                context: c,
                message: "expecting object at 'body'",
              },
            ]);
          }
        }

        case "issues": {
          if (t.UnknownRecord.is(u.body)) {
            const eventType = u.body.action === "opened" ? "IssueOpened" : "IssueClosed";

            return IssueOpened.decode({ event_type: eventType, ...u.body });
          } else {
            return left([
              {
                value: u.body,
                context: c,
                message: "expecting object at 'body'",
              },
            ]);
          }
        }

        case "pull_request": {
          if (t.UnknownRecord.is(u.body)) {
            const eventType = getPullRequestEventType(u.body);

            return PullRequestEvent.decode({ event_type: eventType, ...u.body });
          } else {
            return left([
              {
                value: u.body,
                context: c,
                message: "expecting object at 'body'",
              },
            ]);
          }
        }

        case "UnknownEvent": {
          return t.success({ event_type: "UnknownEvent", action: "UnknownAction" });
        }

        default:
          return left([
            {
              value: u.event,
              context: c,
              message: "expecting 'repository', 'push', 'UnknownEvent' as event type",
            },
          ]);
      }
    } else {
      return t.failure(u, c);
    }
  },
  (rc) => {
    return { event: "repository", body: JSON.stringify(rc) };
  }
);

const getPullRequestEventType = (body: { [key: string]: unknown }): string => {
  switch (body.action) {
    case "opened":
      return "PullRequestOpened";
    case "merged":
      return "PullRequestMerged";
    case "closed":
      return "PullRequestClosed";
    default:
      return "UnknownEvent";
  }
};
