## Installing
``` js
npm install
```

### GraphQL
``` js
npm start
```
Browse to http://localhost:3000/graphql

Example query:
```graphql
query {
  search(query: "jeans", offset: 4, limit:4) {
    total
    results {
      id
      name
      description
      price
    }
  }
}
```

### Search result JSON validator
```sh
# Get some validation errors
echo '{"asdf":4 }' | node ./development/run src/validator

# Also available as
npm run demo:validator:error

# Try a valid search result
cat ./development/search_result.json | node ./development/run src/validator

# Also available as
npm run demo:validator

```

### Mock data client
An example client is availabe at [src/client.js](src/client.js).

```sh
# Run the client
npm run run demo:client
```
