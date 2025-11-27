/**
 * Database Module
 *
 * Core database functionality and schema exports.
 */

// Client
export {
  createDbClient,
  createExtendedDbClient,
  createRawClient,
} from './client';

export type {
  DbConfig,
  DbClient,
} from './client';

// Schema
export * as schema from './schema';
export * from './schema';
