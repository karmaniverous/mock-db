import type { Entity } from '@karmaniverous/entity-tools';
import { describe, expect, it } from 'vitest';

import { MockDb, type QueryOptions } from './MockDb';

interface User extends Entity {
  partition: string;
  id: number;
  name: string;
}

const users: User[] = [
  { partition: 'a', id: 4, name: 'Alice' },
  { partition: 'b', id: 3, name: 'Bob' },
  { partition: 'a', id: 2, name: 'Charlie' },
  { partition: 'a', id: 1, name: 'Dave' },
];

const mockDb = new MockDb(users);

describe('README', () => {
  it('scan', () => {
    const scanResult = mockDb.querySync({
      sortOrder: [{ property: 'id' }],
      filter: ({ id }) => id > 2,
    });

    console.log(scanResult);

    expect(scanResult.count).to.equal(2);
  });

  it('async query', async () => {
    const queryOptions: QueryOptions<User> = {
      hashKey: 'partition',
      hashValue: 'a',
      indexComponents: ['partition', 'id'],
      limit: 2,
      sortOrder: [{ property: 'id' }],
    };

    let queryResult = await mockDb.query(queryOptions, 100);

    console.log(queryResult);

    expect(queryResult.count).to.equal(2);

    queryResult = await mockDb.query(
      {
        ...queryOptions,
        pageKey: queryResult.pageKey,
      },
      100,
    );

    console.log(queryResult);

    expect(queryResult.count).to.equal(1);
  });
});
