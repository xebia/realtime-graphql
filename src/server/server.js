import express from 'express';
import graphqlHTTP from 'express-graphql';

import schema from './schema';

const PORT = 3000;

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Listening on: http://localhost:${PORT}/graphql`);
  /* eslint-enable no-console */
});
