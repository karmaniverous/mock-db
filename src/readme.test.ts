import { expect } from 'chai';

import { MockDb, QueryOptions } from '.';

interface User extends Record<string, unknown> {
  partition: string;
  id: string;
  name: string;
}

const users: User[] = [
  { partition: 'a', id: '4', name: 'Alice' },
  { partition: 'b', id: '3', name: 'Bob' },
  { partition: 'a', id: '2', name: 'Charlie' },
  { partition: 'a', id: '1', name: 'Dave' },
];

const mockDb = new MockDb<User>(users);

describe('README', function () {
  it('scan', function () {
    const scanResult = mockDb.query({
      sortKey: 'id',
      filter: ({ id }) => id > '2',
    });

    console.log(scanResult);

    expect(scanResult.count).to.equal(2);
  });

  it('query', function () {
    const queryOptions: QueryOptions<User> = {
      hashKey: 'partition',
      hashValue: 'a',
      limit: 2,
      sortKey: 'id',
    };

    let queryResult = mockDb.query(queryOptions);

    console.log(queryResult);

    expect(queryResult.count).to.equal(2);

    queryResult = mockDb.query({
      ...queryOptions,
      pageKeys: queryResult.pageKeys,
    });

    console.log(queryResult);

    expect(queryResult.count).to.equal(1);
  });
});
