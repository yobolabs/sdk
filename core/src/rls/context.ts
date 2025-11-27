/**
 * RLS Context Management
 *
 * Functions for setting and clearing RLS context in database connections.
 */

import type { DbClient } from '../db';

// =============================================================================
// CONSTANTS
// =============================================================================

export const RLS_ORG_VAR = 'rls.current_org_id';
export const RLS_USER_VAR = 'rls.current_user_id';

// =============================================================================
// CONTEXT FUNCTIONS
// =============================================================================

/**
 * Set RLS context variables on a database connection.
 *
 * IMPORTANT: Call this before any queries that need RLS filtering.
 *
 * @example
 * ```ts
 * await setRlsContext(db, { orgId: 1, userId: 123 });
 * const customers = await db.query.customers.findMany();
 * ```
 */
export async function setRlsContext(
  db: DbClient,
  context: { orgId: number; userId?: number }
): Promise<void> {
  const { orgId, userId } = context;

  // Set org context (required for most RLS policies)
  await (db as any).execute(`SET LOCAL ${RLS_ORG_VAR} = '${orgId}'`);

  // Set user context if provided
  if (userId !== undefined) {
    await (db as any).execute(`SET LOCAL ${RLS_USER_VAR} = '${userId}'`);
  }
}

/**
 * Clear RLS context variables.
 *
 * Call this when done with RLS-filtered queries.
 */
export async function clearRlsContext(db: DbClient): Promise<void> {
  await (db as any).execute(`RESET ${RLS_ORG_VAR}`);
  await (db as any).execute(`RESET ${RLS_USER_VAR}`);
}

/**
 * Execute a function with RLS context set.
 *
 * Automatically sets and clears context around the callback.
 *
 * @example
 * ```ts
 * const customers = await withRlsContext(db, { orgId: 1 }, async (db) => {
 *   return db.query.customers.findMany();
 * });
 * ```
 */
export async function withRlsContext<T>(
  db: DbClient,
  context: { orgId: number; userId?: number },
  fn: (db: DbClient) => Promise<T>
): Promise<T> {
  try {
    await setRlsContext(db, context);
    return await fn(db);
  } finally {
    await clearRlsContext(db);
  }
}

/**
 * Check if RLS context is currently set.
 */
export async function hasRlsContext(db: DbClient): Promise<boolean> {
  try {
    const result = await (db as any).execute(
      `SELECT current_setting('${RLS_ORG_VAR}', true) as org_id`
    );
    return result?.[0]?.org_id !== null;
  } catch {
    return false;
  }
}

/**
 * Get current RLS context values.
 */
export async function getRlsContext(db: DbClient): Promise<{
  orgId: number | null;
  userId: number | null;
}> {
  try {
    const result = await (db as any).execute(`
      SELECT
        current_setting('${RLS_ORG_VAR}', true)::integer as org_id,
        current_setting('${RLS_USER_VAR}', true)::integer as user_id
    `);
    return {
      orgId: result?.[0]?.org_id ?? null,
      userId: result?.[0]?.user_id ?? null,
    };
  } catch {
    return { orgId: null, userId: null };
  }
}
