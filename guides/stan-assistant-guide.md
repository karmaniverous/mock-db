# STAN assistant guide — @karmaniverous/mock-db

This guide is a compact, self-contained reference for assistants (and humans) working with `@karmaniverous/mock-db`. It focuses on the library’s behavior, invariants, and minimum working patterns for tests.

## What this package provides

- `MockDb<E, T>`: a small, test-oriented helper that simulates a subset of DynamoDB-style query/scan behavior over an in-memory array of JSON objects.
- `QueryOptions<E, T>`: options for “scan” (no partition restriction) and “query” (partition restriction).
- `QueryReturn<E, T>`: `{ count, items, pageKey? }` page-oriented results.
- Convenience re-exports (types) from `@karmaniverous/entity-tools`:
  - `Entity`, `SortOrder`, `TranscodeRegistry`, `DefaultTranscodeRegistry`

## Core mental model

`MockDb` is not a database. It is a deterministic (sync) / latency-simulating (async) query helper for tests that need:

- Partition filtering (like DynamoDB `query`) via `hashKey` + `hashValue`
- Sorting via `sortOrder` (powered by `@karmaniverous/entity-tools`)
- Filtering via a plain predicate function
- Pagination via `limit` + `pageKey`

## Behavior cheat sheet (important invariants)

### Scan vs query

- If `hashKey` + `hashValue` are both provided, results are restricted to items where `item[hashKey] === hashValue`.
- If either is omitted, behavior is a “scan” across all items (still with optional sort/filter/limit).

### Order of operations (as implemented)

For `querySync` (and therefore `query`):

1. Clone the internal array (shallow): `items = [...data]`
2. If `hashKey` is provided, partition-filter using strict equality
3. If `sortOrder` is provided, sort the full candidate set
4. If `pageKey` is provided, find its index by matching *all entries* in the `pageKey` object against each candidate item
5. Iterate in order and apply:
   - “start after page key” (`i > pageKeyIndex`)
   - `filter(item)` if provided
   - `limit` (counts only items that pass the filter)
6. If `limit` was reached, return a `pageKey` derived from the last returned item

### Pagination: `pageKey` and `indexComponents`

- When a page is full (`items.length === limit`), a `pageKey` is returned for the *last returned item*.
- If `indexComponents` is provided, the returned `pageKey` includes only those properties (via `pick`).
- On the next call, `pageKey` is resolved by finding the first item whose matching properties equal the entries in the provided `pageKey`.

Practical guidance:

- Choose `indexComponents` that uniquely identify an item in the sorted candidate set (e.g., partition key + sort key).
- If `indexComponents` are not unique, pagination may skip or repeat items because `findIndex` will match the first item with those properties.

### Filtering

- `filter` is a plain function `(item) => unknown`, treated as truthy/falsy.
- There is no DynamoDB expression syntax and no attribute name/value substitution.

### Sorting

- Sorting is delegated to `@karmaniverous/entity-tools` (`sort(items, sortOrder)`).
- Sorting happens before pagination and before the `filter`/`limit` accumulation step.

### Async timing

- `query(...)` is `querySync(...)` plus a normally-distributed delay (clamped to `>= 0` ms).
- You can override delay per call: `query(options, delayMean?, delayStd?)`.
- Prefer `querySync` for deterministic unit tests unless you are explicitly testing async code paths.

## Minimal usage examples

### Install

```bash
npm i -D @karmaniverous/mock-db
```

### Scan (no partition restriction)

```ts
import type { Entity } from '@karmaniverous/mock-db';
import { MockDb } from '@karmaniverous/mock-db';

interface User extends Entity {
  partition: string;
  id: number;
  name: string;
}

const users: User[] = [
  { partition: 'a', id: 2, name: 'Charlie' },
  { partition: 'a', id: 1, name: 'Dave' },
  { partition: 'b', id: 3, name: 'Bob' },
];

const db = new MockDb(users);

const page = db.querySync({
  sortOrder: [{ property: 'id' }],
  filter: (u) => u.id >= 2,
});

// page.count === 2
// page.items are sorted and filtered
// page.pageKey === undefined (no limit)
```

### Query + pagination (partition restriction)

```ts
import type { Entity } from '@karmaniverous/mock-db';
import { MockDb, type QueryOptions } from '@karmaniverous/mock-db';

interface User extends Entity {
  partition: string;
  id: number;
  name: string;
}

const users: User[] = [
  { partition: 'a', id: 3, name: 'Alice' },
  { partition: 'a', id: 2, name: 'Charlie' },
  { partition: 'a', id: 1, name: 'Dave' },
  { partition: 'b', id: 4, name: 'Bob' },
];

const db = new MockDb(users);

const opts: QueryOptions<User> = {
  hashKey: 'partition',
  hashValue: 'a',
  sortOrder: [{ property: 'id' }],
  limit: 2,
  indexComponents: ['partition', 'id'],
};

const page1 = db.querySync(opts);
// page1.items: ids 1, 2
// page1.pageKey: { partition: 'a', id: 2 }

const page2 = db.querySync({ ...opts, pageKey: page1.pageKey });
// page2.items: id 3
// page2.pageKey: undefined
```

## Practical guidance (for assistants)

- Treat `MockDb` as a test helper: do not add “real DB” features (transactions, persistence, expression parsing) unless explicitly required.
- When tests need deterministic behavior, prefer `querySync`.
- When pagination is involved, always ensure `indexComponents` are stable and uniquely identify items (especially if sorting keys are not unique).
- Keep examples and docs aligned with exported types from `src/index.ts` (consumers import from `@karmaniverous/mock-db`).
