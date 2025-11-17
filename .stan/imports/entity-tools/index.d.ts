/**
 * Transforms a function such that it only executes when `condition` is truthy.
 *
 * @param fn - The function to conditionally execute.
 * @param condition - The condition to check before executing `fn`.
 *
 * @typeParam F - The type of the function to conditionally execute.
 *
 * @returns The conditionalized function with the same signature as `fn`.
 *
 * @category Utilities
 */
declare function conditionalize<F extends (...args: Parameters<F>) => ReturnType<F>>(fn: F, condition?: unknown): (...args: Parameters<F>) => ReturnType<F> | undefined;

/**
 * Return a type with required property K of type O if C is not `never`, otherwise return a type where K is optional or accepts an empty object.
 *
 * @typeParam K - The property key.
 * @typeParam C - The condition to check.
 * @typeParam O - The type of the property.
 *
 * @category Utilities
 */
type ConditionalProperty<K extends PropertyKey, C, O extends object> = [
    C
] extends [never] ? Record<K, never> | Partial<Record<K, Record<PropertyKey, never>>> : Record<K, O>;

/**
 * Relates transcodable property keys to the types transcoded.
 *
 * @example
 * ```
 * interface MyTranscodeRegistry extends TranscodeRegistry {
 *   fix6: number;
 *   boolean: boolean;
 * }
 * ```
 * @category Transcoding
 */
type TranscodeRegistry = object;

/**
 * Default {@link TranscodeRegistry | `TranscodeRegistry`} supporting {@link defaultTranscodes | `defaultTranscodes`}.
 *
 * @see {@link Transcodes | `Transcodes`}
 *
 * @category Transcoding
 */
interface DefaultTranscodeRegistry extends TranscodeRegistry {
    /**
     * Supports variable-width transcoding of `BigInt` values. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    bigint: bigint;
    /**
     * Supports fixed-width transcoding of `BigInt` values of up to 20 digits. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    bigint20: bigint;
    /**
     * Supports fixed-width transcoding of `boolean` values. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    boolean: boolean;
    /**
     * Supports fixed-width transcoding of `number` values with up to 6 decimal places. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    fix6: number;
    /**
     * Supports fixed-width transcoding of integer values. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    int: number;
    /**
     * Supports variable-width transcoding of number values. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    number: number;
    /**
     * Supports variable-width transcoding of `string` values. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    string: string;
    /**
     * Supports fixed-width transcoding of UNIX timestamp values. See {@link defaultTranscodes | `defaultTranscodes`} for implementation details.
     */
    timestamp: number;
}

/**
 * Strips unspecified properties like `[x: string]: unknown` from `Record` types.
 *
 * @typeParam O - The `Record` type.
 *
 * @returns The `Record` type with only specified properties.
 *
 * @category Utilities
 */
type Exactify<O extends object> = {
    [P in keyof O as string extends P ? never : number extends P ? never : symbol extends P ? never : P]: O[P];
};

