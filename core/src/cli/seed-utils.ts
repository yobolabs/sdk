/**
 * Seed Utilities
 *
 * Helper functions for database seeding operations.
 * Use these in your app's seed scripts.
 */

import type { DbClient } from '../db';

// =============================================================================
// TYPES
// =============================================================================

export interface SeedContext {
  db: DbClient;
  verbose?: boolean;
}

export interface SeedResult {
  success: boolean;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

export interface UpsertOptions {
  /** Column(s) to check for existing records */
  conflictKeys: string[];
  /** Whether to update existing records */
  updateOnConflict?: boolean;
}

// =============================================================================
// LOGGING
// =============================================================================

export function seedLog(
  message: string,
  type: 'info' | 'success' | 'error' | 'warning' = 'info'
): void {
  const icons = {
    info: '🌱',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  };
  console.log(`${icons[type]} ${message}`);
}

// =============================================================================
// SEED HELPERS
// =============================================================================

/**
 * Create an empty seed result.
 */
export function createSeedResult(): SeedResult {
  return {
    success: true,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };
}

/**
 * Merge multiple seed results.
 */
export function mergeSeedResults(...results: SeedResult[]): SeedResult {
  return results.reduce(
    (acc, result) => ({
      success: acc.success && result.success,
      inserted: acc.inserted + result.inserted,
      updated: acc.updated + result.updated,
      skipped: acc.skipped + result.skipped,
      errors: [...acc.errors, ...result.errors],
    }),
    createSeedResult()
  );
}

/**
 * Run a seed function with error handling.
 */
export async function runSeed<T>(
  name: string,
  seedFn: () => Promise<T>,
  options: { verbose?: boolean } = {}
): Promise<T> {
  const { verbose = true } = options;

  if (verbose) {
    seedLog(`Starting: ${name}`, 'info');
  }

  try {
    const result = await seedFn();
    if (verbose) {
      seedLog(`Completed: ${name}`, 'success');
    }
    return result;
  } catch (error) {
    seedLog(`Failed: ${name} - ${error}`, 'error');
    throw error;
  }
}

/**
 * Run multiple seeds in sequence.
 */
export async function runSeedsSequential(
  seeds: Array<{ name: string; fn: () => Promise<SeedResult> }>,
  options: { verbose?: boolean; stopOnError?: boolean } = {}
): Promise<SeedResult> {
  const { verbose = true, stopOnError = true } = options;
  const results: SeedResult[] = [];

  for (const seed of seeds) {
    try {
      const result = await runSeed(seed.name, seed.fn, { verbose });
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [String(error)],
      });
      if (stopOnError) {
        break;
      }
    }
  }

  return mergeSeedResults(...results);
}

// =============================================================================
// DEFAULT SEED DATA
// =============================================================================

/**
 * Core permissions to seed (from permission registry).
 */
export const CORE_PERMISSION_SEEDS = [
  // Admin
  { slug: 'admin:full_access', name: 'Full System Access', module: 'admin' },
  { slug: 'admin:audit_logs', name: 'View Audit Logs', module: 'admin' },
  { slug: 'admin:debug_context', name: 'Debug System Context', module: 'admin' },
  { slug: 'admin:permission_management', name: 'Manage Permissions', module: 'admin' },
  { slug: 'admin:role_management', name: 'Manage Roles', module: 'admin' },
  { slug: 'admin:seed_orgs', name: 'Seed Organizations', module: 'admin' },
  { slug: 'admin:seed_rbac', name: 'Seed RBAC System', module: 'admin' },
  { slug: 'admin:system_settings', name: 'System Settings', module: 'admin' },

  // Organization
  { slug: 'org:create', name: 'Create Organizations', module: 'organization' },
  { slug: 'org:read', name: 'View Organization', module: 'organization' },
  { slug: 'org:update', name: 'Update Organization', module: 'organization' },
  { slug: 'org:delete', name: 'Delete Organization', module: 'organization' },
  { slug: 'org:list', name: 'List Organizations', module: 'organization' },
  { slug: 'org:audit', name: 'View Organization Audit Logs', module: 'organization' },
  { slug: 'org:settings:read', name: 'View Organization Settings', module: 'organization' },
  { slug: 'org:settings:update', name: 'Update Organization Settings', module: 'organization' },
  { slug: 'org:analytics', name: 'View Organization Analytics', module: 'organization' },
  { slug: 'org:cross_org_access', name: 'Cross-Organization Access', module: 'organization' },
  { slug: 'org:member', name: 'Organization Member', module: 'organization' },
  { slug: 'org:billing', name: 'Organization Billing', module: 'organization' },

  // Users
  { slug: 'user:create', name: 'Create Users', module: 'users' },
  { slug: 'user:read', name: 'View Users', module: 'users' },
  { slug: 'user:update', name: 'Update Users', module: 'users' },
  { slug: 'user:assign_roles', name: 'Assign User Roles', module: 'users' },
  { slug: 'user:delete', name: 'Delete Users', module: 'users' },

  // Roles
  { slug: 'role:create', name: 'Create Roles', module: 'roles' },
  { slug: 'role:read', name: 'View Roles', module: 'roles' },
  { slug: 'role:update', name: 'Update Roles', module: 'roles' },
  { slug: 'role:delete', name: 'Delete Roles', module: 'roles' },
  { slug: 'role:assign_permissions', name: 'Assign Permissions', module: 'roles' },

  // Themes
  { slug: 'theme:create', name: 'Create Themes', module: 'themes' },
  { slug: 'theme:read', name: 'View Themes', module: 'themes' },
  { slug: 'theme:update', name: 'Update Themes', module: 'themes' },
  { slug: 'theme:delete', name: 'Delete Themes', module: 'themes' },
] as const;

/**
 * Default system roles to seed.
 */
export const CORE_ROLE_SEEDS = [
  {
    name: 'Super User',
    description: 'Full system access - can access all organizations and features',
    isSystemRole: true,
    isGlobalRole: true,
    permissions: ['admin:full_access'],
  },
  {
    name: 'Owner',
    description: 'Organization owner with full access to organization resources',
    isSystemRole: false,
    isGlobalRole: true,
    permissions: [
      'org:read', 'org:update', 'org:delete', 'org:audit',
      'org:settings:read', 'org:settings:update', 'org:analytics', 'org:billing',
      'user:create', 'user:read', 'user:update', 'user:delete', 'user:assign_roles',
      'role:create', 'role:read', 'role:update', 'role:delete', 'role:assign_permissions',
    ],
  },
  {
    name: 'Admin',
    description: 'Organization administrator with elevated privileges',
    isSystemRole: false,
    isGlobalRole: true,
    permissions: [
      'org:read', 'org:update', 'org:audit', 'org:settings:read', 'org:analytics',
      'user:create', 'user:read', 'user:update', 'user:assign_roles',
      'role:read', 'role:update',
    ],
  },
  {
    name: 'Member',
    description: 'Standard organization member',
    isSystemRole: false,
    isGlobalRole: false,
    permissions: [
      'org:read', 'org:member',
      'user:read',
      'role:read',
    ],
  },
] as const;

/**
 * Default themes to seed.
 */
export const CORE_THEME_SEEDS = [
  {
    name: 'Light',
    slug: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      mutedForeground: '#64748b',
    },
    isDefault: true,
    isActive: true,
  },
  {
    name: 'Dark',
    slug: 'dark',
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#8b5cf6',
      background: '#0f172a',
      foreground: '#f8fafc',
      muted: '#1e293b',
      mutedForeground: '#94a3b8',
    },
    isDefault: false,
    isActive: true,
  },
] as const;
