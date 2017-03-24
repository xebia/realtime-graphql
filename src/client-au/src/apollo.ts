import ApolloClient, {createNetworkInterface, NetworkInterface} from 'apollo-client';
import gql from 'graphql-tag';

export class Apollo {
  networkInterface: NetworkInterface;
  client: ApolloClient;

  attached() {
    console.log("apollo attached");
    this.networkInterface = createNetworkInterface("http://localhost:3000/graphql");
    this.client = new ApolloClient({
      networkInterface: this.networkInterface
    });

    this.client.query({
      query: gql`{
        search(query: "bank", offset: 4, limit:4) {
        total
        results {
            id
            name
            description
            price
          }
      } }`
    });
  }
}