/**
 * Maps transcode keys to their respective encoding and decoding functions.
 *
 * @typeParam TR - The {@link TranscodeRegistry | `TranscodeRegistry`} type.
 *
 * @remarks
 * The keys of this object must exactly match the keys of the {@link TranscodeRegistry | `TranscodeRegistry`}.
 *
 * Each `encode` function must take the mapped type as an argument and return a `string`. Invalid values should throw an error.
 *
 * Each `decode` function must take a `string` as an argument and return the mapped type.
 *
 * Encoded strings should be articulated such that they sort alphanumerically in the same order as the mapped type. Numerical values should therefore be encoded at a foxed length.
 *
 * @example
 * ```
 * interface MyTranscodeRegistry extends TranscodeRegistry {
 *   fix6: number;
 * }
 *
 * const myTranscodes: Transcodes<MyTranscodeRegistry> = {
 *   fix6: {
 *     encode: (value) => {
 *       if (
 *         !isNumber(value) ||
 *         value > Number.MAX_SAFE_INTEGER / 1000000 ||
 *         value < Number.MIN_SAFE_INTEGER / 1000000
 *       )
 *         throw new Error('invalid fix6');
 *
 *       const [prefix, abs] = value < 0 ? ['n', -value] : ['p', value];
 *
 *       return `${prefix}${abs.toFixed(6).padStart(17, '0')}`;
 *     },
 *     decode: (value) => {
 *       if (!isString(value) || !/^[np][0-9]{10}\.[0-9]{6}$/.test(value))
 *         throw new Error('invalid encoded fix6');
 *
 *       return (value.startsWith('n') ? -1 : 1) * Number(value.slice(1));
 *     },
 *   },
 * };
 *
 * console.log(myTranscodes.fix6.encode(-123.45));              //  n0000000123.450000
 * console.log(myTranscodes.fix6.encode(123.45));               //  p0000000123.450000
 * console.log(myTranscodes.fix6.encode(100000000000123.45));   //  throws error
 * console.log(myTranscodes.fix6.encode('foo'));                //  throws error
 *
 * console.log(myTranscodes.fix6.decode('n0000000123.450000')); // -123.45 (number)
 * console.log(myTranscodes.fix6.decode('p0000000123.450000')); //  123 (number)
 * console.log(myTranscodes.fix6.decode('q0000000123.450000')); //  throws error
 * console.log(myTranscodes.fix6.decode('foo'));                //  throws error
 * ```
 *
 * @category Transcoding
 */
type Transcodes<TR extends TranscodeRegistry> = {
    [P in keyof Exactify<TR>]: {
        encode: (value: TR[P]) => string;
        decode: (value: string) => TR[P];
    };
};

/**
 * A default set of {@link Transcodes | `Transcodes`} supporting {@link DefaultTranscodeRegistry | `DefaultTranscodeRegistry`}. These can be extended as needed by consuming applications.
 *
 * See {@link https://github.com/karmaniverous/entity-tools/blob/main/src/defaultTranscodes.ts | implementation details}.
 *
 * @category Transcoding
 */
declare const defaultTranscodes: Transcodes<DefaultTranscodeRegistry>;

/**
 * The base Entity type. Supports string keys with any value. Derived types will accept unspecified string keys. All Entities should extend this type.
 *
 * NOTE: This type is essential to support document databases that can accept unknown keys. It does NOT play well with the {@link Omit | `Omit`} utility type! Use {@link MakeOptional | `MakeOptional`} instead.
 *
 * @category Entities
 */
type Entity = Record<string, unknown>;

/**
 * Specifies progressive sorting on properties of an {@link Entity | `Entity`} type.
 *
 * @typeParam E - {@link Entity | `Entity`} type.
 *
 * @category Sort
 */
type SortOrder<E extends Entity> = {
    property: keyof Exactify<E>;
    desc?: boolean;
}[];

/**
 + Identity helper that enforces SortOrder<E> at the call site while preserving
 + property literal unions for better inference and DX.
 */
declare function defineSortOrder<E extends Entity>(so: SortOrder<E>): SortOrder<E>;

/**
 * The base EntityMap type. All EntityMaps should extend this type.
 *
 * @category Entities
 */
type EntityMap = Record<string, Entity>;

/**
 * Returns the keys of an {@link Entity | `Entity`} type.
 *
 * @typeParam E - The {@link Entity | `Entity`} type.
 *
 * @category Entities
 * @protected
 */
type EntityKeys<E extends Entity> = E extends E ? keyof E : never;
/**
 * Returns the value type of a property `P` of an {@link Entity | `Entity`} type.
 *
 * @typeParam E - The {@link Entity | `Entity`} type.
 * @typeParam P - The property key.
 *
 * @category Entities
 * @protected
 */
