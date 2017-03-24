require('babel-core/register');
require('isomorphic-fetch');

// eslint-disable-next-line import/no-dynamic-require
require(`../${process.argv[2]}`);
