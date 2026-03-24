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

const errorSchema = z.object({
	message: z.string(),
	code: z.string().optional(),
});

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
			detail: {
				summary: "Criar comentário",
				description: "Cria um novo comentário associado a um treino.",
				operationId: "createComment",
			},
			response: {
				200: commentResponseSchema,
				400: errorSchema,
				401: errorSchema,
				500: errorSchema,
			},
		},
	)

	.get(
		"/:id",
		async ({ params, user }) => {
			return await findCommentByIdUseCase.execute(params.id, user.id);
		},
		{
			auth: true,
			params: z.object({ id: z.uuid() }),
			detail: {
				summary: "Buscar comentário por ID",
				description:
					"Retorna um comentário específico. O usuário só pode acessar comentários de treinos que lhe pertencem.",
				operationId: "findCommentById",
			},
			response: {
				200: commentResponseSchema,
				401: errorSchema,
				403: errorSchema,
				404: errorSchema,
			},
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
			detail: {
				summary: "Listar comentários",
				description:
					"Retorna uma lista paginada de comentários do usuário autenticado, podendo filtrar por treino e período.",
				operationId: "findAllComments",
			},
			response: {
				200: z.object({
					data: commentResponseSchema.array(),
					page: z.number().optional(),
					limit: z.number().optional(),
					total: z.number(),
				}),
				401: errorSchema,
				500: errorSchema,
			},
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
			params: z.object({ id: z.uuid() }),
			detail: {
				summary: "Atualizar comentário",
				description:
					"Atualiza o conteúdo de um comentário existente do usuário.",
				operationId: "updateComment",
			},
			response: {
				200: commentResponseSchema,
				400: errorSchema,
				401: errorSchema,
				404: errorSchema,
				500: errorSchema,
			},
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
			detail: {
				summary: "Deletar comentário",
				description: "Remove um comentário do usuário autenticado.",
				operationId: "deleteComment",
			},
			response: {
				200: z.object({
					success: z.boolean(),
				}),
				401: errorSchema,
				404: errorSchema,
				500: errorSchema,
			},
		},
	);
