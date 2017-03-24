fetch('http://localhost:3000/graphql', {
  method: 'post',
  body: JSON.stringify({
    query: `
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
      `,
  }),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
  .then(res => res.json())
  .then((json) => {
    console.log(JSON.stringify(json, null, 2)); // eslint-disable-line no-console
  });
