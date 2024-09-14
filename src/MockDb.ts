import {
  type Entity,
  PropertiesInTypeMap,
  sort,
  type SortOrder,
  type StringifiableTypes,
  type TypeMap,
} from '@karmaniverous/entity-tools';
import { isFunction, pick } from 'radash';
import { setTimeout } from 'timers/promises';

import { randomNormal } from './randomNormal';

/**
 * Options for `query` method.
 *
 * @typeParam E - {@link Entity | `Entity`} type.
 * @typeParam IndexableTypes - {@link TypeMap | `TypeMap`} indicating indexable types. Defaults to {@link StringifiableTypes | `StringifiableTypes`}.
 *
 * @category MockDb
 */
export interface QueryOptions<
  E extends Entity,
  IndexableTypes extends TypeMap = StringifiableTypes,
> {
  /**
   * If provided, only records that pass the filter will be returned.
   *
   * @param item - Record to test.
   *
   * @returns truthy if record should be included in result set.
   *
   * @category MockDb
   */
  filter?: (item: E) => unknown;

  /**
   * If provided, query will only return records with matching {@link QueryOptions.hashValue | `hashValue`}. If
   * not, query behaves like a DynamoDB scan.
   */
  hashKey?: PropertiesInTypeMap<E, IndexableTypes>;

  /**
   * If provided with {@link QueryOptions.hashKey | `hashKey`}, only matching records will be returned.
   */
  hashValue?: IndexableTypes[keyof IndexableTypes];

  /**
   * If provided, returned {@link QueryReturn.pageKey | `pageKey`} will only contain these components.
   * Otherwise it will contain the entire record.
   */
  indexComponents?: PropertiesInTypeMap<E, IndexableTypes>[];

  /**
   * If provided, query will only return up to `limit` records along with
   * {@link QueryReturn.pageKey | `pageKey`} representing last record returned.
   */
  limit?: number;

  /**
   * If provided, result set will begin with the record after the one
   * represented by `pageKey`.
   */
  pageKey?: E | Pick<E, PropertiesInTypeMap<E, IndexableTypes>>;

  /**
   * A {@link SortOrder | `SortOrder`} object specifying the sort order of the result set.
   */
  sortOrder?: SortOrder<E>;
}

/**
 * Return type for {@link MockDb.query | `query`} method.
 *
 * @typeParam E - {@link Entity | `Entity`} type.
 * @typeParam IndexableTypes - {@link TypeMap | `TypeMap`} indicating indexable types. Defaults to {@link StringifiableTypes | `StringifiableTypes`}.
 *
 * @category MockDb
 */
export interface QueryReturn<
  E extends Entity,
  IndexableTypes extends TypeMap = StringifiableTypes,
> {
  /** Number of records returned in this result set, exclusive of other pages. */
  count: number;

  /** Records returned in this result set. */
  items: E[];

  /** If {@link QueryOptions.limit | `limit`} was reached, {@link QueryOptions.pageKey | `pageKey`} will be provided for next page. */
  pageKey?: E | Pick<E, PropertiesInTypeMap<E, IndexableTypes>>;
}

/**
 * Replicates a limited set of DynamoDB behaviors on local JSON data for
 * testing purposes.
 *
 *
 * @typeParam E - {@link Entity | `Entity`} type.
 * @typeParam IndexableTypes - {@link TypeMap | `TypeMap`} indicating indexable types. Defaults to {@link StringifiableTypes | `StringifiableTypes`}.
 *
 * @remarks
 * This class is intended to replicate essential DynamoDB _behaviors_, not the
 * actual API!
 *
 * For example, the {@link MockDb.query | `query`} method accepts {@link QueryOptions.hashKey | `hashKey`} & {@link QueryOptions.sortOrder | `sortOrder`} as arguments and
 * returns limited record sets with {@link QueryReturn.pageKey | `pageKey`}. It will accept a {@link QueryOptions.filter | `filter`}
 * function, but makes no attempt to replicate DynamoDB query syntax.
 *
 * All methods can be run synchronously, or asynchronously with a normally-
 * distributed delay.
 *
 * @category MockDb
 */
export class MockDb<
  E extends Entity,
  IndexableTypes extends TypeMap = StringifiableTypes,
