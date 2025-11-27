/**
 * Database Client Factory
 *
 * Creates Drizzle database clients with proper configuration.
 */

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as coreSchema from './schema';

// =============================================================================
// TYPES
// =============================================================================

export interface DbConfig {
  /** Database connection URL */
  url: string;
  /** Maximum number of connections in pool */
  maxConnections?: number;
  /** Enable SSL (default: true in production) */
  ssl?: boolean | 'require' | 'prefer';
  /** Idle timeout in seconds */
  idleTimeout?: number;
  /** Connection timeout in seconds */
  connectTimeout?: number;
}

export type DbClient = ReturnType<typeof createDbClient>;

// =============================================================================
// CLIENT FACTORY
// =============================================================================

/**
 * Create a database client with core schema.
 *
 * @example
 * ```ts
 * const db = createDbClient({ url: process.env.DATABASE_URL! });
 * const users = await db.query.users.findMany();
 * ```
 */
export function createDbClient(config: DbConfig) {
  const client = postgres(config.url, {
    max: config.maxConnections ?? 10,
    idle_timeout: config.idleTimeout ?? 20,
    connect_timeout: config.connectTimeout ?? 10,
    ssl: config.ssl ?? (process.env.NODE_ENV === 'production' ? 'require' : false),
  });

  return drizzle(client, { schema: coreSchema });
}

/**
 * Create an extended database client with additional schema.
 *
 * @example
 * ```ts
 * const db = createExtendedDbClient(
 *   { url: process.env.DATABASE_URL! },
 *   { ...extensionSchema }
 * );
 * ```
 */
export function createExtendedDbClient<T extends Record<string, unknown>>(
  config: DbConfig,
  additionalSchema: T
) {
  const client = postgres(config.url, {
    max: config.maxConnections ?? 10,
    idle_timeout: config.idleTimeout ?? 20,
    connect_timeout: config.connectTimeout ?? 10,
    ssl: config.ssl ?? (process.env.NODE_ENV === 'production' ? 'require' : false),
  });

  return drizzle(client, {
    schema: { ...coreSchema, ...additionalSchema }
  });
}

/**
 * Create a raw postgres client for migrations/admin operations.
 */
export function createRawClient(config: DbConfig) {
  return postgres(config.url, {
    max: config.maxConnections ?? 1,
    idle_timeout: config.idleTimeout ?? 10,
    connect_timeout: config.connectTimeout ?? 10,
    ssl: config.ssl ?? (process.env.NODE_ENV === 'production' ? 'require' : false),
  });
}
