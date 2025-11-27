/**
 * tRPC Router Factory
 *
 * Provides router creation utilities and procedures.
 */

import { initTRPC, TRPCError } from '@trpc/server';
import type { TRPCContext, AuthenticatedContext, Actor } from './context';
import { hasPermission } from './context';
import { z } from 'zod';

// =============================================================================
// TRPC INITIALIZATION
// =============================================================================

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof z.ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

// =============================================================================
// BASE EXPORTS
// =============================================================================

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;

// =============================================================================
// MIDDLEWARE
// =============================================================================

/**
 * Middleware that enforces authentication.
 */
const enforceAuth = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user || !ctx.actor) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
      actor: ctx.actor,
    } as AuthenticatedContext,
  });
});

/**
 * Middleware that enforces a specific permission.
 */
const enforcePermission = (permission: string) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.actor) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    if (!hasPermission(ctx.actor, permission)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing permission: ${permission}`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        actor: ctx.actor,
      } as AuthenticatedContext,
    });
  });

/**
 * Middleware that enforces any of the specified permissions.
 */
const enforceAnyPermission = (permissions: string[]) =>
  t.middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.actor) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const hasAny = permissions.some(p => hasPermission(ctx.actor!, p));
    if (!hasAny) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing one of permissions: ${permissions.join(', ')}`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
        actor: ctx.actor,
      } as AuthenticatedContext,
    });
  });

// =============================================================================
// PROCEDURES
// =============================================================================

/**
 * Protected procedure - requires authentication.
 */
export const protectedProcedure = t.procedure.use(enforceAuth);

/**
 * Create a procedure that requires a specific permission.
 */
export const permissionProcedure = (permission: string) =>
  t.procedure.use(enforcePermission(permission));

/**
 * Create a procedure that requires any of the specified permissions.
 */
export const anyPermissionProcedure = (permissions: string[]) =>
  t.procedure.use(enforceAnyPermission(permissions));

// =============================================================================
// ROUTER FACTORY
// =============================================================================

/**
 * Router definition for createRouterWithActor.
 */
export interface RouterProcedureConfig<TInput = unknown> {
  type: 'query' | 'mutation';
  permission?: string;
  anyPermissions?: string[];
  input?: z.ZodSchema<TInput>;
  handler: (opts: {
    input: TInput;
    ctx: AuthenticatedContext;
  }) => Promise<unknown>;
}

/**
 * Create a router with actor context and permission checking.
 *
 * IMPORTANT: Each procedure MUST define its own permission requirement.
 * This ensures proper security at the procedure level.
 *
 * @example
 * ```ts
 * const projectsRouter = createRouterWithActor({
 *   list: {
 *     type: 'query',
 *     permission: 'projects:read',
 *     handler: async ({ ctx }) => {
 *       return ctx.db.query.projects.findMany();
 *     }
 *   },
 *   create: {
 *     type: 'mutation',
 *     permission: 'projects:create',
 *     input: createProjectSchema,
 *     handler: async ({ ctx, input }) => {
 *       return ctx.db.insert(projects).values(input);
 *     }
 *   }
 * });
 * ```
 */
export function createRouterWithActor<
  T extends Record<string, RouterProcedureConfig<any>>
>(config: T) {
  const procedures: Record<string, unknown> = {};

  for (const [name, def] of Object.entries(config)) {
    // Determine base procedure based on permission requirements
    let baseProcedure;
    if (def.permission) {
      baseProcedure = permissionProcedure(def.permission);
    } else if (def.anyPermissions) {
      baseProcedure = anyPermissionProcedure(def.anyPermissions);
    } else {
      baseProcedure = protectedProcedure;
    }

    // Add input validation if provided
    const withInput = def.input
      ? baseProcedure.input(def.input)
      : baseProcedure;

    // Create query or mutation
    procedures[name] = def.type === 'query'
      ? withInput.query(def.handler as any)
      : withInput.mutation(def.handler as any);
  }

  return router(procedures as any);
}

// =============================================================================
// ROUTER COMPOSITION
// =============================================================================

/**
 * Extension router definition for composition.
 */
export interface ExtensionRouter {
  name: string;
  router: ReturnType<typeof router>;
}

/**
 * Compose core router with extension routers.
 *
 * IMPORTANT: This is the ONLY sanctioned way to combine routers.
 * DO NOT use `_def.procedures` or `.merge()` - they break middleware chains.
 *
 * @example
 * ```ts
 * const appRouter = composeRouters(coreRouter, [
 *   { name: 'projects', router: projectsRouter },
 *   { name: 'invoices', router: invoicesRouter },
 * ]);
 * ```
 */
export function composeRouters<TCore extends ReturnType<typeof router>>(
  core: TCore,
  extensions: ExtensionRouter[]
): TCore & Record<string, ReturnType<typeof router>> {
  // Validate no name collisions
  const coreKeys = Object.keys((core as any)._def.procedures || {});
  for (const ext of extensions) {
    if (coreKeys.includes(ext.name)) {
      throw new Error(
        `Extension router name "${ext.name}" collides with core router. ` +
        `Use a unique name for the extension.`
      );
    }
  }

  // Build extension routers object
  const extensionRouters = Object.fromEntries(
    extensions.map(ext => [ext.name, ext.router])
  );

  // Use t.mergeRouters to properly combine routers
  // This preserves middleware chains and type safety
  return t.mergeRouters(core, t.router(extensionRouters)) as any;
}
