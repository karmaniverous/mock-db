import type { Entity } from '@karmaniverous/entity-tools';
import { expect } from 'chai';

import { MockDb, type QueryOptions } from '.';

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

describe('README', function () {
  it('scan', function () {
    const scanResult = mockDb.querySync({
      sortKey: 'id',
      filter: ({ id }) => id > 2,
    });

    console.log(scanResult);

    expect(scanResult.count).to.equal(2);
  });

  it('async query', async function () {
    const queryOptions: QueryOptions<User> = {
      hashKey: 'partition',
      hashValue: 'a',
      indexComponents: ['partition', 'id'],
      limit: 2,
      sortKey: 'id',
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
