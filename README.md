# @karmaniverous/mock-db

[![npm version](https://img.shields.io/npm/v/@karmaniverous/mock-db.svg)](https://www.npmjs.com/package/@karmaniverous/mock-db) ![Node Current](https://img.shields.io/node/v/@karmaniverous/mock-db) <!-- TYPEDOC_EXCLUDE --> [![docs](https://img.shields.io/badge/docs-website-blue)](https://docs.karmanivero.us/stan) [![changelog](https://img.shields.io/badge/changelog-latest-blue.svg)](https://github.com/karmaniverous/mock-db/tree/main/CHANGELOG.md)<!-- /TYPEDOC_EXCLUDE --> [![license](https://img.shields.io/badge/license-BSD--3--Clause-blue.svg)](https://github.com/karmaniverous/mock-db/tree/main/LICENSE.md)

MockDb is a tiny, test‑oriented helper that simulates a small subset of
Amazon DynamoDB behaviors over an in‑memory array of JSON objects. Its goal is
to make it easy to unit/integration test code that expects “Dynamo‑like”
reads without needing to provision a real database.

What you get:

- querySync and query — scan across all items or query a partition (hash key)
- Optional sorting, filtering, limits, and pagination (pageKey)
- Sync and async flavors (async returns with a normally‑distributed delay)

What you do NOT get:

- A database. This is a small helper for tests, not a general data store.
- The full DynamoDB API. Only a small, ergonomic subset of behavior.

MockDb uses [@karmaniverous/entity-tools](https://github.com/karmaniverous/entity-tools)
for type modeling and sorting.

## Installation

You’ll typically install this as a dev dependency:

```bash
npm i -D @karmaniverous/mock-db
```

Node: >= 18 recommended (ESM module). The package ships both ESM and CJS outputs.

## Quick start

```ts
import type { Entity } from '@karmaniverous/mock-db'; // convenience re-export
import { MockDb, type QueryOptions } from '@karmaniverous/mock-db';

interface User extends Entity {
  partition: string; // hash key
  id: number;
  name: string;
}

const users: User[] = [
  { partition: 'a', id: 4, name: 'Alice' },
  { partition: 'b', id: 3, name: 'Bob' },
  { partition: 'a', id: 2, name: 'Charlie' },
  { partition: 'a', id: 1, name: 'Dave' },
];

const db = new MockDb(users); // default async mean=100ms, std=20ms

// 1) Synchronous “scan” across all items with filter + sort
const scan = db.querySync({
  filter: ({ id }) => id > 2,
  sortOrder: [{ property: 'id' }],
});
// => { count: 2, items: [...], pageKey: undefined }

// 2) Asynchronous, paged, sorted “query” within a partition (hash key)
const opts: QueryOptions<User> = {
  hashKey: 'partition',
  hashValue: 'a',
  indexComponents: ['partition', 'id'],
  limit: 2,
  sortOrder: [{ property: 'id' }],
};

let page = await db.query(opts, 100);
// => first two items plus pageKey for next page

page = await db.query({ ...opts, pageKey: page.pageKey }, 100);
// => next page (remaining items)
```

CommonJS example:

```js
const { MockDb } = require('@karmaniverous/mock-db');
```

## API overview

### class MockDb<E extends Entity, T extends TranscodeRegistry = DefaultTranscodeRegistry>

Replicates a limited set of DynamoDB scan/query behaviors over a local array.

Constructor

- new MockDb(data: E[], delayMean = 100, delayStd = 20)
  - delayMean/delayStd (ms) control async delay for query(...). querySync is always synchronous.

Methods

- querySync(options?: QueryOptions<E, T>): QueryReturn<E, T>
- query(options?: QueryOptions<E, T>, delayMean?: number, delayStd?: number): Promise<QueryReturn<E, T>>

### type QueryOptions<E, T>

Options for query/querySync (T is a TranscodeRegistry):

- hashKey?: TranscodableProperties<E, T>  
  When provided with hashValue, restricts results to the “partition” (like DynamoDB query).
- hashValue?: T[keyof T]
- sortOrder?: SortOrder<E>  
  Sorting keys and directions; powered by entity‑tools’ sort.
- filter?: (item: E) => unknown  
  Predicate to include items.
- limit?: number  
  Maximum number of items to return.
- pageKey?: E | Partial<Pick<E, TranscodableProperties<E, T>>>  
  If set, results begin after this item (pagination).
- indexComponents?: TranscodableProperties<E, T>[]  
  When limit is reached, the returned pageKey contains only these properties; otherwise it will be the entire last item.

### type QueryReturn<E, T>

Result from query/querySync:

- count: number  
  Count of items returned in this page (not the entire dataset).
- items: E[]  
  The data items in this page.
- pageKey?: E | Pick<E, TranscodableProperties<E, T>>  
  Present when limit was reached; pass back as options.pageKey to get the next page.

### Behavior notes

- Scan vs Query:
  - If hashKey + hashValue are omitted, behavior is a “scan” across all items.
  - If both are present, behavior is a “query” restricted to that partition.
- Sorting: Applied before pagination/filtering (like Dynamo’s sorted result sets).
- Filtering: A plain predicate function; no Dynamo expression syntax.
- Pagination: Provide limit; when the page is full, the last item’s indexComponents (or the entire item) is returned as pageKey. Pass it back to get the next page.
- Async timing: query(...) simulates network latency with a normal distribution around delayMean (std delayStd). querySync(...) performs the same logic without delay.

## Re‑exported convenience types

To avoid a direct dependency on @karmaniverous/entity‑tools in your imports, the following types are re‑exported:

```ts
import type {
  Entity,
  SortOrder,
  TranscodeRegistry,
  DefaultTranscodeRegistry,
} from '@karmaniverous/mock-db';
```

You can still import them from @karmaniverous/entity‑tools if you prefer.

## Project scripts (local)

- Test: `npm test` (Vitest; coverage via V8)
- Lint/format: `npm run lint` (ESLint) • `npm run lint:fix` (ESLint + Prettier)
- Typecheck: `npm run typecheck` (tsc, no emit)
- Build: `npm run build` (Rollup – ESM/CJS + dts)
- Docs: `npm run docs` (TypeDoc)

## Typedocs

See the online [API Documentation](https://docs.karmanivero.us/mock-db) for the complete, generated API reference.

## Why not a real database?

This library is meant for fast, deterministic test runs where mocking a small
subset of Dynamo behaviors is sufficient (hash key filtering, sorting,
pagination). If you need to exercise full DynamoDB semantics, consider running
a local emulator or integration tests against a real service.

---

Built for you with ❤️ on Bali! Find more tools & templates on
[my GitHub Profile](https://github.com/karmaniverous).
