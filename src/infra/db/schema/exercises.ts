import { relations } from "drizzle-orm";
import {
	pgTable,
	uuid,
	varchar,
	text,
	boolean,
	integer,
} from "drizzle-orm/pg-core";
import { workouts } from "./workouts";

export const exercises = pgTable("exercises", {
	id: uuid("id").defaultRandom().primaryKey(),
	workoutId: uuid("workout_id").notNull(),
	name: varchar("name", { length: 120 }).notNull(),
	notes: text("notes"),
	completed: boolean("completed").default(false).notNull(),
	order: integer("order").notNull(),
});

export const exercisesRelations = relations(exercises, ({ one }) => ({
	workout: one(workouts, {
		fields: [exercises.workoutId],
		references: [workouts.id],
	}),
}));
