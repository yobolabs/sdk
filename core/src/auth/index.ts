/**
 * Authentication Module
 *
 * Authentication configuration and helpers.
 */

// Placeholder - full auth implementation will be added when migrating
// from saas-core-v2's auth system

export interface AuthConfig {
  providers: string[];
  session?: {
    strategy?: 'jwt' | 'database';
    maxAge?: number;
  };
  pages?: {
    signIn?: string;
    signUp?: string;
    error?: string;
  };
  callbacks?: Record<string, unknown>;
}

/**
 * Create authentication configuration.
 *
 * Note: This is a placeholder. The actual implementation will integrate
 * with NextAuth.js and should be used with the app's auth configuration.
 */
export function createAuthConfig(_config: AuthConfig) {
  // Placeholder - returns config as-is for now
  // Full implementation will map to NextAuth config
  return _config;
}
