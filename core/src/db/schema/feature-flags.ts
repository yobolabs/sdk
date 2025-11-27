/**
 * Feature Flags Schema
 *
 * Supports global and org-specific feature toggles for controlled rollouts.
 */

import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { orgs } from "./orgs";
import { relations } from "drizzle-orm";

// =============================================================================
// FEATURE FLAGS TABLE
// =============================================================================

/**
 * Feature flags for controlled feature rollout and A/B testing
 * Can be global (org_id = NULL) or org-specific
 */
export const featureFlags = pgTable(
  "feature_flags",
  {
    id: serial("id").notNull().primaryKey(),
    uuid: uuid("uuid").unique().notNull().defaultRandom(),

    // Flag identification
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),

    // Flag state
    isEnabled: boolean("is_enabled").default(false).notNull(),

    // Scope - NULL means global flag
    orgId: integer("org_id").references(() => orgs.id, { onDelete: "cascade" }),

    // Gradual rollout
    rolloutPercentage: integer("rollout_percentage").default(0), // 0-100

    // Additional configuration
    metadata: jsonb("metadata"), // { conditions, rules, etc. }

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    // Unique constraint on name + org combination
    uniqueIndex("idx_feature_flags_name_org").on(table.name, table.orgId),
    index("idx_feature_flags_is_enabled").on(table.isEnabled),
    index("idx_feature_flags_org_id").on(table.orgId),
    index("idx_feature_flags_uuid").on(table.uuid),
  ]
);

// =============================================================================
// MIGRATION FLAGS ENUM
// =============================================================================

/**
 * Predefined feature flags for system functionality
 */
export const migrationFlags = {
  // Core platform flags
  ENABLE_MAINTENANCE_MODE: 'system.maintenance.enabled',
  ENABLE_NEW_DASHBOARD: 'ui.dashboard.new',
} as const;

// =============================================================================
// RELATIONS
// =============================================================================

export const featureFlagsRelations = relations(featureFlags, ({ one }) => ({
  org: one(orgs, {
    fields: [featureFlags.orgId],
    references: [orgs.id],
  }),
}));

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type NewFeatureFlag = typeof featureFlags.$inferInsert;
