import { Elysia } from "elysia";
import { z } from "zod";
import {
	createExerciseRequestSchema,
	exerciseResponseSchema,
	updateExerciseRequestSchema,
} from "../../../application/exercise/exercise.schemas";
import type {
	CreateExerciseUseCase,
	DeleteExerciseUseCase,
	FindAllExercisesUseCase,
	FindExerciseByIdUseCase,
	UpdateExerciseUseCase,
} from "../../../application/use-cases";
import { betterAuthMacro } from "../middlewares/auth";

const errorSchema = z.object({
	message: z.string(),
	code: z.string().optional(),
});

const workoutExercisesQuerySchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
});

const createWorkoutExerciseBodySchema = createExerciseRequestSchema.omit({
	workoutId: true,
});

type ExerciseRoutesDeps = {
	findExerciseByIdUseCase: FindExerciseByIdUseCase;
	findAllExercisesUseCase: FindAllExercisesUseCase;
	createExerciseUseCase: CreateExerciseUseCase;
	updateExerciseUseCase: UpdateExerciseUseCase;
	deleteExerciseUseCase: DeleteExerciseUseCase;
};

export const createExerciseRoutes = (deps: ExerciseRoutesDeps) =>
	new Elysia({
		prefix: "",
		detail: { tags: ["Exercises"] },
	})
		.use(betterAuthMacro)

		.get(
			"/workouts/:workoutId/exercises",
			async ({ params, query, user }) => {
				return await deps.findAllExercisesUseCase.execute({
					userId: user.id,
					workoutId: params.workoutId,
					page: query.page ? Number(query.page) : undefined,
					limit: query.limit ? Number(query.limit) : undefined,
				});
			},
			{
				auth: true,
				params: z.object({ workoutId: z.uuid() }),
				query: workoutExercisesQuerySchema,
				detail: {
					summary: "Listar exercícios do treino",
					description:
						"Retorna uma lista paginada de exercícios associados a um treino do usuário autenticado.",
					operationId: "listWorkoutExercises",
				},
				response: {
					200: z.object({
						data: exerciseResponseSchema.array(),
						page: z.number().optional(),
						limit: z.number().optional(),
						total: z.number(),
					}),
					401: errorSchema,
					500: errorSchema,
				},
			},
		)

		.post(
			"/workouts/:workoutId/exercises",
			async ({ params, body }) => {
				return await deps.createExerciseUseCase.execute({
					...body,
					workoutId: params.workoutId,
				});
			},
			{
				auth: true,
				params: z.object({ workoutId: z.uuid() }),
				body: createWorkoutExerciseBodySchema,
				detail: {
					summary: "Criar exercício no treino",
					description:
						"Cria um novo exercício associado a um treino específico.",
					operationId: "createWorkoutExercise",
				},
				response: {
					200: exerciseResponseSchema,
					400: errorSchema,
					401: errorSchema,
					500: errorSchema,
				},
			},
		)

		.get(
			"/exercises/:id",
			async ({ params, user }) => {
				return await deps.findExerciseByIdUseCase.execute(params.id, user.id);
			},
			{
				auth: true,
				params: z.object({ id: z.uuid() }),
				detail: {
					summary: "Buscar exercício por ID",
					description:
						"Retorna um exercício específico. O usuário só pode acessar exercícios de treinos que lhe pertencem.",
					operationId: "findExerciseById",
				},
				response: {
					200: exerciseResponseSchema,
					401: errorSchema,
					403: errorSchema,
					404: errorSchema,
				},
			},
		)

		.put(
			"/exercises/:id",
			async ({ params, body, user }) => {
				return await deps.updateExerciseUseCase.execute(
					params.id,
					user.id,
					body,
				);
			},
			{
				auth: true,
				body: updateExerciseRequestSchema,
				params: z.object({ id: z.uuid() }),
				detail: {
					summary: "Atualizar exercício",
					description:
						"Atualiza os dados de um exercício existente do usuário.",
					operationId: "updateExercise",
				},
				response: {
					200: exerciseResponseSchema,
					400: errorSchema,
					401: errorSchema,
					404: errorSchema,
					500: errorSchema,
				},
			},
		)

		.delete(
			"/exercises/:id",
			async ({ params, user }) => {
				await deps.deleteExerciseUseCase.execute(params.id, user.id);
				return { success: true };
			},
			{
				auth: true,
				params: z.object({ id: z.uuid() }),
				detail: {
					summary: "Deletar exercício",
					description: "Remove um exercício do usuário autenticado.",
					operationId: "deleteExercise",
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
