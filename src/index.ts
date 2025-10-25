/**
 * @module mock-db
 */
export { MockDb, type QueryOptions, type QueryReturn } from './MockDb';
// Convenience type re-exports so consumers don't need to import
// directly from @karmaniverous/entity-tools for common types.
export type {
  DefaultTranscodeMap,
  Entity,
  SortOrder,
  TranscodeMap,
} from '@karmaniverous/entity-tools';
