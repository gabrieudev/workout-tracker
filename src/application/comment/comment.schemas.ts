import { z } from "zod";

export const commentResponseSchema = z.object({
	id: z.uuid(),
	workoutId: z.uuid(),
	content: z.string(),
	createdAt: z.iso.datetime(),
});

export const createCommentRequestSchema = z.object({
	workoutId: z.uuid(),
	content: z.string().min(1),
});

export const updateCommentRequestSchema = z.object({
	content: z.string().min(1).optional(),
});

export const commentsPaginatedResponseSchema = z.object({
	data: z.array(commentResponseSchema),
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	total: z.number().int().nonnegative(),
});

export const commentQuerySchema = z.object({
	workoutId: z.uuid().optional(),
	page: z.string().optional(),
	limit: z.string().optional(),
	from: z.iso.datetime().nullable().optional(),
	to: z.iso.datetime().nullable().optional(),
});

export type CommentResponse = z.infer<typeof commentResponseSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;
export type UpdateCommentRequest = z.infer<typeof updateCommentRequestSchema>;
export type CommentsPaginatedResponse = z.infer<
	typeof commentsPaginatedResponseSchema
>;
