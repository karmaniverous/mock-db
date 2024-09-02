import { isFunction, isNumber, isString, pick } from 'radash';

/**
 * Options for `query` method.
 */
export interface QueryOptions<T extends Record<string, unknown>> {
  /**
   * If provided, query will only return records with matching `hashValue`. If
   * not, query behaves like a DynamoDB scan.
   */
  hashKey?: string;

  /**
   * If provided with `hashKey`, only matching records will be returned.
   */
  hashValue?: unknown;

  /**
   * If provided, `pageKeys` will only contain these components. Otherwise it
   * will contain the entire record.
   */
  indexComponents?: string[];

  /**
   * If provided, query will only return up to `limit` records along with
   * `pageKeys` representing last record.
   */
  limit?: number;

  /**
   * If provided, result set will begin with the record after the one
   * represented by `pageKeys`.
   */
  pageKeys?: T | Pick<T, string>;

  /**
   * If true and `sortKey` is provided, result set will be sorted in
   * descending order by `sortKey`.
   */
  sortDesc?: boolean;

  /**
   * If provided, result set will be sorted by `sortKey`, in ascenting order
   * unless `sortDesc` is `true`.
   */
  sortKey?: string;

  /**
   * If provided, only records that pass the test will be returned.
   *
   * @param item - Record to test.
   *
   * @returns truthy if record should be included in result set.
   */
  test?: (item: T) => unknown;
}

/**
 * Return type for `query` method.
 */
export interface QueryReturn<T extends Record<string, unknown>> {
  /** Number of records returned in this result set, exclusive of other pages. */
  count: number;

  /** Records returned in this result set. */
  items: T[];

  /** If `limit` was reached, `pageKeys` will be provided for next page. */
  pageKeys?: T | Pick<T, string>;
}

export class MockDb<T extends Record<string, unknown>> {
  constructor(private data: T[]) {}

  /**
   * Replicates the functionality of DynamoDB scan/query.
   *
   * @param options - {@link QueryOptions | `QueryOptions`} object.
   *
   * @returns {@link QueryReturn | `QueryReturn`} object.
   */
  query({
    hashKey,
    hashValue,
    indexComponents,
    limit = Infinity,
    pageKeys,
    sortDesc,
    sortKey,
    test,
  }: QueryOptions<T> = {}): QueryReturn<T> {
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

    // Apply test & limit.
    items = items.reduce<T[]>(
      (items, item, i) =>
        i > pageKeysIndex &&
        (isFunction(test) ? !!test(item) : true) &&
        items.length < limit
          ? [...items, item]
          : items,
      [],
    );

    // Return result.
    return {
      count: items.length,
      items,
      pageKeys:
        items.length < limit
          ? undefined
          : indexComponents
            ? pick(items[items.length - 1], indexComponents)
            : items[items.length - 1],
    };
  }
}