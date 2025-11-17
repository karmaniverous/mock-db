# Entity Tools — Requirements (authoritative)

Scope and goals

- Entity Tools is a small, dependency-light toolkit (runtime dependency: radash) providing:
  - Type-level utilities for entities and property selection.
  - Runtime utilities for sorting, shallow updates, nil checks, and conditional execution.
  - A robust, inference-first model for value↔string transcoding.
- This release prioritizes type inference and DX over backward compatibility.
- No changes to runtime semantics of existing utilities beyond new helpers introduced here.

High-level objectives for this release

- Introduce a value-first, inference-preserving transcode registry builder with compile-time agreement between encoder and decoder types.
- Establish canonical transcode vocabulary and acronym exports for consistency across dependent packages.
- Promote provider-agnostic helpers from downstream usage into this library when they are generic (KV pair codec; sharding math primitives).
- Keep default transcoding behavior intact; define defaults using the new builder.

Transcoding model (inference-first)

- Transcoder<V>
  - Shape: { encode: (value: V) => string; decode: (value: string) => V }.
  - encode must return string; decode must accept string and return V.

- TranscodeRegistry (canonical; replaces TranscodeMap as preferred name)
  - A mapping from transcode name to the value type it encodes (e.g., { int: number; bigint20: bigint }).
  - No compatibility alias is provided.

- Transcodes<TR extends TranscodeRegistry>
  - The runtime registry interface mapping each transcode name to its { encode, decode } implementation with consistent value types inferred from TR.
  - Keys are exact (Exactify) and string-literal preserving.

- TranscodedType<TR extends TranscodeRegistry, TN extends TranscodeName<TR>>
  - Convenience alias that extracts the value type for a specific transcode name within a registry:
    - TranscodedType<TR, 'int'> resolves to TR['int'].
  - Complements TranscodeRegistryFrom<T> for value-type access at the name level.

- TranscodeRegistryFrom<T extends Record<string, Transcoder<any>>>
  - Derives a TranscodeRegistry type from a record of transcoders by mapping each key to ReturnType<decode>.
  - Example: TranscodeRegistryFrom<{ fix6: Transcoder<number> }> = { fix6: number }.

- TranscodeName<TR extends TranscodeRegistry>
  - Union of valid transcode names for a registry: keyof Exactify<TR> & string.

- defineTranscodes (value-first, compile-time agreement)
  - Signature (conceptual):
    - defineTranscodes<const T extends Record<string, Transcoder<any>>>(
      spec: T & EncodeDecodeAgreement<T>
      ): Transcodes<TranscodeRegistryFrom<T>>
  - Guarantees:
    - Preserves literal keys from spec (const).
    - Returns a strongly-typed Transcodes<…> object.
    - Enforces compile-time agreement per key K:
      - Parameter type of spec[K].encode is identical (bi-directionally assignable) to ReturnType<spec[K].decode>.
      - spec[K].encode returns string, and spec[K].decode accepts string.
    - Violations cause the spec argument to be unsatisfiable in TypeScript, surfacing a type error at the call site.

Default transcodes (unchanged behavior, builder-authored)

- The default registry is authored via defineTranscodes and must maintain existing semantics:
  - Keys: boolean, string, number, fix6, int, bigint, bigint20, timestamp.
  - boolean: "t"/"f" (fixed width).
  - string: identity (variable width).
  - number: decimal string (variable width).
  - fix6: signed fixed width with 6 decimals ("p"/"n" prefix), padded; lexicographic order matches numeric order.
  - int: signed fixed-width 16-digit integer ("p"/"n" prefix), padded; lexicographic order matches numeric order.
  - bigint: decimal string (variable width).
  - bigint20: signed fixed-width up to 20 digits ("p"/"n" prefix); lexicographic order matches numeric order.
  - timestamp: fixed-width 13-digit UNIX milliseconds, zero-padded; non-negative, ≤ 9999999999999.
- Encoders throw on invalid inputs; decoders throw on invalid encoded strings.
- Canonical naming (no compatibility aliases):
  - DefaultTranscodeRegistry (canonical).
  - defaultTranscodes must be exported as Transcodes<DefaultTranscodeRegistry> built with defineTranscodes.