type EntityValue<E extends Entity, PK extends PropertyKey> = E extends Record<PK, infer V> | Partial<Record<PK, infer V>> ? V : never;
/**
 * Returns a union of exactified entity types in an {@link EntityMap | `EntityMap`}.
 *
 * @typeParam EM - The {@link EntityMap | `EntityMap`} type.
 *
 * @category Entities
 * @protected
 */
type EntityMapValues<EM extends EntityMap> = {
    [P in keyof EM]: Exactify<EM[P]>;
}[keyof Exactify<EM>];
/**
 * Flattens an {@link EntityMap | `EntityMap`} into a single object with matching key types unionized.
 *
 * @typeParam EM - The {@link EntityMap | `EntityMap`} to flatten.
 *
 * @category Entities
 */
type FlattenEntityMap<EM extends EntityMap> = {
    [K in EntityKeys<EntityMapValues<EM>>]: EntityValue<EntityMapValues<EM>, K>;
};

/**
 * Makes specified properties of `T` optional.
 *
 * @typeParam T - The type to make properties optional.
 * @typeParam U - The properties to make optional.
 *
 * @category Utilities
 */
type MakeOptional<T extends object, U extends keyof T> = {
    [P in keyof T as P extends U ? never : P]: T[P];
} & Partial<Pick<T, U>>;

/**
 * Makes specified properties of `T` required.
 *
 * @typeParam T - The type to make properties required.
 * @typeParam U - The properties to make required.
 *
 * @category Utilities
 */
type MakeRequired<T extends object, U extends keyof T> = {
    [P in keyof T as P extends U ? never : P]: T[P];
} & Required<Pick<T, U>>;

/**
 * Makes all properties of `T` except for `U` optional and, if originally optional, nullable. Makes `U` required.
 *
 * @typeParam T - The type to make updatable.
 * @typeParam U - The properties to reserve as required.
 *
 * @category Utilities
 */
type MakeUpdatable<T extends object, U extends keyof T = never> = {
    [P in keyof T as P extends U ? never : P]+?: undefined extends T[P] ? T[P] | null : T[P];
} & Required<Pick<T, U>>;

/**
 * Returns `true` if there is no intersection between `First` the elements of `Rest`.
 *
 * @typeParam First - A `string` type
 * @typeParam Rest - A tuple of `string` types
 *
 * @returns `true` if there is no intersection between `First` the elements of `Rest`, otherwise a custom error type.
 *
 * @example
 * ```ts
 * type ReturnsTrue = AllDisjoint<'a', ['b' | 'c', 'd']>;
 * // true
 *
 * type ReturnsError = AllDisjoint<'c', ['b' | 'c', 'c']>;
 * // { __error__: 'overlaps on c' }
 * ```
 *
 * @category Utilities
 * @protected
 */
type AllDisjoint<First extends string, Rest extends string[]> = Rest extends [infer Head, ...infer Tail] ? [Head] extends [string] ? [First & Head] extends [never] ? AllDisjoint<First, Tail extends string[] ? Tail : []> : {
    __error__: `overlaps on ${First}`;
} : true : true;
/**
 * Returns `true` if there is no intersection between the elements of `T`.
 *
 * @typeParam T - The tuple of string types to check for mutual exclusivity.
 *
 * @returns `true` if there is no intersection between the elements of `T`, otherwise a custom error type.
 *
 * @example
 * ```ts
 * type ReturnsTrue = MutuallyExclusive<['a', 'b' | 'c', 'd']>;
 * // true
 *
 * type ReturnsError = MutuallyExclusive<['a', 'b' | 'c', 'c']>;
 * // { __error__: 'overlaps on c' }
 * ```
 *
 * @category Utilities
 */
type MutuallyExclusive<T extends string[]> = T extends [
    infer Head,
    ...infer Tail
] ? [Head] extends [string] ? Tail extends string[] ? [Head] extends [never] ? MutuallyExclusive<Tail> : AllDisjoint<Head & string, Tail> extends true ? MutuallyExclusive<Tail> : AllDisjoint<Head & string, Tail> : true : true : true;

