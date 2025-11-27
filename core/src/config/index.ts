/**
 * Configuration Module
 *
 * Application and extension configuration system.
 */

import { saasConfigSchema, extensionSchema, type SaasConfig, type Extension } from './schema';

// =============================================================================
// CONFIG HELPERS
// =============================================================================

/**
 * Define and validate a SaaS application configuration.
 *
 * @example
 * ```ts
 * // saas.config.ts
 * export default defineSaasConfig({
 *   app: { name: 'My App' },
 *   auth: { providers: ['credentials'] },
 *   database: { url: process.env.DATABASE_URL! },
 *   extensions: [projectsExtension],
 * });
 * ```
 */
export function defineSaasConfig(config: SaasConfig): SaasConfig {
  const validated = saasConfigSchema.parse(config);
  return validated;
}

/**
 * Define an extension with validation.
 *
 * @example
 * ```ts
 * export const projectsExtension = defineExtension({
 *   name: 'projects',
 *   version: '1.0.0',
 *   schema: projectsSchema,
 *   permissions: projectsPermissions,
 *   router: projectsRouter,
 * });
 * ```
 */
export function defineExtension(ext: Extension): Extension {
  const validated = extensionSchema.parse(ext);
  return validated;
}

// =============================================================================
// EXPORTS
// =============================================================================

// Schema
export {
  saasConfigSchema,
  extensionSchema,
  authConfigSchema,
  databaseConfigSchema,
  uiConfigSchema,
  featuresConfigSchema,
} from './schema';

// Types
export type {
  SaasConfig,
  Extension,
  AuthConfig,
  DatabaseConfig,
  UIConfig,
  FeaturesConfig,
} from './schema';

// Loader
export {
  loadExtensions,
  runExtensionHooks,
  runExtensionSeeds,
} from './loader';

export type { LoadedExtensions } from './loader';