Extended acronym exports (entity-agnostic)

- EM = EntityMap (alias to existing type)
- E = Entity (alias to existing type)
- TR = TranscodeRegistry (canonical)
- TN<TR> = TranscodeName<TR>
- PK = PropertyKey (utility alias)
- V<T> = T (utility placeholder; usable in generic docs/examples)

These are purely types/aliases for consistency across repos. Entity-manager–specific acronyms tied to captured config or index semantics (e.g., CC, ET, IT, ITS, EIBT, ERBT, etc.) remain downstream.

KV pair codec helpers (generic)

- Purpose: generic string composition/parsing of key-value pairs used in multiple contexts; no assumptions about delimiters beyond caller’s choice.
- encodePairs(pairs, options?)
  - Signature: encodePairs(pairs: Array<[string, string]>, options?: { pair?: string; kv?: string }): string
  - Defaults: pair = "|", kv = "#".
  - Behavior:
    - Produces "k#v|k#v|…", using options.kv between key/value and options.pair between pairs.
    - Does not escape delimiters; callers must choose non-overlapping, non-word delimiters if round-trip safety is required.
    - Keys and values are used as-is (no trimming; empty strings are allowed).
    - Empty input returns "" (empty string).
- decodePairs(serialized, options?)
  - Signature: decodePairs(serialized: string, options?: { pair?: string; kv?: string }): Array<[string, string]>
  - Defaults: pair = "|", kv = "#".
  - Behavior:
    - Splits serialized into pairs on options.pair (empty string -> []).
    - For each pair:
      - If exactly one kv delimiter is found, returns [key, value] (key/value may be empty).
      - If zero or multiple kv delimiters are found, throws Error("invalid pair").
    - Returns [] for "" (empty string).
  - Notes:
    - Delimiter validation policy (e.g., /\W+/, containment checks) is out of scope here and belongs to higher-level config validation where needed.

Sharding math primitives (generic; no config coupling)

- Purpose: reusable building blocks for shard-space computation; purely mathematical, no knowledge of entity tokens or time windows.
- hashString(value: string): number
  - Stable, non-cryptographic 32-bit unsigned hash (e.g., FNV‑1a).
  - Returns an integer in [0, 2^32 - 1]; computed deterministically from value.
- enumerateShardSuffixes(radix: number, chars: number): string[]
  - Preconditions: integer radix in [2..36], integer chars ≥ 0.
  - Behavior:
    - Let space = radix \*\* chars.
    - Returns an array of length space with strings "0".."(space-1)" converted via n.toString(radix), left-padded to length chars with "0".
    - For chars = 0, returns [""] (single empty suffix).
- shardSuffixFromHash(hash: number, radix: number, chars: number): string
  - Preconditions: integer radix in [2..36], integer chars ≥ 0, hash coerced to 32-bit unsigned (hash >>> 0).
  - Behavior:
    - Let space = radix \*\* chars.
    - Let idx = hash % space.
    - Return idx.toString(radix).padStart(chars, "0") ("" for chars = 0).

Sort helpers (stable typing)

- Purpose: preserve property literal unions in progressive sort descriptors and improve DX without changing runtime behavior.
- defineSortOrder<E extends Entity>(so: SortOrder<E>): SortOrder<E>
  - Identity helper that enforces SortOrder<E> while preserving property-name literal types at call sites.
  - No runtime changes; purely a typing/DX affordance.

Existing runtime utilities (unchanged)

- sort(items, sortOrder)
  - Stable, progressive sort on Entity properties; comparisons follow: number, string, bigint; null/undefined sort before any value; otherwise truthiness fallback; supports desc per key.
- updateRecord(record, update)
  - Shallow update ignoring undefined, assigning null, removing null/undefined; does not mutate inputs.
- isNil(value) / Nil
  - Type guard and alias for null | undefined.
- conditionalize(fn, condition?)
  - Wrap function; returns a function that calls fn only when condition is truthy; otherwise returns undefined.

Existing type utilities (unchanged)

- Entities and selection
  - Entity, EntityMap, Exactify, EntityKeys<E>, EntityValue<E, K>, EntityMapValues<M>, FlattenEntityMap<M>.