/**
 * A `null` or `undefined` value.
 *
 * @category Utilities
 */
type Nil = null | undefined;
/**
 * Tests whether a value is {@link Nil | `Nil`}.
 *
 * @param value - Value.
 *
 * @returns true if `value` is `null` or `undefined`.
 *
 * @category Utilities
 */
declare const isNil: (value: unknown) => value is Nil;

/**
 * Returns `true` if no property of `T` indicated in `N` has a `never` type.
 *
 * @typeParam T - The `object` type to check for `never` properties.
 * @typeParam N - A tuple of keys of `T` to check for `never` type.
 *
 * @returns `true` if no property of `T` indicated in `N` has a `never` type, otherwise a custom error type.
 *
 * @example
 * ```ts
 * type ReturnsTrue = NotNever<{ a: string; b: number; c: boolean }, ['b', 'c']>;
 * // true
 *
 * type ReturnsError = NotNever<{ a: string; b: number; c: never }, ['b', 'c']>;
 * // { __error__: 'c is never' }
 * ```
 *
 * @category Utilities
 */
type NotNever<T extends object, N extends (string & keyof T)[]> = N extends [infer Head, ...infer Tail] ? Head extends string & keyof T ? [T[Head]] extends [never] ? {
    __error__: `${Head} is never`;
} : Tail extends string[] ? NotNever<T, Tail extends (string & keyof T)[] ? Tail : []> : true : true : true;

/**
 * Returns the properties of `object` `O` with types that do not extend type `V`. Ignores `undefined` types.
 *
 * @typeParam O - The 'object' type.
 * @typeParam V - The type to filter by.
 *
 * @category Utilities
 */
type PropertiesNotOfType<O extends object, V> = keyof {
    [Property in keyof Exactify<O> as [V] extends [never] ? [NonNullable<Exactify<O>[Property]>] extends [never] ? never : Property : [NonNullable<Exactify<O>[Property]>] extends [never] ? never : NonNullable<Exactify<O>[Property]> extends V ? never : Property]: never;
} & string;

/**
 * Returns the properties of `object` `O` with types that extend type `V`. Ignores `undefined` types.
 *
 * @typeParam O - The `object` type.
 * @typeParam V - The type to filter by.
 *
 * @category Utilities
 */
type PropertiesOfType<O extends object, V> = keyof {
    [Property in keyof O as [V] extends [never] ? [NonNullable<O[Property]>] extends [never] ? Property : never : [NonNullable<O[Property]>] extends [never] ? never : NonNullable<O[Property]> extends V ? Property : never]: never;
};

/**
 * Replace the type at a key in an object type.
 *
 * @typeParam T - The object type to modify.
 * @typeParam K - The key to replace.
 * @typeParam R - The type to replace the key with.
 *
 * @category Utilities
 */
type ReplaceKey<T extends object, K extends keyof T, R> = Omit<T, K> & Record<K, R>;

/**
 * Replace the keys in an object type with the same keys in a replacement type.
 *
 * @typeParam T - The object type to modify.
 * @typeParam R - The source of replacement keys.
 *
 * @category Utilities
 */
type ReplaceKeys<T extends object, R extends object> = Omit<T, keyof T & keyof R> & Pick<R, keyof T & keyof R>;

/**
 * Sort an array of `Item` progressively by `sort`.
 *
 * @typeParam Item - Item type. Must extend {@link Entity | `Entity`}.
 *
 * @param items - Array of `Item`.
 * @param sortOrder - {@link SortOrder | `SortOrder`} array.
 *
 * @returns Sorted `items`.
 *
 * @remarks
 * Sorts `items` progresively by the elements of `sortOrder`, passing to the next element if values at the current element are equal.
 *
 * Comparisons are made as expected for `number`, `string`, and `bigint` types.
 *
 * `null` and `undefined` values are considered equivalent and less than any other value.
 *
 *  Other types are compared by truthiness, where truthy is greater than falsy.
 *
 * @category Sort
 */
