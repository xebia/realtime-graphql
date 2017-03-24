import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import casual from 'casual';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const typeDefs = [
  readFileSync(resolve(__dirname, 'schema.graphql')).toString(),
];

const executableSchema = makeExecutableSchema({
  typeDefs,
});

addMockFunctionsToSchema({
  schema: executableSchema,
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
  },
});

export default executableSchema;
