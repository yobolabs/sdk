/**
 * tRPC module exports
 *
 * @module @yobolabs/framework/trpc
 */

export {
    adminOnlyMiddleware,
    // Middleware
    authMiddleware,
    // Procedures factory
    createTRPCProcedures,
    createTRPCRouter, orgContextMiddleware, permissionMiddleware, type AdminOnlyProcedure, type AuthenticatedContext, type OrgProtectedProcedure, type ProtectedProcedure, type PublicProcedure,
    // Types
    type TRPCContext
} from './procedures';