declare const sort: <Item extends Entity>(items?: Item[], sortOrder?: SortOrder<Item>) => Item[];

/**
 * Returns the properties of an {@link Entity | `Entity`} or {@link EntityMap | `EntityMap`} whose types are covered by {@link TranscodeRegistry | `TranscodeRegistry`} `TR`.
 *
 * @typeParam O - The {@link Entity | `Entity`} or {@link EntityMap | `EntityMap`} type.
 * @typeParam TR - The {@link TranscodeRegistry | `TranscodeRegistry`}.
 *
 * @category Transcoding
 * @category Entities
 */
type TranscodableProperties<O extends EntityMap | Entity, TR extends TranscodeRegistry> = PropertiesOfType<O extends EntityMap ? FlattenEntityMap<O> : O, TR[keyof Exactify<TR>]> & string;

/**
 * Returns the properties of an {@link Entity | `Entity`} or {@link EntityMap | `EntityMap`} whose types are not covered by {@link TranscodeRegistry | `TranscodeRegistry`} `TR`.
 *
 * @typeParam O - The {@link Entity | `Entity`} or {@link EntityMap | `EntityMap`} type.
 * @typeParam TR - The {@link TranscodeRegistry | `TranscodeRegistry`}.
 *
 * @category Transcoding
 * @category Entities
 */
type UntranscodableProperties<O extends EntityMap | Entity, TR extends TranscodeRegistry> = PropertiesNotOfType<O extends EntityMap ? FlattenEntityMap<O> : O, TR[keyof Exactify<TR>]>;

/**
 * Creates a shallow update of `record` with the properties of `update` according to the following conventions:
 *
 * * `record` and `update` must be compatible types.
 * * `undefined` properties in `update` are ignored.
 * * `null` properties in `update` are assigned to `record`.
 * * All `undefined` and `null` properties in the resulting update are removed.
 *
 * Does not mutate `record` or `update`.
 *
 * @param record - The record to update.
 * @param update - A compatible record with properties to update.
 *
 * @returns A shallow copy of `record` merged with the properties of `update`.
 *
 * @category Entities
 */
declare const updateRecord: <T extends object>(record: T, update: MakeUpdatable<T>) => T;

/**
 * Returns an object type with specific properties rendered required and non-nullable.
 *
 * @typeParam T - The object type to modify.
 * @typeParam K - Union of keys of `T` to render required and non-nullable.
 *
 * @category Utilities
 */
type WithRequiredAndNonNullable<T, K extends keyof T> = T & {
    [P in K]-?: NonNullable<T[P]>;
};

/**
 + Maps a record of transcoders to a TranscodeRegistry type by extracting each
 + entry's decode return type.
 +
 + @example
 + type R = TranscodeRegistryFrom\<\{ int: Transcoder<number> \}\>;
 + // \{ int: number \}
 */
type TranscodeRegistryFrom<T extends Record<string, {
    decode: (value: string) => unknown;
}>> = {
    [K in keyof T]: T[K] extends {
        decode: (value: string) => infer V;
    } ? V : never;
};

type EncodeParam<F> = F extends {
    encode: (value: infer V) => string;
} ? V : never;
type DecodeReturn<F> = F extends {
    decode: (value: string) => infer V;
} ? V : never;
/**
 * Branded error shapes to improve DX when encode/decode agreement fails.
 */
type MissingEncodeError<K extends string> = {
    __error__: 'MissingEncode';
    key: K;
};
type MissingDecodeError<K extends string> = {
    __error__: 'MissingDecode';
    key: K;
};
type EncodeDecodeMismatchError<K extends string, E, D> = {
    __error__: 'EncodeDecodeMismatch';
    key: K;
    encodeParam: E;
    decodeReturn: D;
};
/**
 * Ensures that for each entry K:
 *  - encode: (value: VK) =\> string
 *  - decode: (value: string) =\> VK
 * and VK matches in both positions (bi-directionally).
 */
