import { Elysia } from "elysia";
import { z } from "zod";
import {
	createExerciseRequestSchema,
	exerciseResponseSchema,
	updateExerciseRequestSchema,
} from "../../../application/exercise/exercise.schemas";
import { CreateExerciseUseCase } from "../../../domain/exercise/create-exercise.use-case";
import { DeleteExerciseUseCase } from "../../../domain/exercise/delete-exercise.use-case";
import { FindAllExercisesUseCase } from "../../../domain/exercise/find-all-exercises.use-case";
import { FindExerciseByIdUseCase } from "../../../domain/exercise/find-exercise-by-id.use-case";
import { UpdateExerciseUseCase } from "../../../domain/exercise/update-exercise.use-case";
import { DrizzleExerciseRepository } from "../../../infra/repositories/drizzle-exercise.repository";
import { DrizzleWorkoutRepository } from "../../../infra/repositories/drizzle-workout.repository";
import { betterAuthMacro } from "../middlewares/auth";

const repo = new DrizzleExerciseRepository();
const workoutRepo = new DrizzleWorkoutRepository();

const findExerciseByIdUseCase = new FindExerciseByIdUseCase(repo, workoutRepo);
const findAllExercisesUseCase = new FindAllExercisesUseCase(repo);
const createExerciseUseCase = new CreateExerciseUseCase(repo);
const updateExerciseUseCase = new UpdateExerciseUseCase(repo, findExerciseByIdUseCase);
const deleteExerciseUseCase = new DeleteExerciseUseCase(repo, findExerciseByIdUseCase);

const errorSchema = z.object({
	message: z.string(),
	code: z.string().optional(),
});

const exerciseQuerySchema = z.object({
	workoutId: z.uuid().optional(),
	page: z.string().optional(),
	limit: z.string().optional(),
});

export const exerciseRoutes = new Elysia({
	prefix: "/exercises",
	detail: { tags: ["Exercises"] },
})
	.use(betterAuthMacro)

	.post(
		"/",
		async ({ body }) => {
			return await createExerciseUseCase.execute(body);
		},
		{
			auth: true,
			body: createExerciseRequestSchema,
			detail: {
				summary: "Criar exercício",
				description: "Cria um novo exercício associado a um treino.",
				operationId: "createExercise",
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
		"/:id",
		async ({ params, user }) => {
			return await findExerciseByIdUseCase.execute(params.id, user.id);
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

	.get(
		"/",
		async ({ query, user }) => {
			return await findAllExercisesUseCase.execute({
				userId: user.id,
				workoutId: query.workoutId,
				page: query.page ? Number(query.page) : undefined,
				limit: query.limit ? Number(query.limit) : undefined,
			});
		},
		{
			auth: true,
			query: exerciseQuerySchema,
			detail: {
				summary: "Listar exercícios",
				description:
					"Retorna uma lista paginada de exercícios do usuário autenticado, podendo filtrar por treino.",
				operationId: "findAllExercises",
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

	.put(
		"/:id",
		async ({ params, body, user }) => {
			return await updateExerciseUseCase.execute(params.id, user.id, body);
		},
		{
			auth: true,
			body: updateExerciseRequestSchema,
			params: z.object({ id: z.uuid() }),
			detail: {
				summary: "Atualizar exercício",
				description: "Atualiza os dados de um exercício existente do usuário.",
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
		"/:id",
		async ({ params, user }) => {
			await deleteExerciseUseCase.execute(params.id, user.id);
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

