import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

// Create regular NetworkInterface by using apollo-client's API:
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000/graphql', // Your GraphQL endpoint
});

// Create WebSocket client
const wsClient = new SubscriptionClient('ws://localhost:5000/', {
  reconnect: true,
  connectionParams: {
        // Pass any arguments you want for initialization
  },
});


window.wsClient = wsClient;

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
);

// Finally, create your ApolloClient instance with the modified network interface
const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});

window.apolloClient = apolloClient;

apolloClient.subscribe({
  query: gql`
    subscription commentAdded{
      commentAdded{
        author
        comment
      }
    }`,
})
  .subscribe({
    next(data) {
      console.log(data);
    },
    error(err) { console.log(err); },
  });

setInterval(() => {
  const commentAdded = gql`
    mutation commentAdded($author: String!) {
      commentAdded(author: $author) {
        author
        comment
      }
    }
  `;

  apolloClient.mutate({
    mutation: commentAdded,
    variables: {
      author: 'foo bar',
    } }).then((data) => {
      console.log('data', data);
    });
}, 3000);
