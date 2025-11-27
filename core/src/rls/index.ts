/**
 * RLS Module
 *
 * Row-Level Security configuration and context management.
 */

// Types
export type {
  RlsIsolation,
  RlsPolicy,
  RlsTableConfig,
  RlsRegistry,
  TableValidationResult,
  RlsRegistryStats,
} from './types';

// Registry
export {
  coreRlsTables,
  createRlsRegistry,
  mergeRlsRegistries,
  getAllTableNames,
  getTablesByIsolation,
  getOrgIsolatedTables,
  getPublicTables,
  getTablesWithRLS,
  getTablesWithOrgId,
  getTablesWithWorkspaceId,
  validateTableConfig,
  validateRegistry,
  getRegistryStats,
} from './registry';

// Context
export {
  RLS_ORG_VAR,
  RLS_USER_VAR,
  setRlsContext,
  clearRlsContext,
  withRlsContext,
  hasRlsContext,
  getRlsContext,
} from './context';