- Property transforms
  - MakeOptional<T, K>, MakeRequired<T, K>, MakeUpdatable<T, K>, WithRequiredAndNonNullable<T, K>.
- Property filtering
  - PropertiesOfType<O, T>, PropertiesNotOfType<O, T>.
- Transcoding filters
  - TranscodableProperties<O, TR>, UntranscodableProperties<O, TR>.
- Key replacement
  - ReplaceKey<T, K, R>, ReplaceKeys<T, R>.
- Compile-time guards
  - MutuallyExclusive<T>, AllDisjoint<First, Rest>, NotNever<T, Keys>.
- Sorting
  - SortOrder<E>.
- Transcoding shapes
  - Transcodes<TR>.

Canonical naming and exports (requirements)

- Exports must include:
  - New types: Transcoder<V>, TranscodeRegistry (canonical), TranscodeRegistryFrom<T>, TranscodeName<TR>, TranscodedType<TR, TN>.
  - New builder: defineTranscodes.
  - New helpers: encodePairs, decodePairs, hashString, enumerateShardSuffixes, shardSuffixFromHash.
  - New sort helper: defineSortOrder<E>(so: SortOrder<E>): SortOrder<E>.
  - Extended acronyms: EM, E, TR, TN, PK, V.
  - Default registry types: DefaultTranscodeRegistry (canonical).
  - defaultTranscodes authored via defineTranscodes (no behavior changes vs prior implementation).
- Typedoc/README must document:
  - How to author a custom registry with defineTranscodes (value-first).
  - How to infer TR via TranscodeRegistryFrom<typeof myTranscodes>.
  - How to use TN<TR>, TranscodedType<TR, TN>, and Transcodes<TR>.
  - How to use the KV codec and sharding math helpers (short examples).
  - How to use defineSortOrder for typed sort descriptors.
  - No migration notes; describe current behavior only.

Type-level enforcement (requirements)

- defineTranscodes must encode agreement via type constraints:
  - For each key K in the input spec:
    - encode: (value: VK) => string
    - decode: (value: string) => VK
    - VK must be identical in both positions (bi-directional assignability).
  - Violations must be caught at compile time (tsd tests validate).

Runtime behavior and constraints

- No change to the behavior of existing default transcodes, sort, updateRecord, isNil, conditionalize.
- New helpers:
  - encodePairs/decodePairs: pure string manipulation; throw on malformed pairs during decode; no delimiter validation beyond arity; no trimming.
  - hashString: stable 32-bit unsigned integer from input; implementation must be deterministic; performance-appropriate for library usage.
  - enumerateShardSuffixes/shardSuffixFromHash: strictly base conversion and padding per requirements above.
  - defineSortOrder: pure typing helper; identity at runtime.

Acceptance criteria

- New builder and types exported:
  - defineTranscodes, Transcoder, TranscodeRegistry, TranscodeRegistryFrom, TranscodeName, TranscodedType.
  - Acronyms: EM, E, TR, TN, PK, V.
- defaultTranscodes implemented via defineTranscodes with unchanged encode/decode semantics and errors.
- New helpers exported with unit tests:
  - encodePairs/decodePairs (round-trip on well-formed input; throws on invalid pair shapes).
  - hashString (basic invariants tests), enumerateShardSuffixes, shardSuffixFromHash (known examples and edge cases).
- Sort helper exported with compile-time tests:
  - defineSortOrder<E> compiles for valid SortOrder<E> and preserves property-literal unions.
- tsd tests cover:
  - defineTranscodes inference of registry type.
  - Compile-time errors for encode/decode mismatches.
  - TN<TR> produces the expected string-literal union.
  - TranscodedType<TR, TN> resolves to the correct value type.
- README/Typedoc updated with concise examples demonstrating the above.
- Lint, typecheck, tests, docs, and build succeed via repository scripts.

Non-requirements (out of scope)

- Entity-manager–specific config/index/page-key semantics (e.g., CC, ET, IT/ITS, pagination) remain downstream.
- Delimiter policy validation (e.g., /\W+/, containment checks) is not provided here; such checks belong to calling code or downstream packages.
