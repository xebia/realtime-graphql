import express from 'express';
import cors from 'cors';
import graphqlHTTP from 'express-graphql';
import path from 'path';
import { SubscriptionManager } from 'graphql-subscriptions';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { setComment, pubsub } from './comment-store';

import schema from './schema';

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions: {
    commentAdded: (options, args) => ({
      newCommentsChannel: {
      },
    }),
  },
});

const PORT = 3000;

const app = express();

app.use(cors());
app.options('*', cors());

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

setInterval(() => {
  pubsub.publish('newCommentsChannel', setComment({
    author: 'server.js',
    comment: `servertime is now: ${(new Date()).getTime()}`,
  }));
}, 10000);