> {
  /**
   * Creates a new `MockDb` instance.
   *
   * @param data - Array of data items to query.
   * @param delayMean - Mean delay in ms. If omitted or `undefined`, methods will be synchronous.
   * @param delayStd - Standard deviation of delay in ms. Default is `20`.
   */
  constructor(
    private data: E[],
    private delayMean = 100,
    private delayStd = 20,
  ) {}

  /**
   * Replicates the functionality of DynamoDB scan/query. Runs synchronously.
   *
   * @param options - {@link QueryOptions | `QueryOptions`} object.
   *
   * @returns {@link QueryReturn | `QueryReturn`} object.
   *
   * @remarks
   * Pass {@link QueryOptions.hashKey | `hashKey`} and {@link QueryOptions.hashValue | `hashValue`} to restrict your search to a specific data
   * partition like a DynamoDB `query` operation. Otherwise, search will be
   * performed across partitions like a DynamoDB `scan`.
   *
   * Pass {@link QueryOptions.limit | `limit`} to return a limited record set and {@link QueryOptions.pageKey | `pageKey`} for the next
   * data page.
   *
   * Pass {@link QueryOptions.sortOrder | `sortOrder`} to sort the result set by a specific set of keys. See {@link SortOrder | `SortOrder`} for more info.
   *
   * Pass {@link QueryOptions.filter | `filter`} to filter records based on a custom function.
   *
   * See the {@link QueryOptions | `QueryOptions`} interface for more info on
   * query options.
   */
  querySync({
    hashKey,
    hashValue,
    indexComponents,
    limit = Infinity,
    pageKey,
    sortOrder,
    filter,
  }: QueryOptions<E, IndexableTypes> = {}): QueryReturn<E, IndexableTypes> {
    // Clone data.
    let items = [...this.data];

    // Find records that match hashKey.
    if (hashKey)
      items = items.filter((item) => item[hashKey as keyof E] === hashValue);

    // Sort records by sortOrder.
    if (sortOrder) items = sort(items, sortOrder);

    // Find pageKey index.
    const pageKeyIndex = pageKey
      ? items.findIndex((item) =>
          Object.entries(pageKey).every(([key, value]) => item[key] === value),
        )
      : -1;

    // Apply filter & limit.
    items = items.reduce<E[]>(
      (items, item, i) =>
        i > pageKeyIndex &&
        (isFunction(filter) ? !!filter(item) : true) &&
        items.length < limit
          ? [...items, item]
          : items,
      [],
    );

    // Compose & return result.
    return {
      count: items.length,
      items,
      pageKey:
        items.length < limit
          ? undefined
          : indexComponents
            ? pick(items[items.length - 1], indexComponents)
            : items[items.length - 1],
    };
  }

  /**
   * Replicates the functionality of DynamoDB scan/query. Runs asynchronously
   * with a normally-disributed delay.
   *
   * @param options - {@link QueryOptions | `QueryOptions`} object.
   * @param delayMean - Mean delay in ms, overrides constructor `delayMean`.
   * @param delayStd - Standard deviation of delay in ms, overrides constructor
   * `delayStd`.
   *
   * @returns {@link QueryReturn | `QueryReturn`} object `Promise`.
   *
   * @remarks
   * Pass {@link QueryOptions.hashKey | `hashKey`} and {@link QueryOptions.hashValue | `hashValue`} to restrict your search to a specific data
   * partition like a DynamoDB `query` operation. Otherwise, search will be
   * performed across partitions like a DynamoDB `scan`.
   *
   * Pass {@link QueryOptions.limit | `limit`} to return a limited record set and {@link QueryOptions.pageKey | `pageKey`} for the next
   * data page.
   *
   * Pass {@link QueryOptions.sortOrder | `sortOrder`} to sort the result set by specific keys. See {@link SortOrder | `SortOrder`} for more info.
   *
   * Pass {@link QueryOptions.filter | `filter`} to filter records based on a custom function.
   *
   * See the {@link QueryOptions | `QueryOptions`} interface for more info on
   * query options.
   */
  async query(
    options: QueryOptions<E, IndexableTypes> = {},
    delayMean = this.delayMean,
    delayStd = this.delayStd,
  ): Promise<QueryReturn<E, IndexableTypes>> {
    await setTimeout(Math.max(randomNormal(delayMean, delayStd), 0));

    return this.querySync(options);
  }
}
