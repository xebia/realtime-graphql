import { PubSub } from 'graphql-subscriptions';

let comment = {
  author: undefined,
  comment: undefined,
};

export function setComment(c) {
  comment = c;
  return comment;
}
export function getComment() {
  return comment;
}

export const pubsub = new PubSub();
