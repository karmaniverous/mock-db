import { isFunction, isNumber, isString, pick } from 'radash';
import { setTimeout } from 'timers/promises';

import { randomNormal } from './randomNormal';

/** Base type for data items. */
export type Item = Record<string, unknown>;

/**
 * Options for `query` method.
 */
export interface QueryOptions<T extends Item> {
  /**
   * If provided, only records that pass the filter will be returned.
   *
   * @param item - Record to test.
   *
   * @returns truthy if record should be included in result set.
   */
  filter?: (item: T) => unknown;

  /**
   * If provided, query will only return records with matching {@link QueryOptions.hashValue | `hashValue`}. If
   * not, query behaves like a DynamoDB scan.
   */
  hashKey?: string;

  /**
   * If provided with {@link QueryOptions.hashKey | `hashKey`}, only matching records will be returned.
   */
  hashValue?: unknown;

  /**
   * If provided, returned {@link QueryReturn.pageKeys | `pageKeys`} will only contain these components.
   * Otherwise it will contain the entire record.
   */
  indexComponents?: string[];

  /**
   * If provided, query will only return up to `limit` records along with
   * {@link QueryReturn.pageKeys | `pageKeys`} representing last record returned.
   */
  limit?: number;

  /**
   * If provided, result set will begin with the record after the one
   * represented by `pageKeys`.
   */
  pageKeys?: T | Pick<T, string>;

  /**
   * If `true` and {@link QueryOptions.sortKey | `sortKey`} is provided, result set will be sorted in
   * descending order by `sortKey`.
   */
  sortDesc?: boolean;

  /**
   * If provided, result set will be sorted by `sortKey`, in ascenting order
   * unless {@link QueryOptions.sortDesc | `sortDesc`} is `true`.
   */
  sortKey?: string;
}

/**
 * Return type for {@link MockDb.query | `query`} method.
 */
export interface QueryReturn<T extends Item> {
  /** Number of records returned in this result set, exclusive of other pages. */
  count: number;

  /** Records returned in this result set. */
  items: T[];

  /** If {@link QueryOptions.limit | `limit`} was reached, {@link QueryOptions.pageKeys | `pageKeys`} will be provided for next page. */
  pageKeys?: T | Pick<T, string>;
}

/**
 * Replicates a limited set of DynamoDB behaviors on local JSON data for
 * testing purposes.
 *
 * @remarks
 * This class is intended to replicate essential DynamoDB _behaviors_, not the
 * actual API!
 *
 * For example, the {@link MockDb.query | `query`} method accepts {@link QueryOptions.hashKey | `hashKey`} & {@link QueryOptions.sortKey | `sortKey`} as arguments and
 * returns limited record sets with {@link QueryReturn.pageKeys | `pageKeys`}. It will accept a {@link QueryOptions.filter | `filter`}
 * function, but makes no attempt to replicate DynamoDB query syntax.
 */
export class MockDb<T extends Item> {
  constructor(private data: T[]) {}

  /**
   * Replicates the functionality of DynamoDB scan/query. Can be run
   * synchronously, or asynchronously with a normally-disributed delay.
   *
   * @param options - {@link QueryOptions | `QueryOptions`} object.
   * @param delayMean - Mean delay in ms. If omitted or `0`, method will be
   * synchronous.
   * @param delayStd - Standard deviation of delay in ms. Default is `20`.
   *
   * @returns {@link QueryReturn | `QueryReturn`} object.
   *
   * @remarks
   * Pass {@link QueryOptions.hashKey | `hashKey`} and {@link QueryOptions.hashValue | `hashValue`} to restrict your search to a specific data
   * partition like a DynamoDB `query` operation. Otherwise, search will be
   * performed across partitions like a DynamoDB `scan`.
   *
   * Pass {@link QueryOptions.limit | `limit`} to return a limited record set and {@link QueryOptions.pageKeys | `pageKeys`} for the next
   * data page.
   *
   * Pass {@link QueryOptions.sortKey | `sortKey`} to sort the result set by a specific key. Pass
   * {@link QueryOptions.sortDesc | `sortDesc: true`} to sort in descending order.
   *
   * Pass {@link QueryOptions.filter | `filter`} to filter records based on a custom function.
   *
   * See the {@link QueryOptions | `QueryOptions`} interface for more details.
   */
  query(options: QueryOptions<T>): QueryReturn<T>;
  async query(
    options: QueryOptions<T>,
    delayMean: number,
    delayStd?: number,
  ): Promise<QueryReturn<T>>;
  query(
    {
      hashKey,
      hashValue,
      indexComponents,
      limit = Infinity,
      pageKeys,
      sortDesc,
      sortKey,
      filter,
    }: QueryOptions<T> = {},
    delayMean = 0,
    delayStd = 20,
  ): QueryReturn<T> | Promise<QueryReturn<T>> {
    // Clone data.
    let items = [...this.data];

    // Find records that match hashKey.
    if (hashKey) items = items.filter((item) => item[hashKey] === hashValue);

    // Sort records by sortKey.
    if (sortKey)
      items = items.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];

        if (isNumber(aValue) && isNumber(bValue)) {
          return sortDesc ? bValue - aValue : aValue - bValue;
        }

        if (isString(aValue) && isString(bValue)) {
          return sortDesc
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        return 0;
      });

    // Find pageKeys index.
    const pageKeysIndex = pageKeys
      ? items.findIndex((item) =>
          Object.entries(pageKeys).every(([key, value]) => item[key] === value),
        )
      : -1;

    // Apply filter & limit.
    items = items.reduce<T[]>(
      (items, item, i) =>
        i > pageKeysIndex &&
        (isFunction(filter) ? !!filter(item) : true) &&
        items.length < limit
          ? [...items, item]
          : items,
      [],
    );

    // Compose result.
    const result = {
      count: items.length,
      items,
      pageKeys:
        items.length < limit
          ? undefined
          : indexComponents
            ? pick(items[items.length - 1], indexComponents)
            : items[items.length - 1],
    };

    if (delayMean)
      return setTimeout(Math.max(randomNormal(delayMean, delayStd), 0)).then(
        () => result,
      );
    else return result;
  }
}
