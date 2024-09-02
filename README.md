<!-- TYPEDOC_EXCLUDE -->

> [API Documentation](https://karmaniverous.github.io/mock-db) • [CHANGELOG](https://github.com/karmaniverous/mock-db/tree/main/CHANGELOG.md)

<!-- /TYPEDOC_EXCLUDE -->

# MockDb

The [`MockDb`](https://karmaniverous.github.io/mock-db/docs/classes/index.MockDb.html) class wires up a local JSON data store to replicate some key behaviors of DynamoDB for testing purposes.

MockDb is not a database in any meaningful sense, nor does it express anything like the full range of DynamoDB's features! It's just a limited text fixture, to which I add features as I need them.

The current feature set includes:

- [`query`](https://karmaniverous.github.io/mock-db/docs/classes/index.MockDb.html#query) - Depending on the options passed, this method behaves like either a DynamoDB `query` or `scan` operation, including limited return sets with page keys.

That's it!

## Usage

You'll almost certainly run MockDb as a dev dependency. To install:

```bash
npm i -D @karmaniverous/mock-db
```

Then you can run:

```ts
import { type Item, MockDb, type QueryOptions } from '.';

// Specify the data type.
interface User extends Item {
  partition: string;
  id: string;
  name: string;
}

// Create some data.
const users: User[] = [
  { partition: 'a', id: '4', name: 'Alice' },
  { partition: 'b', id: '3', name: 'Bob' },
  { partition: 'a', id: '2', name: 'Charlie' },
  { partition: 'a', id: '1', name: 'Dave' },
];

// Create a new instance of MockDb.
const mockDb = new MockDb<User>(users);

// Perform a "scan" across partitions with a filter.
const scanResult = mockDb.query({
  sortKey: 'id',
  filter: ({ id }) => id > '2',
});

console.log(scanResult);

// {
//   count: 2,
//   items: [
//     { partition: 'b', id: '2', name: 'Bob' },
//     { partition: 'a', id: '3', name: 'Alice' }
//   ],
//   pageKeys: undefined
// }

// Perform a paged, sorted "query" within a partition.
const queryOptions: QueryOptions<User> = {
  hashKey: 'partition',
  hashValue: 'a',
  indexComponents: ['partition', 'id'],
  limit: 2,
  sortKey: 'id',
};

let queryResult = mockDb.query(queryOptions);

console.log(queryResult);

// {
//   count: 2,
//   items: [
//     { partition: 'a', id: '1', name: 'Dave' },
//     { partition: 'a', id: '2', name: 'Charlie' }
//   ],
//   pageKeys: { partition: 'a', id: '2' }
// }

// Use the returned pageKeys to get the next page.
queryResult = mockDb.query({
  ...queryOptions,
  pageKeys: queryResult.pageKeys,
});

console.log(queryResult);

// {
//   count: 1,
//   items: [ { partition: 'a', id: '4', name: 'Alice' } ],
//   pageKeys: undefined
// }
```

See the [API Documentation](https://karmaniverous.github.io/mock-db) for more details.

Got questions or suggestions? [Start a discussion!](https://github.com/karmaniverous/mock-db/discussions)

---

Built for you with ❤️ on Bali! Find more great tools & templates on [my GitHub Profile](https://github.com/karmaniverous).
