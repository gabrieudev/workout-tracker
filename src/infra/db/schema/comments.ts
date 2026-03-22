import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { workouts } from "./workouts";
import { relations } from "drizzle-orm";

export const comments = pgTable("comments", {
	id: uuid("id").defaultRandom().primaryKey(),
	workoutId: uuid("workout_id")
		.notNull()
		.references(() => workouts.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const commentsRelations = relations(comments, ({ one }) => ({
	workout: one(workouts, {
		fields: [comments.workoutId],
		references: [workouts.id],
	}),
}));
