/**
 * @yobo/core
 *
 * Core SaaS platform package providing:
 * - Multi-tenant database schema
 * - Permission system with RBAC
 * - Row-Level Security (RLS) management
 * - tRPC router infrastructure
 * - Extension system
 *
 * @example
 * ```ts
 * import { defineSaasConfig, corePermissions, createDbClient } from '@yobo/core';
 *
 * const config = defineSaasConfig({
 *   app: { name: 'My App' },
 *   auth: { providers: ['credentials'] },
 *   database: { url: process.env.DATABASE_URL! },
 *   extensions: [],
 * });
 * ```
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

export {
  defineSaasConfig,
  defineExtension,
  loadExtensions,
  runExtensionHooks,
  runExtensionSeeds,
} from './config';

export type {
  SaasConfig,
  Extension,
  AuthConfig,
  DatabaseConfig,
  UIConfig,
  FeaturesConfig,
  LoadedExtensions,
} from './config';

// =============================================================================
// DATABASE
// =============================================================================

export {
  createDbClient,
  createExtendedDbClient,
  createRawClient,
} from './db';

export type {
  DbConfig,
  DbClient,
} from './db';

export * as schema from './db/schema';

// =============================================================================
// PERMISSIONS
// =============================================================================

export {
  corePermissions,
  mergePermissions,
  mergePermissionsWithResult,
  validatePermissionNamespacing,
  getAllPermissions,
  getPermissionsByCategory,
  getPermissionsByModule,
  getPermissionBySlug,
  isValidPermissionSlug,
  getAllPermissionSlugs,
  getCriticalPermissions,
  getOrgRequiredPermissions,
  getRegistrySummary,
} from './permissions';

export type {
  PermissionCategory,
  PermissionDefinition,
  PermissionModule,
  PermissionRegistry,
  PermissionSlug,
  MergeOptions,
  MergeResult,
} from './permissions';

// =============================================================================
// RLS (Row-Level Security)
// =============================================================================

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
  setRlsContext,
  clearRlsContext,
  withRlsContext,
  hasRlsContext,
  getRlsContext,
  RLS_ORG_VAR,
  RLS_USER_VAR,
} from './rls';

export type {
  RlsIsolation,
  RlsPolicy,
  RlsTableConfig,
  RlsRegistry,
  TableValidationResult,
  RlsRegistryStats,
} from './rls';

// =============================================================================
// tRPC
// =============================================================================

export {
  createTRPCContext,
  isAuthenticated,
  requireActor,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  router,
  middleware,
  publicProcedure,
  protectedProcedure,
  permissionProcedure,
  anyPermissionProcedure,
  createRouterWithActor,
  composeRouters,
} from './trpc';

export type {
  Actor,
  Session,
  TRPCContext,
  AuthenticatedContext,
  CreateContextOptions,
  RouterProcedureConfig,
  ExtensionRouter,
} from './trpc';

// =============================================================================
// AUTH
// =============================================================================

export { createAuthConfig } from './auth';

// =============================================================================
// UTILITIES
// =============================================================================

export { cn, generateId, sleep, logger } from './lib';

// =============================================================================
// CLI (exported separately via @yobo/core/cli)
// =============================================================================

// CLI utilities are available via '@yobo/core/cli' import path
// See packages/core/src/cli/index.ts for available exports
