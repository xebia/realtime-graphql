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

// apolloClient.subscribeToMore({
  // document: gql`
    // subscription onCommentAdded{
      // commentAdded{
        // author
        // comment
      // }
    // }`,
  // variables: {},
  // updateQuery: (prev, { subscriptionData }) => {
         // // Modify your store and return new state with the new arrived data
  // },
// });

wsClient.subscribe({
  query: `
    subscription newComments{
      commentAdded { # <-- this is the subscription name
        author
        comment
      }
    }
  `,
}, console.log.bind(console));
