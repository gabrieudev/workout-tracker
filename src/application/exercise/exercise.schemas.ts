import { z } from "zod";

export const exerciseResponseSchema = z.object({
	id: z.uuid(),
	workoutId: z.uuid(),
	name: z.string(),
	notes: z.string().nullable(),
	completed: z.boolean(),
	order: z.number().int(),
});

export const createExerciseRequestSchema = z.object({
	workoutId: z.uuid(),
	name: z.string(),
	notes: z.string().nullable(),
	order: z.number().int(),
});

export const updateExerciseRequestSchema = z.object({
	name: z.string().optional(),
	notes: z.string().nullable().optional(),
	completed: z.boolean().optional(),
	order: z.number().int().optional(),
});

export const exercisesPaginatedResponseSchema = z.object({
	data: z.array(exerciseResponseSchema),
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	total: z.number().int().nonnegative(),
});

export type ExerciseResponse = z.infer<typeof exerciseResponseSchema>;
export type CreateExerciseRequest = z.infer<typeof createExerciseRequestSchema>;
export type UpdateExerciseRequest = z.infer<typeof updateExerciseRequestSchema>;
export type ExercisesPaginatedResponse = z.infer<
	typeof exercisesPaginatedResponseSchema
>;
