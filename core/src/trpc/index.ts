/**
 * tRPC Module
 *
 * Core tRPC infrastructure and router utilities.
 */

// Context
export {
  createTRPCContext,
  isAuthenticated,
  requireActor,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from './context';

export type {
  Actor,
  Session,
  TRPCContext,
  AuthenticatedContext,
  CreateContextOptions,
} from './context';

// Router Factory
export {
  router,
  middleware,
  publicProcedure,
  protectedProcedure,
  permissionProcedure,
  anyPermissionProcedure,
  createRouterWithActor,
  composeRouters,
} from './router-factory';

export type {
  RouterProcedureConfig,
  ExtensionRouter,
} from './router-factory';
