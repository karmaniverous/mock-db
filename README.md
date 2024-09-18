<!-- TYPEDOC_EXCLUDE -->

> [API Documentation](https://docs.karmanivero.us/mock-db) • [CHANGELOG](https://github.com/karmaniverous/mock-db/tree/main/CHANGELOG.md)

<!-- /TYPEDOC_EXCLUDE -->

# MockDb

The [`MockDb`](https://docs.karmanivero.us/mock-db/classes/index.MockDb.html) class wires up a local JSON data store to replicate some key behaviors of DynamoDB for testing purposes.

MockDb is not a database in any meaningful sense, nor does it express anything like the full range of DynamoDB's features! It's just a limited test fixture, to which I add features as I need them.

The current feature set includes:

- [`query`](https://docs.karmanivero.us/mock-db/classes/index.MockDb.html#query) & [`querySync`](https://docs.karmanivero.us/mock-db/classes/index.MockDb.html#querySync) - Depending on the options passed, these methods behave like either a DynamoDB `query` or `scan` operation, including limited return sets with page keys.

- All methods exist in synchronous & asynchronous versions. Async methods run with a normally-distributed delay.

That's it!

MockDB depends on [`entity-tools`](https://github.com/karmaniverous/entity-tools) to define entity properties, indexable properties, and records. This package also provides the [`sort`](https://karmanivero.us/entity-tools/functions/index.sort.html) function used internally by [`MockDb.query`](https://karmanivero.us/mock-db/classes/index.MockDb.html#query).

## Usage

You'll almost certainly run MockDb as a dev dependency. To install:

```bash
npm i -D @karmaniverous/mock-db
```

Then you can run:

```ts
import type { Entity } from '@karmaniverous/entity-tools';

import { MockDb, type QueryOptions } from '.';

// Specify the data type.
interface User extends Entity {
  partition: string;
  id: number;
  name: string;
}

// Create some data.
const users: User[] = [
  { partition: 'a', id: 4, name: 'Alice' },
  { partition: 'b', id: 3, name: 'Bob' },
  { partition: 'a', id: 2, name: 'Charlie' },
  { partition: 'a', id: 1, name: 'Dave' },
];

// Create a new instance of MockDb.
const mockDb = new MockDb(users);

// Perform a "scan" synchronously across partitions with a filter.
const scanResult = mockDb.querySync({
  filter: ({ id }) => id > 2,
  sortOrder: [{ property: 'id' }],
});

console.log(scanResult);

// {
//   count: 2,
//   items: [
//     { partition: 'b', id: 2, name: 'Bob' },
//     { partition: 'a', id: 3, name: 'Alice' }
//   ],
//   pageKey: undefined
// }

// Perform an asynchronous, paged, sorted "query" within a partition.
const queryOptions: QueryOptions<User> = {
  hashKey: 'partition',
  hashValue: 'a',
  indexComponents: ['partition', 'id'],
  limit: 2,
  sortOrder: [{ property: 'id' }],
};

let queryResult = await mockDb.query(queryOptions, 100);

console.log(queryResult);

// {
//   count: 2,
//   items: [
//     { partition: 'a', id: 1, name: 'Dave' },
//     { partition: 'a', id: 2, name: 'Charlie' }
//   ],
//   pageKey: { partition: 'a', id: 2 }
// }

// Use the returned pageKey to get the next page.
queryResult = await mockDb.query(
  {
    ...queryOptions,
    pageKey: queryResult.pageKey,
  },
  100,
);

console.log(queryResult);

// {
//   count: 1,
//   items: [ { partition: 'a', id: 4, name: 'Alice' } ],
//   pageKey: undefined
// }
```

See the [API Documentation](https://docs.karmanivero.us/mock-db) for more details.

Got questions or suggestions? [Start a discussion!](https://github.com/karmaniverous/mock-db/discussions)

---

Built for you with ❤️ on Bali! Find more great tools & templates on [my GitHub Profile](https://github.com/karmaniverous).
