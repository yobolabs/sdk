/**
 * CLI Module
 *
 * Command-line tools for the core package.
 */

export const CLI_VERSION = '1.0.0';

// =============================================================================
// CLI CONTEXT
// =============================================================================

export interface CliContext {
  cwd: string;
  verbose: boolean;
}

export function createCliContext(options: Partial<CliContext> = {}): CliContext {
  return {
    cwd: options.cwd ?? process.cwd(),
    verbose: options.verbose ?? false,
  };
}

// =============================================================================
// DATABASE CLI
// =============================================================================

export {
  runMigrations,
  seedDatabase,
  deployRlsPolicies,
} from './db';

// =============================================================================
// SEED UTILITIES
// =============================================================================

export {
  // Logging
  seedLog,
  // Result helpers
  createSeedResult,
  mergeSeedResults,
  // Seed runners
  runSeed,
  runSeedsSequential,
  // Default seed data
  CORE_PERMISSION_SEEDS,
  CORE_ROLE_SEEDS,
  CORE_THEME_SEEDS,
} from './seed-utils';

export type {
  SeedContext,
  SeedResult,
  UpsertOptions,
} from './seed-utils';
