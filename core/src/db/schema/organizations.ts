/**
 * Organization Management Schema
 *
 * Supplementary tables for organization backoffice module.
 * Includes audit logging and settings management with full RLS support.
 */

import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orgs, users } from "./orgs";

// =============================================================================
// ORGANIZATION AUDIT LOGS TABLE
// =============================================================================

/**
 * Organization-level audit logs for tracking all modifications.
 * Provides compliance-ready audit trail with detailed change tracking.
 */
export const orgAuditLogs = pgTable(
  "org_audit_logs",
  {
    id: serial("id").notNull().primaryKey(),
    uuid: uuid("uuid").unique().notNull().defaultRandom(),

    // Organization context (required for RLS)
    orgId: integer("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),

    // Actor information
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "set null" }),
    userEmail: varchar("user_email", { length: 255 }),
    userName: varchar("user_name", { length: 255 }),

    // Action details
    action: varchar("action", { length: 100 }).notNull(), // e.g., 'CREATE', 'UPDATE', 'DELETE', 'SOFT_DELETE'
    entityType: varchar("entity_type", { length: 100 }).notNull(), // e.g., 'organization', 'settings', 'member'
    entityId: varchar("entity_id", { length: 255 }), // ID of the affected entity
    entityName: varchar("entity_name", { length: 255 }), // Human-readable entity name

    // Change details
    changes: jsonb("changes"), // Before/after values for updates
    metadata: jsonb("metadata"), // Additional context (IP, user agent, etc.)

    // Request context
    requestId: varchar("request_id", { length: 100 }), // For tracking related actions
    ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
    userAgent: text("user_agent"),

    // Timestamps
    performedAt: timestamp("performed_at", {
      withTimezone: true,
      mode: "date",
    }).notNull().defaultNow(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).notNull().defaultNow(),
  },
  (table) => [
    // Performance indexes
    index("org_audit_logs_org_id_idx").on(table.orgId),
    index("org_audit_logs_user_id_idx").on(table.userId),
    index("org_audit_logs_action_idx").on(table.action),
    index("org_audit_logs_entity_type_idx").on(table.entityType),
    index("org_audit_logs_performed_at_idx").on(table.performedAt),
    // Composite indexes for common queries
    index("org_audit_logs_org_action_idx").on(table.orgId, table.action),
    index("org_audit_logs_org_entity_idx").on(table.orgId, table.entityType),
  ],
);

// =============================================================================
// ORGANIZATION SETTINGS TABLE
// =============================================================================

/**
 * Organization-specific settings and preferences.
 * Stores configurable options, limits, and feature flags.
 */
export const orgSettings = pgTable(
  "org_settings",
  {
    id: serial("id").notNull().primaryKey(),
    uuid: uuid("uuid").unique().notNull().defaultRandom(),

    // Organization context (required for RLS)
    orgId: integer("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),

    // Setting identification
    key: varchar("key", { length: 100 }).notNull(), // e.g., 'max_users', 'enable_feature_x'
    value: jsonb("value"), // Flexible value storage

    // Setting metadata
    category: varchar("category", { length: 50 }), // e.g., 'limits', 'features', 'branding'
    dataType: varchar("data_type", { length: 20 }), // e.g., 'string', 'number', 'boolean', 'json'
    description: text("description"),

    // Validation and constraints
    validation: jsonb("validation"), // JSON schema or rules
    defaultValue: jsonb("default_value"),
    isRequired: boolean("is_required").default(false),
    isSystem: boolean("is_system").default(false), // System-managed settings
    isSecret: boolean("is_secret").default(false), // Sensitive settings (masked in UI)

    // Access control
    requiresAdminRole: boolean("requires_admin_role").default(false),
    requiresSystemRole: boolean("requires_system_role").default(false),

    // Change tracking
    lastModifiedBy: integer("last_modified_by")
      .references(() => users.id, { onDelete: "set null" }),
    lastModifiedAt: timestamp("last_modified_at", {
      withTimezone: true,
      mode: "date",
    }),

    // Status
    isActive: boolean("is_active").default(true).notNull(),

    // Timestamps
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).notNull().defaultNow(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).notNull().defaultNow(),
  },
  (table) => [
    // Unique constraint for org + key combination
    uniqueIndex("org_settings_org_key_idx").on(table.orgId, table.key),
    // Performance indexes
    index("org_settings_org_id_idx").on(table.orgId),
    index("org_settings_category_idx").on(table.category),
    index("org_settings_is_active_idx").on(table.isActive),
  ],
);

// =============================================================================
// RELATIONS
// =============================================================================

export const orgAuditLogsRelations = relations(orgAuditLogs, ({ one }) => ({
  org: one(orgs, {
    fields: [orgAuditLogs.orgId],
    references: [orgs.id],
  }),
  user: one(users, {
    fields: [orgAuditLogs.userId],
    references: [users.id],
  }),
}));

export const orgSettingsRelations = relations(orgSettings, ({ one }) => ({
  org: one(orgs, {
    fields: [orgSettings.orgId],
    references: [orgs.id],
  }),
  lastModifiedByUser: one(users, {
    fields: [orgSettings.lastModifiedBy],
    references: [users.id],
  }),
}));

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type OrgAuditLog = typeof orgAuditLogs.$inferSelect;
export type NewOrgAuditLog = typeof orgAuditLogs.$inferInsert;
export type OrgSetting = typeof orgSettings.$inferSelect;
export type NewOrgSetting = typeof orgSettings.$inferInsert;

// =============================================================================
// ENUMS AND CONSTANTS
// =============================================================================

export const OrgAuditActions = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SOFT_DELETE: 'SOFT_DELETE',
  RESTORE: 'RESTORE',
  ACTIVATE: 'ACTIVATE',
  DEACTIVATE: 'DEACTIVATE',
  SETTINGS_UPDATE: 'SETTINGS_UPDATE',
  MEMBER_ADD: 'MEMBER_ADD',
  MEMBER_REMOVE: 'MEMBER_REMOVE',
  ROLE_CHANGE: 'ROLE_CHANGE',
  PERMISSION_GRANT: 'PERMISSION_GRANT',
  PERMISSION_REVOKE: 'PERMISSION_REVOKE',
} as const;

export const OrgSettingCategories = {
  LIMITS: 'limits',
  FEATURES: 'features',
  BRANDING: 'branding',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications',
  INTEGRATIONS: 'integrations',
  BILLING: 'billing',
} as const;

export const OrgSettingDataTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  ARRAY: 'array',
  DATE: 'date',
} as const;
