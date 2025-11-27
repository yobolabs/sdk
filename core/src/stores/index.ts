/**
 * State Stores Module
 *
 * Zustand stores for client-side state management.
 */

// Placeholder exports - actual stores will be migrated from saas-core-v2

export interface AuthStoreState {
  isAuthenticated: boolean;
  user: unknown | null;
  login: (user: unknown) => void;
  logout: () => void;
}

export interface UIStoreState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// Placeholder - actual implementation uses Zustand
export const useAuthStore = () => ({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useUIStore = () => ({
  sidebarOpen: true,
  toggleSidebar: () => {},
  theme: 'system' as const,
  setTheme: () => {},
});
