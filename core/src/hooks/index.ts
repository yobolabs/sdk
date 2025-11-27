/**
 * React Hooks Module
 *
 * Shared React hooks for the core package.
 */

// Placeholder exports - actual hooks will be migrated from saas-core-v2
// These are stubs to allow the package to build

export function usePermissionCheck(_permission: string): boolean {
  // Placeholder - will integrate with actual permission context
  return true;
}

export function useHasPermission(_permission: string): {
  hasPermission: boolean;
  loading: boolean;
} {
  // Placeholder
  return { hasPermission: true, loading: false };
}

export function useActor() {
  // Placeholder - returns null actor
  return null;
}
