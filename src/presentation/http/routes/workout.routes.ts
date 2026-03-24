import { Elysia } from "elysia";
import { z } from "zod";
import {
	createWorkoutSchema,
	updateWorkoutSchema,
	workoutQuerySchema,
	workoutReportQuerySchema,
	workoutReportResponseSchema,
	workoutResponseSchema,
} from "../../../application/workout/workout.schemas";
import { CreateWorkoutUseCase } from "../../../domain/workout/create-workout.use-case";
import { DeleteWorkoutUseCase } from "../../../domain/workout/delete-workout.use-case";
import { FindAllWorkoutsUseCase } from "../../../domain/workout/find-all-workouts.use-case";
import { FindWorkoutByIdUseCase } from "../../../domain/workout/find-workout-by-id.use-case";
import { UpdateWorkoutUseCase } from "../../../domain/workout/update-workout.use-case";
import { WorkoutReportUseCase } from "../../../domain/workout/workout-report.use-case";
import { DrizzleWorkoutRepository } from "../../../infra/repositories/drizzle-workout.repository";
import { betterAuthMacro } from "../middlewares/auth";

const repo = new DrizzleWorkoutRepository();

const createWorkoutUseCase = new CreateWorkoutUseCase(repo);
const findAllWorkoutsUseCase = new FindAllWorkoutsUseCase(repo);
const findWorkoutByIdUseCase = new FindWorkoutByIdUseCase(repo);
const updateWorkoutUseCase = new UpdateWorkoutUseCase(repo);
const deleteWorkoutUseCase = new DeleteWorkoutUseCase(repo);
const workoutReportUseCase = new WorkoutReportUseCase(repo);

const errorSchema = z.object({
	message: z.string(),
	code: z.string().optional(),
});

export const workoutRoutes = new Elysia({
	prefix: "/workouts",
	detail: { tags: ["Workouts"] },
})
	.use(betterAuthMacro)

	.post(
		"/",
		async ({ body, user }) => {
			return createWorkoutUseCase.execute(body, user.id);
		},
		{
			auth: true,
			body: createWorkoutSchema,
			detail: {
				summary: "Criar treino",
				description: "Cria um novo treino para o usuário autenticado.",
				operationId: "createWorkout",
			},
			response: {
				200: workoutResponseSchema,
				400: errorSchema,
				401: errorSchema,
				500: errorSchema,
			},
		},
	)

	.get(
		"/",
		async ({ query, user }) => {
			return findAllWorkoutsUseCase.execute({
				userId: user.id,
				page: query.page ? Number(query.page) : undefined,
				limit: query.limit ? Number(query.limit) : undefined,
				from: query.from ? new Date(query.from) : undefined,
				to: query.to ? new Date(query.to) : undefined,
			});
		},
		{
			auth: true,
			query: workoutQuerySchema,
			detail: {
				summary: "Listar treinos",
				description:
					"Retorna uma lista paginada de treinos do usuário autenticado, podendo filtrar por período.",
				operationId: "findAllWorkouts",
			},
			response: {
				200: z.object({
					data: workoutResponseSchema.array(),
					page: z.number().optional(),
					limit: z.number().optional(),
					total: z.number(),
				}),
				401: errorSchema,
				500: errorSchema,
			},
		},
	)

	.get(
		"/:id",
		async ({ params, user }) => {
			return findWorkoutByIdUseCase.execute(params.id, user.id);
		},
		{
			auth: true,
			params: z.object({ id: z.uuid() }),
			detail: {
				summary: "Buscar treino por ID",
				description:
					"Retorna um treino específico do usuário autenticado pelo ID.",
				operationId: "findWorkoutById",
			},
			response: {
				200: workoutResponseSchema,
				401: errorSchema,
				404: errorSchema,
			},
		},
	)

	.put(
		"/:id",
		async ({ params, body, user }) => {
			return updateWorkoutUseCase.execute(params.id, user.id, body);
		},
		{
			auth: true,
			body: updateWorkoutSchema,
			params: z.object({ id: z.uuid() }),
			detail: {
				summary: "Atualizar treino",
				description:
					"Atualiza os dados de um treino existente do usuário autenticado.",
				operationId: "updateWorkout",
			},
			response: {
				200: workoutResponseSchema,
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
			await deleteWorkoutUseCase.execute(params.id, user.id);
			return { success: true };
		},
		{
			auth: true,
			params: z.object({ id: z.uuid() }),
			detail: {
				summary: "Deletar treino",
				description: "Remove um treino do usuário autenticado.",
				operationId: "deleteWorkout",
			},
			response: {
				204: z.object({
					success: z.boolean(),
				}),
				401: errorSchema,
				404: errorSchema,
				500: errorSchema,
			},
		},
	)

	.get(
		"/report",
		async ({ query, user }) => {
			return workoutReportUseCase.execute(
				user.id,
				query.from ? new Date(query.from) : new Date(0),
				query.to ? new Date(query.to) : new Date(),
			);
		},
		{
			auth: true,
			query: workoutReportQuerySchema,
			detail: {
				summary: "Relatório de treinos",
				description:
					"Gera um relatório agregando informações dos treinos do usuário dentro de um período.",
				operationId: "workoutReport",
			},
			response: {
				200: workoutReportResponseSchema,
				401: errorSchema,
				500: errorSchema,
			},
		},
	);
