/**
 * Core Audit Schema
 *
 * Audit logging for security and compliance.
 */

import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  timestamp,
  index,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orgs, users } from "./orgs";

// =============================================================================
// AUDIT LOGS TABLE
// =============================================================================

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").notNull().primaryKey(),
    uuid: uuid("uuid").unique().notNull().defaultRandom(),
    orgId: integer("org_id").references(() => orgs.id, { onDelete: "cascade" }),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 100 }),
    resourceId: varchar("resource_id", { length: 255 }),
    details: jsonb("details"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("audit_logs_org_id_idx").on(table.orgId),
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_resource_idx").on(table.resource),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ],
);

// =============================================================================
// RELATIONS
// =============================================================================

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  org: one(orgs, {
    fields: [auditLogs.orgId],
    references: [orgs.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
