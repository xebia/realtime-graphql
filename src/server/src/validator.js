import { isValidJSValue } from 'graphql';
import { TypeComposer } from 'graphql-compose';

import executableSchema from './schema';

let input = '';
process.stdin.resume();
process.stdin.on('data', (buf) => {
  input += buf.toString();
});
process.stdin.on('end', () => {
  const searchResultInputType = TypeComposer.create(executableSchema.getType('SearchResult')).getInputType();

  try {
    const value = JSON.parse(input);
    const errors = isValidJSValue(value, searchResultInputType);
    if (errors.length) {
      // eslint-disable-next-line no-console
      console.error('Invalid SearchResult, got these errors:');
      errors.forEach((error, i) => {
        // eslint-disable-next-line no-console
        console.log(`${i + 1}. ${error}`);
      });
    } else {
      // eslint-disable-next-line no-console
      console.log('No errors found valid SearchResult!');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Invalid JSON from stdin');
  }
});
