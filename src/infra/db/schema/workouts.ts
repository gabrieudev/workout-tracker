import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { relations } from "drizzle-orm";
import { comments } from "./comments";
import { exercises } from "./exercises";

export const workouts = pgTable("workouts", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),

	title: varchar("title", { length: 120 }).notNull(),

	scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true }),

	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const workoutsRelations = relations(workouts, ({ many, one }) => ({
	comments: many(comments),
	exercises: many(exercises),
	user: one(users, {
		fields: [workouts.userId],
		references: [users.id],
	}),
}));
