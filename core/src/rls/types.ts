/**
 * RLS Types
 *
 * Type definitions for Row-Level Security configuration.
 */

// =============================================================================
// TYPES
// =============================================================================

/**
 * RLS isolation levels.
 * - public: No RLS, accessible to all authenticated users
 * - org: Isolated by organization (most common)
 * - workspace: Isolated by workspace within organization
 * - user: Isolated by individual user
 */
export type RlsIsolation = 'public' | 'org' | 'workspace' | 'user';

/**
 * RLS policy types.
 */
export type RlsPolicy = 'select' | 'insert' | 'update' | 'delete';

/**
 * Configuration for a single table's RLS policy.
 */
export interface RlsTableConfig {
  /** RLS isolation level */
  isolation: RlsIsolation;
  /** Whether this table has an org_id column */
  orgId: boolean;
  /** Whether this table has a workspace_id column */
  workspaceId: boolean;
  /** Whether this table has a user_id column for user-level isolation */
  userId?: boolean;
  /** Whether this table inherits isolation from a parent table */
  inheritedFrom?: string;
  /** Custom RLS policy SQL if needed */
  customPolicy?: string;
  /** Description of the table's isolation requirements */
  description: string;
  /** Whether RLS is currently enabled (for migration tracking) */
  rlsEnabled?: boolean;
}

/**
 * Complete RLS registry mapping table names to configs.
 */
export type RlsRegistry = Record<string, RlsTableConfig>;

/**
 * Validation result for table configuration
 */
export interface TableValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Registry statistics
 */
export interface RlsRegistryStats {
  totalTables: number;
  publicTables: number;
  orgTables: number;
  workspaceTables: number;
  userTables: number;
  rlsEnabledTables: number;
  tablesWithOrgId: number;
  tablesWithWorkspaceId: number;
  isolationBreakdown: {
    public: number;
    org: number;
    workspace: number;
    user: number;
  };
}
