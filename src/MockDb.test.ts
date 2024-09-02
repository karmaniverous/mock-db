import { expect } from 'chai';

import { MockDb, QueryOptions } from '../src';
import users from './users.json' assert { type: 'json' };

interface User extends Record<string, unknown> {
  created?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  firstNameCanonical?: string;
  lastNameCanonical?: string;
  shardKey?: string;
  entityPK?: string;
  entitySK?: string;
  firstNameSK?: string;
  lastNameSK?: string;
}

const mockDb = new MockDb<User>(users as User[]);

describe('MockDb', function () {
  describe('query', function () {
    it('hashKey', function () {
      const queryResult = mockDb.query({
        hashKey: 'entityPK',
        hashValue: 'user!0',
      });

      console.log(queryResult);

      expect(queryResult.count).to.equal(3);
      expect(queryResult.items.length).to.equal(3);
      expect(queryResult.pageKeys).to.equal(undefined);
    });

    it('pageKeys', function () {
      const queryOptions: QueryOptions<User> = {
        hashKey: 'entityPK',
        hashValue: 'user!0',
        indexComponents: ['entityPK', 'entitySK'],
        limit: 2,
      };

      let queryResult = mockDb.query(queryOptions);

      console.log(queryResult);

      expect(queryResult.count).to.equal(2);
      expect(queryResult.items.length).to.equal(2);
      expect(queryResult.pageKeys).to.deep.equal({
        entityPK: 'user!0',
        entitySK: 'userId#01J6PDX6CE0YGJ7XTXT8MABJNQ',
      });

      queryResult = mockDb.query({
        ...queryOptions,
        pageKeys: queryResult.pageKeys,
      });

      console.log(queryResult);

      expect(queryResult.count).to.equal(1);
      expect(queryResult.items.length).to.equal(1);
      expect(queryResult.pageKeys).to.equal(undefined);
    });

    it('sortKey', function () {
      const queryResult = mockDb.query({
        hashKey: 'entityPK',
        hashValue: 'user!0',
        sortKey: 'lastNameCanonical',
        test: ({ lastNameCanonical }) =>
          lastNameCanonical && lastNameCanonical > 'e',
      });

      console.log(queryResult);

      expect(queryResult.items[0].lastNameCanonical).to.equal('hutson');
    });

    it('sortKey desc', function () {
      const queryResult = mockDb.query({
        hashKey: 'entityPK',
        hashValue: 'user!0',
        sortDesc: true,
        sortKey: 'lastNameCanonical',
        test: ({ lastNameCanonical }) =>
          lastNameCanonical && lastNameCanonical > 'e',
      });

      console.log(queryResult);

      expect(queryResult.items[0].lastNameCanonical).to.equal('swafield');
    });
  });
});