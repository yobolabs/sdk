/**
 * Configuration Schema
 *
 * Zod schemas for validating application and extension configuration.
 */

import { z } from 'zod';

// =============================================================================
// EXTENSION SCHEMA
// =============================================================================

export const extensionSchema = z.object({
  /** Extension identifier */
  name: z.string().min(1),
  /** Semantic version */
  version: z.string(),
  /** Drizzle schema tables */
  schema: z.record(z.any()).optional(),
  /** Permission module */
  permissions: z.any().optional(),
  /** tRPC router */
  router: z.any().optional(),
  /** RLS table configurations */
  rls: z.array(z.any()).optional(),
  /** Lifecycle hooks */
  hooks: z.object({
    onInstall: z.function().optional(),
    onEnable: z.function().optional(),
    onDisable: z.function().optional(),
  }).optional(),
  /** Seed function */
  seeds: z.function().optional(),
});

// =============================================================================
// AUTH SCHEMA
// =============================================================================

export const authConfigSchema = z.object({
  /** Authentication providers to enable */
  providers: z.array(z.string()),
  /** Session configuration */
  session: z.object({
    strategy: z.enum(['jwt', 'database']).default('jwt'),
    maxAge: z.number().optional(),
  }).optional(),
  /** Custom pages */
  pages: z.object({
    signIn: z.string().optional(),
    signUp: z.string().optional(),
    error: z.string().optional(),
  }).optional(),
  /** Custom callbacks */
  callbacks: z.any().optional(),
});

// =============================================================================
// DATABASE SCHEMA
// =============================================================================

export const databaseConfigSchema = z.object({
  /** Database connection URL */
  url: z.string(),
  /** Admin connection URL for migrations */
  adminUrl: z.string().optional(),
  /** Migrations directory path */
  migrationsPath: z.string().default('./drizzle'),
  /** RLS configuration */
  rls: z.object({
    enabled: z.boolean().default(true),
    contextVar: z.string().default('rls.current_org_id'),
  }).optional(),
});

// =============================================================================
// UI SCHEMA
// =============================================================================

export const uiConfigSchema = z.object({
  theme: z.object({
    defaultTheme: z.enum(['light', 'dark', 'system']).default('system'),
    brandColor: z.string().optional(),
  }).optional(),
  sidebar: z.object({
    configPath: z.string().optional(),
  }).optional(),
});

// =============================================================================
// FEATURES SCHEMA
// =============================================================================

export const featuresConfigSchema = z.object({
  multiTenant: z.boolean().default(true),
  auditLog: z.boolean().default(true),
  apiKeys: z.boolean().default(false),
  themes: z.boolean().default(true),
});

// =============================================================================
// MAIN CONFIG SCHEMA
// =============================================================================

export const saasConfigSchema = z.object({
  /** Application metadata */
  app: z.object({
    name: z.string(),
    version: z.string().optional(),
  }),

  /** Authentication configuration */
  auth: authConfigSchema,

  /** Database configuration */
  database: databaseConfigSchema,

  /** Permission configuration */
  permissions: z.object({
    autoSync: z.boolean().default(true),
  }).optional(),

  /** Installed extensions */
  extensions: z.array(extensionSchema).default([]),

  /** UI configuration */
  ui: uiConfigSchema.optional(),

  /** Feature flags */
  features: featuresConfigSchema.optional(),

  /** Global hooks */
  hooks: z.record(z.function()).optional(),
});

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SaasConfig = z.infer<typeof saasConfigSchema>;
export type Extension = z.infer<typeof extensionSchema>;
export type AuthConfig = z.infer<typeof authConfigSchema>;
export type DatabaseConfig = z.infer<typeof databaseConfigSchema>;
export type UIConfig = z.infer<typeof uiConfigSchema>;
export type FeaturesConfig = z.infer<typeof featuresConfigSchema>;
