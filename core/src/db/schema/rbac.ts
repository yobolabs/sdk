/**
 * Core RBAC Schema
 *
 * Role-based access control tables for the permission system.
 */

import {
  pgTable,
  serial,
  uuid,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  index,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orgs, users } from "./orgs";

// =============================================================================
// ROLES TABLE
// =============================================================================

export const roles = pgTable(
  "roles",
  {
    id: serial("id").notNull().primaryKey(),
    uuid: uuid("uuid").unique().notNull().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    orgId: integer("org_id").references(() => orgs.id, { onDelete: "cascade" }),
    isSystemRole: boolean("is_system_role").default(false).notNull(),
    isGlobalRole: boolean("is_global_role").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
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
    index("roles_id_idx").on(table.id),
    index("roles_org_id_idx").on(table.orgId),
    uniqueIndex("roles_uuid_idx").on(table.uuid),
    uniqueIndex("roles_name_org_idx").on(table.name, table.orgId),
  ],
);

// =============================================================================
// PERMISSIONS TABLE
// =============================================================================

export const permissions = pgTable(
  "permissions",
  {
    id: serial("id").notNull().primaryKey(),
    uuid: uuid("uuid").unique().notNull().defaultRandom(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 150 }).notNull(),
    description: text("description"),
    category: varchar("category", { length: 50 }),
    isActive: boolean("is_active").default(true).notNull(),
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
    index("permissions_id_idx").on(table.id),
    uniqueIndex("permissions_uuid_idx").on(table.uuid),
    uniqueIndex("permissions_slug_idx").on(table.slug),
    index("permissions_category_idx").on(table.category),
  ],
);

// =============================================================================
// ROLE-PERMISSION MAPPING TABLE
// =============================================================================

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: integer("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    orgId: integer("org_id")
      .references(() => orgs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.roleId, table.permissionId] }),
    index("role_permissions_role_id_idx").on(table.roleId),
    index("role_permissions_permission_id_idx").on(table.permissionId),
    index("role_permissions_org_id_idx").on(table.orgId),
    index("role_permissions_org_role_idx").on(table.orgId, table.roleId),
  ],
);

// =============================================================================
// USER-ROLE ASSIGNMENTS TABLE
// =============================================================================

export const userRoles = pgTable(
  "user_roles",
  {
    id: serial("id").notNull().primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    orgId: integer("org_id")
      .references(() => orgs.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    isActive: boolean("is_active").default(true).notNull(),
    assignedAt: timestamp("assigned_at", {
      withTimezone: true,
      mode: "date",
    })
      .defaultNow()
      .notNull(),
    assignedBy: integer("assigned_by").references(() => users.id),
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
    uniqueIndex("user_roles_unique_idx").on(table.userId, table.orgId, table.roleId),
    index("user_roles_id_idx").on(table.id),
    index("user_roles_user_id_idx").on(table.userId),
    index("user_roles_org_id_idx").on(table.orgId),
    index("user_roles_role_id_idx").on(table.roleId),
    index("user_roles_assigned_by_idx").on(table.assignedBy),
  ],
);

// =============================================================================
// RELATIONS
// =============================================================================

export const rolesRelations = relations(roles, ({ one, many }) => ({
  org: one(orgs, {
    fields: [roles.orgId],
    references: [orgs.id],
  }),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  org: one(orgs, {
    fields: [userRoles.orgId],
    references: [orgs.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  assignedByUser: one(users, {
    fields: [userRoles.assignedBy],
    references: [users.id],
  }),
}));
