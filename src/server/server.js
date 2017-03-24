import express from 'express';
import graphqlHTTP from 'express-graphql';
import path from 'path';

import schema from './schema';

const PORT = 3000;

const app = express();

console.log(path.resolve('src/client-au/dist/'));
app.use(express.static(path.resolve('src/client-au/dist/')));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  /* eslint-disable no-console */
  console.log(`Listening on: http://localhost:${PORT}/graphql`);
  /* eslint-enable no-console */
});
