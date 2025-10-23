import type { Entity } from '@karmaniverous/entity-tools';
import { describe, expect, it } from 'vitest';

import { MockDb, type QueryOptions } from '.';
import users from './users.json' assert { type: 'json' };

interface User extends Entity {
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

const mockDb = new MockDb(users as User[]);

describe('MockDb', () => {
  describe('query', () => {
    it('hashKey', async () => {
      const queryResult = await mockDb.query({
        hashKey: 'entityPK',
        hashValue: 'user!0',
      });

      console.log(queryResult);

      expect(queryResult.count).to.equal(3);
      expect(queryResult.items.length).to.equal(3);
      expect(queryResult.pageKey).to.equal(undefined);
    });

    it('constructor sync hashKey', () => {
      const queryResult = mockDb.querySync({
        hashKey: 'entityPK',
        hashValue: 'user!0',
      });

      console.log(queryResult);

      expect(queryResult.count).to.equal(3);
      expect(queryResult.items.length).to.equal(3);
      expect(queryResult.pageKey).to.equal(undefined);
    });

    it('pageKey', async () => {
      const queryOptions: QueryOptions<User> = {
        hashKey: 'entityPK',
        hashValue: 'user!0',
        indexComponents: ['entityPK', 'entitySK'],
        limit: 2,
      };

      let queryResult = await mockDb.query(queryOptions);

      console.log(queryResult);

      expect(queryResult.count).to.equal(2);
      expect(queryResult.items.length).to.equal(2);
      expect(queryResult.pageKey).to.deep.equal({
        entityPK: 'user!0',
        entitySK: 'userId#01J6PDX6CE0YGJ7XTXT8MABJNQ',
      });

      queryResult = await mockDb.query({
        ...queryOptions,
        pageKey: queryResult.pageKey,
      });

      console.log(queryResult);

      expect(queryResult.count).to.equal(1);
      expect(queryResult.items.length).to.equal(1);
      expect(queryResult.pageKey).to.equal(undefined);
    });

    it('sortKey', async () => {
      const queryResult = await mockDb.query({
        hashKey: 'entityPK',
        hashValue: 'user!0',
        sortOrder: [{ property: 'lastNameCanonical' }],
        filter: ({ lastNameCanonical }) =>
          lastNameCanonical && lastNameCanonical > 'e',
      });

      console.log(queryResult);

      expect(queryResult.items[0].lastNameCanonical).to.equal('hutson');
    });

    it('sortKey desc', async () => {
      const queryResult = await mockDb.query({
        hashKey: 'entityPK',
        hashValue: 'user!0',
        sortOrder: [{ property: 'lastNameCanonical', desc: true }],
        filter: ({ lastNameCanonical }) =>
          lastNameCanonical && lastNameCanonical > 'e',
      });

      console.log(queryResult);

      expect(queryResult.items[0].lastNameCanonical).to.equal('swafield');
    });
  });
});
