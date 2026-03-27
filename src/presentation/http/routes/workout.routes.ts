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
import type {
	CreateWorkoutUseCase,
	DeleteWorkoutUseCase,
	FindAllWorkoutsUseCase,
	FindWorkoutByIdUseCase,
	UpdateWorkoutUseCase,
	WorkoutReportUseCase,
} from "../../../application/use-cases";
import { betterAuthMacro } from "../middlewares/auth";

const errorSchema = z.object({
	message: z.string(),
	code: z.string().optional(),
});

type WorkoutRoutesDeps = {
	createWorkoutUseCase: CreateWorkoutUseCase;
	findAllWorkoutsUseCase: FindAllWorkoutsUseCase;
	findWorkoutByIdUseCase: FindWorkoutByIdUseCase;
	updateWorkoutUseCase: UpdateWorkoutUseCase;
	deleteWorkoutUseCase: DeleteWorkoutUseCase;
	workoutReportUseCase: WorkoutReportUseCase;
};

export const createWorkoutRoutes = (deps: WorkoutRoutesDeps) =>
	new Elysia({
		prefix: "/workouts",
		detail: { tags: ["Workouts"] },
	})
		.use(betterAuthMacro)

		.post(
			"/",
			async ({ body, user }) => {
				return deps.createWorkoutUseCase.execute(body, user.id);
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
				return deps.findAllWorkoutsUseCase.execute({
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
				return deps.findWorkoutByIdUseCase.execute(params.id, user.id);
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
				return deps.updateWorkoutUseCase.execute(params.id, user.id, body);
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
				await deps.deleteWorkoutUseCase.execute(params.id, user.id);
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
				return deps.workoutReportUseCase.execute(
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
