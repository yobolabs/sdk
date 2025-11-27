/**
 * Core System Schema
 *
 * System-wide configuration tables.
 * Note: Feature flags are in ./feature-flags.ts with full org support.
 */

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  index,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// =============================================================================
// SYSTEM CONFIG TABLE
// =============================================================================

export const systemConfig = pgTable(
  "system_config",
  {
    id: serial("id").notNull().primaryKey(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: jsonb("value"),
    description: text("description"),
    isSecret: boolean("is_secret").default(false).notNull(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("system_config_id_idx").on(table.id),
    uniqueIndex("system_config_key_idx").on(table.key),
  ],
);

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type SystemConfig = typeof systemConfig.$inferSelect;
export type NewSystemConfig = typeof systemConfig.$inferInsert;
