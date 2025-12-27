# STAN assistant guide — @karmaniverous/entity-tools

This guide is a compact, self-contained reference for assistants (and humans) integrating `@karmaniverous/entity-tools` into TypeScript projects. It focuses on the library’s contracts, invariants, and minimum working patterns.

## What this package provides

- Runtime utilities:
  - `sort(items, sortOrder)` — progressive sort over entity properties.
  - `updateItem(item, update)` — shallow updates with null/undefined conventions.
  - `isNil(value)` / `Nil` — nil guard + alias (`null | undefined`).
  - `conditionalize(fn, condition?)` — gate function execution on a truthy condition.
- Transcoding utilities:
  - `defineTranscodes(spec)` — inference-first transcoder registry builder with compile-time encode/decode agreement.
  - `defaultTranscodes` / `DefaultTranscodeRegistry` — ready-made registry for common value types.
  - Type helpers for registry/name/value selection (see “Transcoding” below).
- Small, generic helpers:
  - KV codec: `encodePairs`, `decodePairs`.
  - Sharding math: `hashString`, `enumerateShardSuffixes`, `shardSuffixFromHash`.

## Installation

```bash
npm i @karmaniverous/entity-tools
```

## Entities and sorting

### sort(items, sortOrder)

- Sorts progressively by keys in `sortOrder`; later keys break ties from earlier keys.
- Comparison rules:
  - `number`, `string`, `bigint`: compared naturally.
  - `null`/`undefined`: treated as equivalent and sort before any defined value.
  - Other types: compared by truthiness (truthy > falsy).

Minimal example:

```ts
import { sort, type SortOrder } from '@karmaniverous/entity-tools';

type User = {
  id: number;
  name: string;
  optional?: string | null;
};

const users: User[] = [
  { id: 2, name: 'Adam', optional: 'foo' },
  { id: 4, name: 'Adam' },
  { id: 1, name: 'Charlie', optional: null },
];

const order: SortOrder<User> = [
  { property: 'name' },
  { property: 'id', desc: true },
];

const out = sort(users, order);
```

### defineSortOrder (DX helper)

Use `defineSortOrder<E>()` when you want TypeScript to preserve property-name literals (and error on invalid property names) at the call site:

```ts
import { defineSortOrder, type Entity } from '@karmaniverous/entity-tools';

type E = Entity & { x: number; y: string };

const so = defineSortOrder<E>([{ property: 'x' }]);
// @ts-expect-error
defineSortOrder<E>([{ property: 'z' }]);
```

## Shallow updates

### updateItem(item, update)

Update conventions:

- `undefined` in `update` is ignored.
- `null` in `update` is assigned during merge, then stripped from the final result (along with `undefined`).
- The result has no `null`/`undefined` properties (they are removed).
- Does not mutate inputs.

```ts
import { updateItem } from '@karmaniverous/entity-tools';

const original = { id: 1, name: 'Alice', note: undefined as string | undefined };
const patch = { name: 'Alicia', note: null, extra: undefined as string | undefined };

const updated = updateItem(original, patch);
// => { id: 1, name: 'Alicia' }
```

## Transcoding (value ↔ string)

### Mental model

- A **Transcoder<V>** is `{ encode: (value: V) => string; decode: (value: string) => V }`.
- A **TranscodeRegistry** type maps transcode names to the value type they encode:
  - Example: `{ int: number; bool: boolean }`.
- A **Transcodes<TR>** value maps the same keys to `{ encode, decode }` functions.

### defineTranscodes(spec): inference-first builder (and safety net)

`defineTranscodes` is an identity function at runtime, but its *type signature* enforces:

- each entry has `encode(value) => string`,
- each entry has `decode(string) => V`,
- and **the encode parameter type must exactly match the decode return type** (bi-directional agreement).

Example (inference-first):

```ts
import { defineTranscodes } from '@karmaniverous/entity-tools';
import type {
  TranscodeRegistryFrom,
  TranscodedType,
  TranscodeName,
} from '@karmaniverous/entity-tools';

const spec = {
  int: {
    encode: (v: number) => v.toString(),
    decode: (s: string) => Number(s),
  },
  boolean: {
    encode: (v: boolean) => (v ? 't' : 'f'),
    decode: (s: string) => s === 't',
  },
} as const;

const transcodes = defineTranscodes(spec);

type TR = TranscodeRegistryFrom<typeof spec>;
type Names = TranscodeName<TR>; // 'int' | 'boolean'
type TInt = TranscodedType<TR, 'int'>; // number
```

If encode/decode disagree, TypeScript will error at the call site (this is intentionally strict).

### defaultTranscodes

`defaultTranscodes` implements a standard set of transcoders:

- `boolean`: `"t"` / `"f"`
- `string`: identity
- `number`: decimal string
- `fix6`: fixed width with 6 decimals, signed, lexicographically sortable
- `int`: fixed width signed integer (16 digits), lexicographically sortable
- `bigint`: decimal string
- `bigint20`: fixed width signed BigInt up to 20 digits, lexicographically sortable
- `timestamp`: 13-digit unix millis (0..9999999999999), zero-padded

```ts
import { defaultTranscodes } from '@karmaniverous/entity-tools';

const s = defaultTranscodes.int.encode(-123);   // "n0000000000000123"
const n = defaultTranscodes.int.decode(s);      // -123
```

## KV codec helpers (generic)

These helpers do not escape delimiters; callers must choose delimiters that do not appear in keys/values if round-trip safety is required.

```ts
import { encodePairs, decodePairs } from '@karmaniverous/entity-tools';

const pairs: Array<[string, string]> = [
  ['k1', 'v1'],
  ['k2', ''],
];

const enc = encodePairs(pairs); // "k1#v1|k2#"
const dec = decodePairs(enc);   // pairs
```

## Sharding math helpers (generic)

```ts
import {
  hashString,
  enumerateShardSuffixes,
  shardSuffixFromHash,
} from '@karmaniverous/entity-tools';

const h = hashString('hello'); // 32-bit unsigned number
const hex2 = enumerateShardSuffixes(16, 2); // ["00", ..., "ff"]
const suffix = shardSuffixFromHash(h, 16, 2); // e.g. "a3"
```

## Practical guidance (for assistants)

- Prefer `defineTranscodes` when introducing any new transcoding map: it provides the strongest DX and prevents silent mismatches.
- Use fixed-width encodings (like `int`, `fix6`, `bigint20`, `timestamp`) when you need lexicographic ordering to match numeric ordering.
- Avoid relying on KV codec escaping (it does none); validate/choose delimiters at a higher level.
- Keep `SortOrder` descriptors type-safe with `defineSortOrder` when authoring reusable sort descriptors.

