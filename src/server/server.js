import express from 'express';
import graphqlHTTP from 'express-graphql';
import { SubscriptionManager, PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import schema from './schema';

const pubsub = new PubSub();

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
});

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


const WS_PORT = 5000;

// Create WebSocket listener server
const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

// Bind it to port and start listening
websocketServer.listen(WS_PORT, () => console.log(
  `Websocket Server is now running on http://localhost:${WS_PORT}`,
));

const subscriptionServer = new SubscriptionServer(
  {
    onConnect: async (connectionParams) => {
      // Implement if you need to handle and manage connection
    },
    subscriptionManager,
  },
  {
    server: websocketServer,
    path: '/',
  },
);
