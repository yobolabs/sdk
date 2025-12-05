# @yobolabs/core SDK Documentation

Complete reference for the @yobolabs/core SaaS SDK package.

## Table of Contents

- [Installation](#installation)
- [Package Exports](#package-exports)
- [Main Entry Point](#main-entry-point-yobolabscore)
- [Database Module](#database-module-yobolabscoredb)
- [Database Schema](#database-schema-yobolabscoredbschema)
- [Database Seeds](#database-seeds-yobolabscoredbseeds)
- [tRPC Module](#trpc-module-yobolabscoretrpc)
- [Router Factories](#router-factories-yobolabscoretrcprouters)
- [Permissions Module](#permissions-module-yobolabscorepermissions)
- [RBAC Module](#rbac-module-yobolabscorerbac)
- [RLS Module](#rls-module-yobolabscorerls)
- [Auth Module](#auth-module-yobolabscoreauth)
- [Organizations Module](#organizations-module-yobolabscoreorganizations)
- [Users Module](#users-module-yobolabscoreusers)
- [User-Org Module](#user-org-module-yobolabscoreuser-org)
- [Themes Module](#themes-module-yobolabscorethemes)
- [API Keys Module](#api-keys-module-yobolabscoreapi-keys)
- [System Config Module](#system-config-module-yobolabscoresystem-config)
- [Hooks Module](#hooks-module-yobolabscorehooks)
- [Stores Module](#stores-module-yobolabscorestores)
- [Providers Module](#providers-module-yobolabscoreproviders)
- [UI Module](#ui-module-yobolabscoreui)
- [Library Utilities](#library-utilities-yobolabscorelib)
- [CLI Module](#cli-module-yobolabscorecli)
- [Config Module](#config-module-yobolabscoreconfig)
- [Middleware Module](#middleware-module-yobolabscoremiddleware)

---

## Installation

```bash
pnpm add @yobolabs/core
```

### Peer Dependencies

The following are optional peer dependencies depending on which modules you use:

```json
{
  "@yobolabs/framework": "^0.2.0",
  "@radix-ui/react-*": "^1.0.0",
  "@tanstack/react-query": "^5.0.0",
  "@tanstack/react-table": "^8.0.0",
  "@trpc/client": "^11.0.0",
  "@trpc/server": "^11.0.0",
  "drizzle-orm": "^0.30.0",
  "next": "^15.0.0",
  "next-auth": "^4.24.0",
  "react": "^18.0.0 || ^19.0.0",
  "zustand": "^4.4.0"
}
```

---

## Package Exports

The package provides multiple entry points for tree-shaking and separation of concerns:

| Entry Point | Description |
|-------------|-------------|
| `@yobolabs/core` | Main entry - config, permissions, RLS, utilities, stores, hooks, UI |
| `@yobolabs/core/db` | Database client factories and schema |
| `@yobolabs/core/db/schema` | Database schema definitions |
| `@yobolabs/core/db/seeds` | Seeding utilities |
| `@yobolabs/core/trpc` | tRPC server utilities (router, procedures, middleware) |
| `@yobolabs/core/trpc/routers` | Pre-built router configurations |
| `@yobolabs/core/permissions` | Permission system |
| `@yobolabs/core/rbac` | Role-based access control |
| `@yobolabs/core/rls` | Row-Level Security |
| `@yobolabs/core/auth` | Authentication providers and utilities |
| `@yobolabs/core/organizations` | Organization management |
| `@yobolabs/core/users` | User management |
| `@yobolabs/core/user-org` | User-organization relationships |
| `@yobolabs/core/themes` | Theme management |
| `@yobolabs/core/api-keys` | API key management |
| `@yobolabs/core/system-config` | System configuration |
| `@yobolabs/core/hooks` | React hooks |
| `@yobolabs/core/stores` | Zustand stores |
| `@yobolabs/core/providers` | React providers |
| `@yobolabs/core/ui` | UI component factories |
| `@yobolabs/core/lib` | Utility functions |
| `@yobolabs/core/cli` | CLI utilities |
| `@yobolabs/core/config` | Configuration system |
| `@yobolabs/core/middleware` | Security middleware |

---

## Main Entry Point (`@yobolabs/core`)

The main entry re-exports commonly used items from submodules.

### Configuration

```typescript
import {
  defineSaasConfig,
  defineExtension,
  loadExtensions,
  runExtensionHooks,
  runExtensionSeeds,
} from '@yobolabs/core';

// Types
import type {
  SaasConfig,
  Extension,
  AuthConfig,
  DatabaseConfig,
  UIConfig,
  FeaturesConfig,
  LoadedExtensions,
} from '@yobolabs/core';
```

### Database

```typescript
import {
  createDbClient,
  createExtendedDbClient,
  createRawClient,
  createDbClients,
  createDbClientsFromEnv,
  schema, // Namespace for all schema tables
} from '@yobolabs/core';

// Types
import type {
  DbConfig,
  DbClient,
  PoolConfig,
  DbClientFactoryConfig,
  DbClients,
} from '@yobolabs/core';
```

### Permissions

```typescript
import {
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
} from '@yobolabs/core';

// Types
import type {
  PermissionCategory,
  PermissionDefinition,
  PermissionModule,
  PermissionRegistry,
  PermissionSlug,
  MergeOptions,
  MergeResult,
} from '@yobolabs/core';
```

### RLS (Row-Level Security)

```typescript
import {
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
} from '@yobolabs/core';

// Types
import type {
  RlsIsolation,
  RlsPolicy,
  RlsTableConfig,
  RlsRegistry,
  TableValidationResult,
  RlsRegistryStats,
} from '@yobolabs/core';
```

### Auth

```typescript
import {
  createAuthConfig,
  tokenBlacklist,
  getTokenId,
  blacklistToken,
  blacklistUserTokens,
  isTokenValid,
  BLACKLIST_REASONS,
} from '@yobolabs/core';

// Types
import type {
  CoreAuthConfig,
  BlacklistReason,
  JWTTokenLike,
} from '@yobolabs/core';
```

### Utilities

```typescript
import {
  cn,
  generateId,
  sleep,
  logger,
  // Formatters
  formatDate,
  formatISODate,
  formatLocalDate,
  formatLocalDateTime,
  formatRelativeTime,
  formatNumber,
  formatCurrency,
  formatPercent,
  formatBytes,
  truncate,
  toTitleCase,
  slugToTitle,
  toKebabCase,
  toCamelCase,
  pluralize,
  // ID Generation
  generateUniqueId,
  generatePrefixedId,
  generateShortId,
  generateNanoId,
  // Country Codes
  countryCodes,
  getCountryByCode,
  getCountryByISO,
  getDefaultCountry,
  formatPhoneWithCountry,
  parsePhoneNumber,
  // Theme Manager
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  initializeTheme,
  getThemePreloadScript,
} from '@yobolabs/core';

// Types
import type { CountryCode } from '@yobolabs/core';
```

### Stores

```typescript
import {
  // Auth Store
  createAuthStore,
  useAuthStore,
  isAuthStoreAuthenticated,
  isSigningOut,
  authStoreHasPermission,
  getUserPermissions,
  getCurrentUser,
  getCurrentRole,
  // Permission Store
  createPermissionStore,
  usePermissionStore,
  updatePermissionCacheOrg,
  clearPermissionCache,
  getPermissions,
  getRoles,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  // UI Store
  createUIStore,
  useUIStore,
  isSidebarOpen,
  getTheme,
  toggleSidebar,
  setTheme,
  // Theme Store
  createThemeStore,
  useThemeStore,
  getThemePreference,
  setThemePreference,
} from '@yobolabs/core';

// Types
import type {
  AuthState,
  AuthActions,
  AuthStore,
  UserProfile,
  UserRole,
  PermissionObject,
  SessionInfo,
  PermissionState,
  PermissionActions,
  PermissionStore,
  UIState,
  UIActions,
  UIStore,
  ThemeState,
  ThemeActions,
  ThemeStore,
} from '@yobolabs/core';
```

### Hooks

```typescript
import {
  // Auth hook factories
  createUseAuthSession,
  createUsePermission,
  createUsePermissions,
  createUseCurrentUser,
  createUsePermissionCheck,
  createUsePermissionConnectionStatus,
  usePermissionSSE,
  AuthUtils,
  // Utility hooks
  useIsClient,
  useModalState,
  // Table hooks
  useTable,
  useTableSelection,
  useTableFilter,
  useTableSearch,
  useTableVisibility,
  useTableExport,
  useTableSort,
  useTableState,
} from '@yobolabs/core';

// Types
import type {
  AuthSessionData,
  UseAuthSessionResult,
  UsePermissionsResult,
  UseCurrentUserResult,
  PermissionCheckOptions,
  SSEPermissionMessage,
  UsePermissionCheckResult,
  ModalState,
  UseModalStateReturn,
  SortingState,
  UseTableProps,
  UseTableReturn,
  // ... and more
} from '@yobolabs/core';
```

### Providers

```typescript
import {
  // Theme Providers
  ThemeProvider,
  useTheme,
  UserThemeProvider,
  useUserTheme,
  // tRPC Provider Factory
  createTRPCProvider,
  createTRPCQueryClient,
  getBaseUrl,
  getTRPCUrl,
} from '@yobolabs/core';

// Types
import type {
  ThemeMode,
  ThemeContextValue,
  ThemeProviderProps,
  UserThemeProviderProps,
  TRPCProviderConfig,
  QueryClientConfig,
  TRPCProviderProps,
} from '@yobolabs/core';
```

### UI Components

```typescript
import {
  // Permission Context
  PermissionContext,
  PermissionProvider,
  usePermissionContext,
  // WithPermission factories
  createUsePermissionGate,
  createWithPermission,
  createWithPermissionHOC,
  // Secure component factory
  createSecure,
  useFormDisabledContext,
  // Theme components
  ThemeToggle,
  ThemeToggleThreeState,
  // Admin page factories
  createThemeManagementPage,
  createPermissionManagementPage,
  // Role dialog factories
  createDeleteRoleDialogFactory,
  createBulkDeleteDialogFactory,
  createCreateRoleDialogFactory,
} from '@yobolabs/core';
```

---

## Database Module (`@yobolabs/core/db`)

Database client creation and configuration.

```typescript
import {
  createDbClient,
  createExtendedDbClient,
  createRawClient,
  createDbClients,
  createDbClientsFromEnv,
  schema,
} from '@yobolabs/core/db';

// Types
import type {
  DbConfig,
  DbClient,
  PoolConfig,
  DbClientFactoryConfig,
  DbClients,
} from '@yobolabs/core/db';
```

### Usage Examples

```typescript
// Basic client
const db = createDbClient({
  connectionString: process.env.DATABASE_URL!,
});

// Extended client with custom schema
const db = createExtendedDbClient({
  connectionString: process.env.DATABASE_URL!,
  schema: { ...coreSchema, ...appSchema },
});

// Full client factory (app, admin, migrate)
const { appDb, adminDb, migrateDb } = createDbClientsFromEnv();
```

---

## Database Schema (`@yobolabs/core/db/schema`)

Core database tables for multi-tenant SaaS.

### Organizations & Users (`orgs.ts`)

```typescript
import {
  // Tables
  orgs,
  users,
  // Relations
  orgsRelations,
  usersRelations,
  // Enums
  businessCategoryEnum,
} from '@yobolabs/core/db/schema';

// Types
import type {
  Org,
  NewOrg,
  User,
  NewUser,
} from '@yobolabs/core/db/schema';
```

**Tables:**
- `orgs` - Organizations with business settings, currency, copilot config
- `users` - Users with auth preferences, current org, wizard state

### RBAC (`rbac.ts`)

```typescript
import {
  // Tables
  roles,
  permissions,
  rolePermissions,
  userRoles,
  // Relations
  rolesRelations,
  permissionsRelations,
  rolePermissionsRelations,
  userRolesRelations,
} from '@yobolabs/core/db/schema';
```

**Tables:**
- `roles` - Role definitions (system/global/org-specific)
- `permissions` - Permission definitions with slugs and categories
- `rolePermissions` - Role-to-permission mappings
- `userRoles` - User-to-role assignments per organization

### Authentication (`auth.ts`)

```typescript
import {
  // Tables
  authAccounts,
  authSessions,
  authLogs,
  // Relations
  authAccountsRelations,
  authSessionsRelations,
  authLogsRelations,
  // Constants
  AuthProviderTypes,
} from '@yobolabs/core/db/schema';

// Types
import type {
  AuthAccount,
  NewAuthAccount,
  AuthSession,
  NewAuthSession,
  AuthLog,
  NewAuthLog,
  AuthProviderType,
} from '@yobolabs/core/db/schema';
```

**Tables:**
- `authAccounts` - Multi-provider auth (email, OAuth, WhatsApp)
- `authSessions` - Temporary auth sessions for verification flows
- `authLogs` - Security audit logs

### Other Schema Files

```typescript
import {
  // Audit logs
  auditLogs,
  auditLogsRelations,

  // Themes
  themes,
  themesRelations,

  // System config
  systemConfig,

  // Feature flags
  featureFlags,
  featureFlagOverrides,

  // API keys
  apiKeys,
  apiKeyUsage,

  // Organization settings
  orgSettings,
  orgAuditLogs,
} from '@yobolabs/core/db/schema';
```

---

## Database Seeds (`@yobolabs/core/db/seeds`)

Seeding utilities for core data.

```typescript
import {
  // Seed functions
  seedPermissions,
  validatePermissions,
  seedRoles,
  getRoleSummary,
  seedThemes,
  ensureDefaultTheme,

  // Default data
  DEFAULT_THEMES,
  EXTENDED_THEMES,

  // Utilities
  createSeedResult,
  mergeSeedResults,
} from '@yobolabs/core/db/seeds';

// Types
import type {
  SeedDatabase,
  PermissionSeedData,
  PermissionSeedSchema,
  PermissionSeedOptions,
  RoleSeedData,
  RoleSeedSchema,
  RoleSeedOptions,
  ThemeSeedData,
  ThemeSeedSchema,
  ThemeSeedOptions,
  SeedResult,
} from '@yobolabs/core/db/seeds';
```

### Usage Example

```typescript
import { seedPermissions, seedRoles, seedThemes } from '@yobolabs/core/db/seeds';
import { permissions, roles, rolePermissions, themes } from '@/db/schema';
import { getAllPermissions } from '@/permissions/registry';

// Seed permissions from registry
await seedPermissions(db, { permissions }, getAllPermissions());

// Seed roles with permission mappings
await seedRoles(db, { roles, permissions, rolePermissions }, DEFAULT_ROLES, {
  defaultOrgId: 1,
});

// Seed themes
await seedThemes(db, { themes }, DEFAULT_THEMES);
```

---

## tRPC Module (`@yobolabs/core/trpc`)

**Important:** This module is for server-side use only. Don't import in client code.

```typescript
import {
  // Context
  createTRPCContext,
  isAuthenticated,
  requireActor,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,

  // Router Factory
  router,
  middleware,
  publicProcedure,
  protectedProcedure,
  permissionProcedure,
  anyPermissionProcedure,
  createRouterWithActor,
  composeRouters,
} from '@yobolabs/core/trpc';

// Types
import type {
  Actor,
  Session,
  TRPCContext,
  AuthenticatedContext,
  CreateContextOptions,
  RouterProcedureConfig,
  ExtensionRouter,
} from '@yobolabs/core/trpc';
```

### Key Functions

**`createRouterWithActor`** - Creates a router from a configuration object:

```typescript
const myRouter = createRouterWithActor({
  list: {
    meta: { permission: 'module:read' },
    input: listSchema,
    handler: async ({ actor, db, input }) => {
      // actor.orgId, actor.userId available
      return db.query.myTable.findMany({
        where: eq(myTable.orgId, actor.orgId),
      });
    },
  },
});
```

**Procedure Helpers:**
- `publicProcedure` - No auth required
- `protectedProcedure` - Requires authenticated user
- `permissionProcedure('slug')` - Requires specific permission
- `anyPermissionProcedure(['a', 'b'])` - Requires any of the permissions

---

## Router Factories (`@yobolabs/core/trpc/routers`)

Pre-built router configurations.

```typescript
import {
  // Types
  type ServiceContext,
  type HandlerContext,
  type CacheConfig,
  type RouteConfig,
  type RouterConfig,
  type RouterFactoryDeps,
  type RouterFactoryResult,

  // Permission router
  createPermissionRouterConfig,
  permissionRouterConfig,
  createPermissionSchema,
  updatePermissionSchema,

  // Theme router
  createThemeRouterConfig,
  themeRouterConfig,
  themeCreateSchema,
  themeUpdateSchema,
  SDKThemeRepository,
} from '@yobolabs/core/trpc/routers';
```

### Usage Examples

```typescript
// Option 1: Factory pattern with custom repository
import { createThemeRouterConfig } from '@yobolabs/core/trpc/routers';
import { MyThemeRepository } from '@/server/repos/theme.repository';
import { createRouterWithActor } from '@yobolabs/framework/router';

export const themeRouter = createRouterWithActor(
  createThemeRouterConfig({ Repository: MyThemeRepository })
);

// Option 2: Pre-built config (zero boilerplate)
import { themeRouterConfig } from '@yobolabs/core/trpc/routers';
import { createRouterWithActor } from '@yobolabs/framework/router';

export const themeRouter = createRouterWithActor(themeRouterConfig);
```

---

## Permissions Module (`@yobolabs/core/permissions`)

Permission registry and utilities.

```typescript
import {
  // Registry
  corePermissions,
  getAllPermissions,
  getPermissionsByCategory,
  getPermissionsByModule,
  getPermissionBySlug,
  isValidPermissionSlug,
  getAllPermissionSlugs,
  getModuleDependencies,
  getOrgRequiredPermissions,
  getCriticalPermissions,
  validatePermissionDependencies,
  getRegistrySummary,

  // Merger
  mergePermissions,
  mergePermissionsWithResult,
  validatePermissionNamespacing,
} from '@yobolabs/core/permissions';

// Types
import type {
  PermissionCategory,
  PermissionDefinition,
  PermissionModule,
  PermissionRegistry,
  PermissionSlug,
  MergeOptions,
  MergeResult,
  PermissionCheckConfig,
  ModulePermissionContext,
  PermissionValidationResult,
  ExtensionPermissionModule,
} from '@yobolabs/core/permissions';
```

### Usage Example

```typescript
// Merge app permissions with core
const appPermissions = mergePermissions(corePermissions, {
  projects: {
    name: 'Projects',
    permissions: {
      'projects:read': { name: 'View Projects', category: 'read' },
      'projects:write': { name: 'Manage Projects', category: 'write' },
    },
  },
});
```

---

## RBAC Module (`@yobolabs/core/rbac`)

Role-based access control system.

```typescript
import {
  // Types
  type Role,
  type RoleWithStats,
  type Permission,
  type PermissionWithUsage,

  // Repositories
  RoleRepository,
  SDKRoleRepository,
  sdkRoleRepositorySchema,
  PermissionRepository,
  SDKPermissionRepository,

  // Services
  RoleService,
  RbacError,
  createRoleService,
  createSDKRoleService,
  SDKRoleService,
  ADMIN_FULL_ACCESS_PERMISSION,

  // Utilities
  hasSystemAccess,
  isSystemRole,
  isGlobalRole,
  isOrgSpecificRole,
  hasPlatformSystemRole,
  hasBackofficeAccess,
  canManageRoles,
  canViewRoles,
  canAssignPermissions,
  SYSTEM_ROLES,
  ORG_ROLES,

  // Schemas
  createRoleSchema,
  updateRoleSchema,
  roleFiltersSchema,
  assignPermissionsSchema,
  removePermissionsSchema,
  bulkUpdateRolesSchema,
  bulkDeleteRolesSchema,

  // Router Config
  createRoleRouterConfig,
  roleRouterConfig,
  defaultCreateServiceContext,
} from '@yobolabs/core/rbac';
```

### Usage Example

```typescript
import { RoleService, hasSystemAccess } from '@yobolabs/core/rbac';

// Check if user has system-level access
if (hasSystemAccess(user.permissions)) {
  // User can access admin features
}

// Create role service
const roleService = new RoleService(schema, {
  onPermissionsChanged: async (roleId, userIds) => {
    // Broadcast real-time updates
  }
});
```

---

## RLS Module (`@yobolabs/core/rls`)

Row-Level Security configuration and deployment.

```typescript
import {
  // Registry
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

  // Context
  RLS_ORG_VAR,
  RLS_USER_VAR,
  setRlsContext,
  clearRlsContext,
  withRlsContext,
  hasRlsContext,
  getRlsContext,

  // Monitor
  createDbIntrospection,
  hasColumn,
  getTablesWithRlsEnabled,
  getTablesWithPolicies,
  getRlsStatusSummary,

  // Policy Generators
  generatePolicyCondition,
  generatePublicPolicies,
  generateOrgPolicies,
  generateWorkspacePolicies,
  generateUserPolicies,
  generatePoliciesForIsolation,
  analyzePermissionRequirements,
  RLS_CONTEXT_FUNCTIONS,
  RLS_ROLES_SQL,

  // Deploy
  deployRls,
  ensureConfigurationFunctions,
  ensureRlsRoles,
  ensureRequiredColumns,
  generateTablePolicySet,
  executePolicySet,
  generateMigrationSQL,
  previewTablePolicies,
  validatePolicyGeneration,
} from '@yobolabs/core/rls';

// Types
import type {
  RlsIsolation,
  RlsPolicy,
  RlsTableConfig,
  RlsRegistry,
  TableValidationResult,
  RlsRegistryStats,
  PolicyTemplate,
  TablePolicySet,
  PolicyGenerationResult,
  DeployOptions,
  RlsDbClient,
  DeployDeps,
} from '@yobolabs/core/rls';
```

### RLS Isolation Types

- `'org'` - Row isolated by `org_id` (most common)
- `'workspace'` - Row isolated by `workspace_id`
- `'user'` - Row isolated by `user_id`
- `'public'` - No RLS, accessible to all

### Usage Example

```typescript
// Define RLS registry
const appRlsTables = createRlsRegistry({
  projects: {
    isolation: 'org',
    orgId: true,
    workspaceId: true,
    policies: { select: true, insert: true, update: true, delete: true },
  },
});

// Merge with core
const fullRegistry = mergeRlsRegistries(coreRlsTables, appRlsTables);

// Deploy RLS policies
await deployRls({
  registry: fullRegistry,
  db: adminDb,
});
```

---

## Auth Module (`@yobolabs/core/auth`)

Authentication configuration and providers.

```typescript
import {
  // Configuration
  createAuthConfig,

  // Providers
  FacebookProvider,
  InstagramProvider,
  TikTokProvider,
  createFacebookProvider,
  createInstagramProvider,
  createTikTokProvider,

  // Token Blacklist
  tokenBlacklist,
  getTokenId,
  blacklistToken,
  blacklistUserTokens,
  isTokenValid,
  BLACKLIST_REASONS,

  // Auth Error Codes
  AuthErrorCode,
  AuthEventType,

  // Schemas
  registerSchema,
  loginSchema,
  updateProfileSchema,
  sessionTimeoutOptions,
  SESSION_TIMEOUT_VALUES,
  sessionPreferenceSchema,
  userProfileSchema,
  changePasswordSchema,

  // Repository
  createAuthRepositoryClass,
  SDKAuthRepository,

  // Router Config
  createAuthRouterConfig,
  createGetCurrentUserHandler,
  AuthRouterError,
} from '@yobolabs/core/auth';

// Types
import type {
  AuthConfig,
  OAuthProviderOptions,
  FacebookProfile,
  InstagramProfile,
  TikTokProfile,
  BlacklistReason,
  JWTTokenLike,
  OrgUser,
  SessionRole,
  SessionPermission,
  AuthUser,
  AuthError,
  AuthResult,
  LoginCredentials,
  RegisterCredentials,
  AuthHookReturn,
  IAuthRepository,
} from '@yobolabs/core/auth';
```

---

## Organizations Module (`@yobolabs/core/organizations`)

Organization management.

```typescript
import {
  // Constants
  ORGANIZATION_STATUS,
  ORGANIZATION_ROLES,

  // Schemas
  orgListSchema,
  orgGetByIdSchema,
  orgCreateSchema,
  orgUpdateSchema,
  orgDeleteSchema,
  orgAnalyticsSchema,
  orgGetSettingsSchema,
  orgUpdateSettingsSchema,
  orgAuditLogsSchema,
  orgAddUserSchema,
  orgRemoveUserSchema,
  orgUpdateUserRoleSchema,

  // Repository
  createOrgRepositoryClass,

  // Service
  createOrgServiceClass,
  OrgServiceError,
  OrgAuditActions,

  // Router Config
  createOrgRouterConfig,
  OrgRouterError,
} from '@yobolabs/core/organizations';

// Types
import type {
  OrgRecord,
  OrgWithStats,
  OrgStats,
  OrgSetting,
  OrgAuditLogRecord,
  OrgFilters,
  OrgListOptions,
  OrgCreateData,
  OrgUpdateData,
  OrgListResult,
  OrgDeleteResult,
  OrgAnalytics,
  IOrgRepository,
  IOrgService,
} from '@yobolabs/core/organizations';
```

---

## Users Module (`@yobolabs/core/users`)

User management.

```typescript
import {
  // Schemas
  userFiltersSchema,
  userCreateSchema,
  userUpdateSchema,
  assignRoleSchema,
  removeRoleSchema,
  removeFromOrgSchema,
  changePasswordSchema,
  updateSessionPreferenceSchema,
  updateThemePreferenceSchema,
  checkUsernameSchema,
  userBulkUpdateSchema,
  userBulkDeleteSchema,

  // Repository
  createUserRepositoryClass,

  // Router Config
  createUserRouterConfig,
  UserRouterError,
  SDKUserRepository,
  userRouterConfig,

  // Service
  createUserService,
  createDefaultUserService,
  UserServiceError,
} from '@yobolabs/core/users';

// Types
import type {
  UserRecord,
  UserWithRoles,
  UserWithStats,
  UserRole,
  UserPermission,
  UserFilters,
  UserListOptions,
  UserCreateData,
  UserUpdateData,
  UserListResult,
  BulkOperationResult,
  IUserRepository,
  IUserService,
} from '@yobolabs/core/users';
```

---

## User-Org Module (`@yobolabs/core/user-org`)

User-organization relationship management.

```typescript
import {
  // Schemas
  getCurrentOrgSchema,
  switchOrgSchema,
  validateOrgAccessSchema,
  assignRoleSchema,
  removeRoleSchema,
  getUsersByRoleSchema,
  getAvailableRolesSchema,
  getUserRolesAllOrgsSchema,

  // Repository
  createUserOrgRepository,

  // Router Config
  createUserOrgRouterConfig,
  userOrgRouterConfig,
  SDKUserOrgRepository,

  // Service
  createUserOrgService,
  UserOrgService,
} from '@yobolabs/core/user-org';

// Types
import type {
  UserRoleData,
  OrganizationInfo,
  RoleInfo,
  UserOrgData,
  RoleAssignmentData,
  UserOrgContext,
  UserOrgMembership,
  AssignableRole,
  AssignableOrganization,
} from '@yobolabs/core/user-org';
```

---

## Themes Module (`@yobolabs/core/themes`)

Theme management system.

```typescript
import {
  // Repository
  ThemeRepository,

  // Schemas
  createThemeSchema,
  updateThemeSchema,
  getThemeByUuidSchema,
  getThemeByIdSchema,
  themeListOptionsSchema,
  themeFiltersSchema,
} from '@yobolabs/core/themes';

// Types
import type {
  Theme,
  ThemeWithStats,
  ThemeCreateData,
  ThemeUpdateData,
  ThemeFilters,
  ThemeListOptions,
  ThemeListResult,
} from '@yobolabs/core/themes';
```

---

## API Keys Module (`@yobolabs/core/api-keys`)

API key management for external integrations.

```typescript
import {
  // Key generation
  generateApiKey,
  hashApiKey,
  validateApiKeyFormat,
  validateApiKeyChecksum,
  extractKeyEnvironment,
  DEFAULT_KEY_PREFIX,

  // Repository
  createApiKeysRepository,
  SDKApiKeysRepository,

  // Router configuration
  createApiKeysRouterConfig,
  apiKeysRouterConfig,
} from '@yobolabs/core/api-keys';

// Types
import type {
  ApiKeysRepository,
  ApiKeysTableSchema,
  ApiKeysRepositoryConfig,
  CreateApiKeysRouterConfigOptions,
  ApiKeysServiceContext,
} from '@yobolabs/core/api-keys';
```

---

## System Config Module (`@yobolabs/core/system-config`)

System configuration management.

```typescript
import {
  // Repository
  createSystemConfigRepository,
  createCachingSystemConfigRepository,
  SDKSystemConfigRepository,

  // Router configuration
  createSystemConfigRouterConfig,
  systemConfigRouterConfig,
} from '@yobolabs/core/system-config';

// Types
import type {
  SystemConfigRepository,
  CachingSystemConfigRepository,
  SystemConfigTableSchema,
  SystemConfigRepositoryConfig,
  CreateSystemConfigRouterConfigOptions,
  SystemConfigServiceContext,
} from '@yobolabs/core/system-config';
```

---

## Hooks Module (`@yobolabs/core/hooks`)

React hooks for common functionality.

### Auth Hooks

```typescript
import {
  createUseAuthSession,
  createUsePermission,
  createUsePermissions,
  createUseCurrentUser,
  usePermissionSSE,
  createUsePermissionCheck,
  createUsePermissionConnectionStatus,
  AuthUtils,
} from '@yobolabs/core/hooks';

// Types
import type {
  AuthSessionData,
  UseAuthSessionResult,
  UsePermissionsResult,
  UseCurrentUserResult,
  PermissionCheckOptions,
  SSEPermissionMessage,
  UsePermissionCheckResult,
} from '@yobolabs/core/hooks';
```

### Utility Hooks

```typescript
import {
  useIsClient,
  useModalState,
  useHorizontalScroll,
  useDebounce,
  useMediaQuery,
  BREAKPOINT_QUERIES,
  useViewToggle,
} from '@yobolabs/core/hooks';

// Types
import type {
  ModalState,
  UseModalStateReturn,
  ScrollState,
  UseHorizontalScrollReturn,
  ViewMode,
  UseViewToggleReturn,
} from '@yobolabs/core/hooks';
```

### Table Hooks

```typescript
import {
  useTable,
  useTableSelection,
  useTableFilter,
  useTableSearch,
  useTableVisibility,
  useTableExport,
  useTableSort,
  useTableState,
} from '@yobolabs/core/hooks';

// Types
import type {
  SortingState,
  UseTableProps,
  UseTableReturn,
  UseTableSelectionProps,
  UseTableSelectionReturn,
  UseTableFilterProps,
  UseTableFilterReturn,
  UseTableSearchProps,
  UseTableSearchReturn,
  UseTableVisibilityProps,
  UseTableVisibilityReturn,
  UseTableExportProps,
  UseTableExportReturn,
  SortDirection,
  SortConfig,
  UseTableSortProps,
  UseTableSortReturn,
  UseTableStateProps,
  UseTableStateReturn,
} from '@yobolabs/core/hooks';
```

---

## Stores Module (`@yobolabs/core/stores`)

Zustand stores for client-side state management.

```typescript
import {
  // Auth Store
  createAuthStore,
  useAuthStore,
  isAuthenticated,
  isSigningOut,
  hasPermission,
  getUserPermissions,
  getCurrentUser,
  getCurrentRole,

  // Permission Store
  createPermissionStore,
  usePermissionStore,
  updatePermissionCacheOrg,
  clearPermissionCache,
  getPermissions,
  getRoles,
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,

  // UI Store
  createUIStore,
  useUIStore,
  isSidebarOpen,
  getTheme,
  toggleSidebar,
  setTheme,

  // Theme Store
  createThemeStore,
  useThemeStore,
  getThemePreference,
  setThemePreference,

  // Org Switch Store
  createOrgSwitchStore,
  useOrgSwitchStore,
  isOrgSwitching,
  getTargetOrgName,
  startOrgSwitch,
  endOrgSwitch,
} from '@yobolabs/core/stores';

// Types
import type {
  AuthState,
  AuthActions,
  AuthStore,
  UserProfile,
  UserRole,
  PermissionObject,
  SessionInfo,
  PermissionState,
  PermissionActions,
  PermissionStore,
  UIState,
  UIActions,
  UIStore,
  ThemeState,
  ThemeActions,
  ThemeStore,
  OrgSwitchState,
  OrgSwitchActions,
  OrgSwitchStore,
} from '@yobolabs/core/stores';
```

---

## Providers Module (`@yobolabs/core/providers`)

React context providers.

```typescript
import {
  // Theme Providers
  ThemeProvider,
  useTheme,
  UserThemeProvider,
  useUserTheme,

  // tRPC Providers
  createTRPCProvider,
  createTRPCQueryClient,
  getBaseUrl,
  getTRPCUrl,
} from '@yobolabs/core/providers';

// Types
import type {
  ThemeMode,
  ThemeContextValue,
  ThemeProviderProps,
  UserThemeProviderProps,
  TRPCProviderConfig,
  QueryClientConfig,
  TRPCProviderProps,
} from '@yobolabs/core/providers';
```

---

## UI Module (`@yobolabs/core/ui`)

UI component factories using dependency injection pattern.

### Auth Components

```typescript
import {
  PermissionContext,
  PermissionProvider,
  usePermissionContext,
  createUsePermissionGate,
  createWithPermission,
  createWithPermissionHOC,
  createSecure,
  useFormDisabledContext,
  createAuthGuard,
  createAuthProvider,
  SimpleAuthProvider,
  createAuthSkeletons,
  SimpleAuthSkeletons,
} from '@yobolabs/core/ui';
```

### Data Table Components

```typescript
import {
  createBaseListTable,
  createDataTableColumnHeader,
  createDataTablePagination,
  createDataTableWithToolbar,
} from '@yobolabs/core/ui';

// Types
import type {
  DataTableUIComponents,
  ColumnHeaderUIComponents,
  PaginationUIComponents,
  DataTableWithToolbarUIComponents,
  StatusOption,
  ListToolbarProps,
  PaginationConfig,
  BaseListTableProps,
  DataTableColumnHeaderProps,
  DataTablePaginationProps,
  FilterColumnConfig,
  BulkAction,
  DataTableWithToolbarConfig,
  DataTableWithToolbarProps,
} from '@yobolabs/core/ui';
```

### Feedback Components

```typescript
import {
  EmptyState,
  createErrorDisplay,
  SimpleErrorDisplay,
  CircularProgress,
  CIRCULAR_PROGRESS_COLOR_VARIANTS,
} from '@yobolabs/core/ui';
```

### Display Components

```typescript
import {
  MetadataGrid,
  createBreadcrumbs,
  SimpleBreadcrumbs,
} from '@yobolabs/core/ui';
```

### Skeleton Components

```typescript
import {
  createTableSkeleton,
  SimpleTableSkeleton,
  createCardSkeleton,
  SimpleCardSkeleton,
  FullScreenLoading,
  CenteredSpinner,
} from '@yobolabs/core/ui';
```

### Theme Components

```typescript
import {
  ThemeToggle,
  ThemeToggleThreeState,
} from '@yobolabs/core/ui';
```

### Admin Components

```typescript
import {
  createThemeManagementPage,
  createPermissionManagementPage,
  createDeleteRoleDialogFactory,
  createBulkDeleteDialogFactory,
  createCreateRoleDialogFactory,
  createManagePermissionsMatrix,
  createManagePermissionsDialog,
} from '@yobolabs/core/ui';
```

---

## Library Utilities (`@yobolabs/core/lib`)

Utility functions.

### Class Name Utility

```typescript
import { cn } from '@yobolabs/core/lib';

// Merge classes with Tailwind conflict resolution
const className = cn('px-4 py-2', isActive && 'bg-blue-500', className);
```

### ID Generation

```typescript
import {
  generateId,
  generateUniqueId,
  generatePrefixedId,
  generateShortId,
  generateNanoId,
} from '@yobolabs/core/lib';

generatePrefixedId('user');  // 'user_abc123xyz'
generateShortId();           // 'a7bK9x'
generateNanoId();            // '21 character nanoid'
```

### Formatters

```typescript
import {
  // Date
  formatDate,
  formatISODate,
  formatLocalDate,
  formatLocalDateTime,
  formatRelativeTime,
  // Number
  formatNumber,
  formatCurrency,
  formatPercent,
  formatBytes,
  // String
  truncate,
  toTitleCase,
  slugToTitle,
  toKebabCase,
  toCamelCase,
  pluralize,
} from '@yobolabs/core/lib';

formatCurrency(1234.56, 'USD');     // '$1,234.56'
formatRelativeTime(new Date());     // '2 hours ago'
pluralize(5, 'item', 'items');      // '5 items'
```

### Country Codes

```typescript
import {
  countryCodes,
  getCountryByCode,
  getCountryByISO,
  getDefaultCountry,
  formatPhoneWithCountry,
  parsePhoneNumber,
} from '@yobolabs/core/lib';

// Types
import type { CountryCode } from '@yobolabs/core/lib';
```

### Theme Manager

```typescript
import {
  getStoredTheme,
  setStoredTheme,
  applyTheme,
  removeTheme,
  initializeTheme,
  getThemePreloadScript,
  registerGlobalApplyTheme,
} from '@yobolabs/core/lib';
```

### Logger

```typescript
import { logger } from '@yobolabs/core/lib';

logger.debug('Debug message');  // Only in development
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message');
```

---

## CLI Module (`@yobolabs/core/cli`)

Command-line utilities.

```typescript
import {
  CLI_VERSION,
  createCliContext,

  // Database CLI
  runMigrations,
  seedDatabase,
  deployRlsPolicies,

  // Seed Utilities
  seedLog,
  createSeedResult,
  mergeSeedResults,
  runSeed,
  runSeedsSequential,

  // Default seed data
  CORE_PERMISSION_SEEDS,
  CORE_ROLE_SEEDS,
  CORE_THEME_SEEDS,
} from '@yobolabs/core/cli';

// Types
import type {
  CliContext,
  SeedContext,
  SeedResult,
  UpsertOptions,
} from '@yobolabs/core/cli';
```

---

## Config Module (`@yobolabs/core/config`)

Application configuration system.

```typescript
import {
  defineSaasConfig,
  defineExtension,

  // Schemas
  saasConfigSchema,
  extensionSchema,
  authConfigSchema,
  databaseConfigSchema,
  uiConfigSchema,
  featuresConfigSchema,

  // Loader
  loadExtensions,
  runExtensionHooks,
  runExtensionSeeds,
} from '@yobolabs/core/config';

// Types
import type {
  SaasConfig,
  Extension,
  AuthConfig,
  DatabaseConfig,
  UIConfig,
  FeaturesConfig,
  LoadedExtensions,
} from '@yobolabs/core/config';
```

### Usage Example

```typescript
// saas.config.ts
import { defineSaasConfig, defineExtension } from '@yobolabs/core/config';
import { projectsExtension } from './extensions/projects';

export default defineSaasConfig({
  app: {
    name: 'My SaaS App',
    version: '1.0.0',
  },
  auth: {
    providers: ['credentials', 'google'],
    session: { strategy: 'jwt' },
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
  extensions: [projectsExtension],
});
```

---

## Middleware Module (`@yobolabs/core/middleware`)

Security middleware for Next.js.

```typescript
import {
  createSecurityMiddleware,
  createNextSecurityMiddleware,
  defaultMiddlewareConfig,
} from '@yobolabs/core/middleware';

// Types
import type {
  SecurityMiddlewareConfig,
  SecurityAlertDetails,
  XFrameOptions,
  COEPPolicy,
  COOPPolicy,
  CORPPolicy,
  CSPDirective,
  CachePatterns,
  MiddlewareResponse,
} from '@yobolabs/core/middleware';
```

### Usage Example

```typescript
// middleware.ts
import { createNextSecurityMiddleware, defaultMiddlewareConfig } from '@yobolabs/core/middleware';
import { NextResponse } from 'next/server';

export default createNextSecurityMiddleware({
  allowedOrigins: ['https://myapp.com'],
  enableCVEProtection: true,
}, { NextResponse });

export const config = defaultMiddlewareConfig;
```

---

## Architecture Patterns

### Handler Pattern (Critical)

When using `createRouterWithActor`, handlers receive destructured parameters:

```typescript
// CORRECT - SDK pattern
handler: async ({ actor, db, input }) => {
  const orgId = actor.orgId;  // Works!
  const userId = actor.userId;
  // ...
}

// WRONG - causes undefined errors
handler: async ({ ctx, input }) => {
  const orgId = ctx.actor.orgId;  // FAILS!
}
```

### Public Route Pattern

For routes that bypass RLS:

```typescript
import { withPrivilegedDb } from '@yobolabs/framework';

handler: async ({ db, input }) => {
  const result = await withPrivilegedDb(async (privDb) => {
    return privDb.query.presentations.findFirst({
      where: eq(presentations.publishedSlug, input.slug),
    });
  });
}
```

### Permission Registration

Permissions must be registered in three places:
1. Permission registry (`permissions/registry.ts`)
2. Types file (`types/permissions.ts`)
3. Database (via seeding)

---

## Version

Package version: `0.1.0`
