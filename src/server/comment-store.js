import { PubSub } from 'graphql-subscriptions';

let comment;

export function setComment(c) {
  comment = c;
  return comment;
}
export function getComment() {
  return comment;
}

export const pubsub = new PubSub();
