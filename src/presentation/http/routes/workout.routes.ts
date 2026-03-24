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
		{ auth: true, body: createWorkoutSchema, response: workoutResponseSchema },
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
			response: z.object({
				data: workoutResponseSchema.array(),
				page: z.number().optional(),
				limit: z.number().optional(),
				total: z.number(),
			}),
		},
	)

	.get(
		"/:id",
		async ({ params, user }) => {
			return findWorkoutByIdUseCase.execute(params.id, user.id);
		},
		{
			auth: true,
			response: workoutResponseSchema,
			params: z.object({ id: z.uuid() }),
		},
	)

	.put(
		"/:id",
		async ({ params, body, user }) => {
			return updateWorkoutUseCase.execute(params.id, user.id, body);
		},
		{
			body: updateWorkoutSchema,
			auth: true,
			response: workoutResponseSchema,
			params: z.object({ id: z.uuid() }),
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
			response: z.object({
				success: z.boolean(),
			}),
			params: z.object({ id: z.uuid() }),
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
			response: workoutReportResponseSchema,
		},
	);