type EncodeDecodeAgreement<T extends Record<string, {
    decode: (value: string) => unknown;
}>> = {
    [K in keyof T]-?: K extends string ? [EncodeParam<T[K]>] extends [never] ? MissingEncodeError<K> : [DecodeReturn<T[K]>] extends [never] ? MissingDecodeError<K> : [EncodeParam<T[K]>] extends [DecodeReturn<T[K]>] ? [DecodeReturn<T[K]>] extends [EncodeParam<T[K]>] ? T[K] : EncodeDecodeMismatchError<K, EncodeParam<T[K]>, DecodeReturn<T[K]>> : EncodeDecodeMismatchError<K, EncodeParam<T[K]>, DecodeReturn<T[K]>> : T[K];
};
/**
 * Inference-first builder — derive the registry shape from decode() return types.
 * Enforces encode/decode agreement per key.
 */
declare function defineTranscodes<const T extends Record<string, {
    decode: (value: string) => unknown;
}>>(spec: T & EncodeDecodeAgreement<T>): Transcodes<TranscodeRegistryFrom<T>>;

/**
 * Transcode name literal union for a registry.
 */
type TranscodeName<TR extends TranscodeRegistry> = keyof Exactify<TR> & string;

/**
 + Extracts the value type for a specific transcode name.
 */
type TranscodedType<TR extends TranscodeRegistry, TN extends TranscodeName<TR>> = TR[TN];

/**
 * A pair of encode/decode functions for a specific value type V.
 *
 * @category Transcoding
 */
type Transcoder<V> = {
    encode: (value: V) => string;
    decode: (value: string) => V;
};

/**
 + Decodes a serialized key/value string using configurable delimiters.
 + Requires exactly one kv delimiter per pair; throws on malformed pairs.
 + Defaults: pair="|", kv="#".
 */
declare function decodePairs(serialized: string, options?: {
    pair?: string;
    kv?: string;
}): Array<[string, string]>;

/**
 + Encodes key/value pairs into a single string using configurable delimiters.
 + Defaults: pair="|", kv="#".
 */
declare function encodePairs(pairs: Array<[string, string]>, options?: {
    pair?: string;
    kv?: string;
}): string;

/**
 + Enumerates all shard suffixes for a radix/width combination.
 + For chars === 0, returns [""].
 */
declare function enumerateShardSuffixes(radix: number, chars: number): string[];

/**
 + Computes a stable 32-bit unsigned FNV-1a hash for a string.
 */
declare function hashString(value: string): number;

/**
 + Computes a shard suffix from a 32-bit hash modulo the shard space.
 + For chars === 0, returns "".
 */
declare function shardSuffixFromHash(hash: number, radix: number, chars: number): string;

export { conditionalize, decodePairs, defaultTranscodes, defineSortOrder, defineTranscodes, encodePairs, enumerateShardSuffixes, hashString, isNil, shardSuffixFromHash, sort, updateRecord };
export type { AllDisjoint, ConditionalProperty, DecodeReturn, DefaultTranscodeRegistry, EncodeDecodeAgreement, EncodeDecodeMismatchError, EncodeParam, Entity, EntityKeys, EntityMap, EntityMapValues, EntityValue, Exactify, FlattenEntityMap, MakeOptional, MakeRequired, MakeUpdatable, MissingDecodeError, MissingEncodeError, MutuallyExclusive, Nil, NotNever, PropertiesNotOfType, PropertiesOfType, ReplaceKey, ReplaceKeys, SortOrder, TranscodableProperties, TranscodeName, TranscodeRegistry, TranscodeRegistryFrom, TranscodedType, Transcoder, Transcodes, UntranscodableProperties, WithRequiredAndNonNullable };
