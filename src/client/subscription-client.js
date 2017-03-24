import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
import ApolloClient, { createNetworkInterface } from 'apollo-client';

// Create regular NetworkInterface by using apollo-client's API:
const networkInterface = createNetworkInterface({
  uri: 'http://localhost:3000', // Your GraphQL endpoint
});

// Create WebSocket client
const wsClient = new SubscriptionClient('ws://localhost:5000/', {
  reconnect: true,
  connectionParams: {
        // Pass any arguments you want for initialization
  },
});

// Extend the network interface with the WebSocket
const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
    networkInterface,
    wsClient,
);

// Finally, create your ApolloClient instance with the modified network interface
const apolloClient = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
});
