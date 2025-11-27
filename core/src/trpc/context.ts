/**
 * tRPC Context
 *
 * Defines the context available to all tRPC procedures.
 */

import type { DbClient } from '../db';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Actor represents the authenticated user and their permissions.
 */
export interface Actor {
  /** User ID */
  userId: number;
  /** User UUID */
  userUuid: string;
  /** User email */
  email: string | null;
  /** User name */
  name: string | null;
  /** Current organization ID */
  orgId: number | null;
  /** Current organization UUID */
  orgUuid: string | null;
  /** User's permissions in current org */
  permissions: string[];
  /** User's roles in current org */
  roles: string[];
  /** Whether user has system-level access */
  isSystemUser: boolean;
}

/**
 * Session data from authentication provider.
 */
export interface Session {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  expires: string;
}

/**
 * Base tRPC context available to all procedures.
 */
export interface TRPCContext {
  /** Database client */
  db: DbClient;
  /** Database client with RLS context set */
  dbWithRLS?: DbClient;
  /** Current session */
  session: Session | null;
  /** Actor (authenticated user with permissions) */
  actor: Actor | null;
  /** Request headers */
  headers?: Headers;
}

/**
 * Authenticated context - guaranteed to have session and actor.
 */
export interface AuthenticatedContext extends TRPCContext {
  session: Session;
  actor: Actor;
}

// =============================================================================
// CONTEXT FACTORY
// =============================================================================

export interface CreateContextOptions {
  db: DbClient;
  getSession: () => Promise<Session | null>;
  getActor?: (session: Session) => Promise<Actor | null>;
  headers?: Headers;
}

/**
 * Create tRPC context for a request.
 */
export async function createTRPCContext(
  opts: CreateContextOptions
): Promise<TRPCContext> {
  const session = await opts.getSession();

  let actor: Actor | null = null;
  if (session && opts.getActor) {
    actor = await opts.getActor(session);
  }

  return {
    db: opts.db,
    session,
    actor,
    headers: opts.headers,
  };
}

// =============================================================================
// CONTEXT HELPERS
// =============================================================================

/**
 * Check if context has authenticated session.
 */
export function isAuthenticated(ctx: TRPCContext): ctx is AuthenticatedContext {
  return ctx.session !== null && ctx.actor !== null;
}

/**
 * Get actor or throw if not authenticated.
 */
export function requireActor(ctx: TRPCContext): Actor {
  if (!ctx.actor) {
    throw new Error('Not authenticated');
  }
  return ctx.actor;
}

/**
 * Check if actor has specific permission.
 */
export function hasPermission(actor: Actor, permission: string): boolean {
  return actor.permissions.includes(permission) || actor.isSystemUser;
}

/**
 * Check if actor has any of the specified permissions.
 */
export function hasAnyPermission(actor: Actor, permissions: string[]): boolean {
  if (actor.isSystemUser) return true;
  return permissions.some(p => actor.permissions.includes(p));
}

/**
 * Check if actor has all of the specified permissions.
 */
export function hasAllPermissions(actor: Actor, permissions: string[]): boolean {
  if (actor.isSystemUser) return true;
  return permissions.every(p => actor.permissions.includes(p));
}
