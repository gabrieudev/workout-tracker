import Elysia from "elysia";
import z from "zod";
import {
	commentQuerySchema,
	commentResponseSchema,
	createCommentRequestSchema,
	updateCommentRequestSchema,
} from "../../../application/comment/comment.schemas";
import { CreateCommentUseCase } from "../../../domain/comment/create-comment.use-case";
import { DeleteCommentUseCase } from "../../../domain/comment/delete-comment.use-case";
import { FindAllCommentsUseCase } from "../../../domain/comment/find-all-comments.use-case";
import { FindCommentByIdUseCase } from "../../../domain/comment/find-comment-by-id.use-case";
import { UpdateCommentUseCase } from "../../../domain/comment/update-comment.use-case";
import { DrizzleCommentRepository } from "../../../infra/repositories/drizzle-comment.repository";
import { DrizzleWorkoutRepository } from "../../../infra/repositories/drizzle-workout.repository";
import { betterAuthMacro } from "../middlewares/auth";

const repo = new DrizzleCommentRepository();
const workoutRepo = new DrizzleWorkoutRepository();
const findCommentByIdUseCase = new FindCommentByIdUseCase(repo, workoutRepo);
const findAllCommentsUseCase = new FindAllCommentsUseCase(repo);
const createCommentUseCase = new CreateCommentUseCase(repo);
const updateCommentUseCase = new UpdateCommentUseCase(
	repo,
	findCommentByIdUseCase,
);
const deleteCommentUseCase = new DeleteCommentUseCase(
	repo,
	findCommentByIdUseCase,
);

export const commentRoutes = new Elysia({
	prefix: "/comments",
	detail: { tags: ["Comments"] },
})
	.use(betterAuthMacro)

	.post(
		"/",
		async ({ body }) => {
			return await createCommentUseCase.execute(body);
		},
		{
			auth: true,
			body: createCommentRequestSchema,
			response: commentResponseSchema,
		},
	)

	.get(
		"/:id",
		async ({ params, user }) => {
			return await findCommentByIdUseCase.execute(params.id, user.id);
		},
		{
			auth: true,
			response: commentResponseSchema,
			params: z.object({ id: z.uuid() }),
		},
	)

	.get(
		"/",
		async ({ query, user }) => {
			return await findAllCommentsUseCase.execute({
				userId: user.id,
				workoutId: query.workoutId,
				page: query.page ? Number(query.page) : undefined,
				limit: query.limit ? Number(query.limit) : undefined,
				from: query.from ? new Date(query.from) : undefined,
				to: query.to ? new Date(query.to) : undefined,
			});
		},
		{
			auth: true,
			query: commentQuerySchema,
			response: z.object({
				data: commentResponseSchema.array(),
				page: z.number().optional(),
				limit: z.number().optional(),
				total: z.number(),
			}),
		},
	)

	.put(
		"/:id",
		async ({ params, body, user }) => {
			return await updateCommentUseCase.execute(params.id, user.id, body);
		},
		{
			auth: true,
			body: updateCommentRequestSchema,
			response: commentResponseSchema,
			params: z.object({ id: z.uuid() }),
		},
	)

	.delete(
		"/:id",
		async ({ params, user }) => {
			await deleteCommentUseCase.execute(params.id, user.id);
			return { success: true };
		},
		{
			auth: true,
			params: z.object({ id: z.uuid() }),
			response: z.object({
				success: z.boolean(),
			}),
		},
	);
