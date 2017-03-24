import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import casual from 'casual';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getComment, pubsub, setComment } from './comment-store';

const typeDefs = [
  readFileSync(resolve(__dirname, 'schema.graphql')).toString(),
];

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Mutation: {
      commentAdded(_, { author, comment }) {
        pubsub.publish('newCommentsChannel',
          setComment({
            ...getComment(),
            author,
            comment,
          }),
        );
      },
    },
  },
});

addMockFunctionsToSchema({
  schema: executableSchema,
  preserveResolvers: true,
  mocks: {
    SearchResult() {
      return {
        total: casual.integer(1, 5000),
      };
    },
    Product() {
      return {
        name: casual.title,
        description: casual.short_description,
        price: casual.integer(100, 9e5),
      };
    },
    Comment() {
      return getComment();
    },
  },
});

export default executableSchema;
