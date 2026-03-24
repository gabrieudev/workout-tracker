import { z } from "zod";
import { userResponseSchema } from "../user/user.schemas";
import { exerciseResponseSchema } from "../exercise/exercise.schemas";
import { commentResponseSchema } from "../comment/comment.schemas";

export const workoutResponseSchema = z.object({
	id: z.uuid(),
	title: z.string(),
	user: userResponseSchema,
	exercises: z.array(exerciseResponseSchema),
	comments: z.array(commentResponseSchema),
	scheduledAt: z.iso.datetime(),
	completedAt: z.iso.datetime().nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime(),
});

export const workoutsPaginatedResponseSchema = z.object({
	data: z.array(workoutResponseSchema),
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	total: z.number().int().nonnegative(),
});

export const createWorkoutSchema = z.object({
	title: z.string().min(1),
	scheduledAt: z.iso.datetime(),
});

export const updateWorkoutSchema = z.object({
	title: z.string().optional(),
	scheduledAt: z.iso.datetime().optional(),
	completedAt: z.iso.datetime().nullable().optional(),
});

export const workoutReportQuerySchema = z.object({
	from: z.iso.datetime().nullable().optional(),
	to: z.iso.datetime().nullable().optional(),
});

export const workoutReportResponseSchema = z.object({
	total: z.number().int().nonnegative(),
	completed: z.number().int().nonnegative(),
	percentage: z.number().int().nonnegative(),
});

export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
export type WorkoutResponse = z.infer<typeof workoutResponseSchema>;
export type WorkoutReportQuery = z.infer<typeof workoutReportQuerySchema>;
export type WorkoutReportResponse = z.infer<typeof workoutReportResponseSchema>;
export type WorkoutsPaginatedResponse = z.infer<
	typeof workoutsPaginatedResponseSchema
>;
