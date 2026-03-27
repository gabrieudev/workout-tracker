import { and, count, eq, exists, sql } from "drizzle-orm";
import {
	toExerciseResponse,
	toExercisesResponse,
} from "../../application/exercise/exercise.mapper";
import type {
	CreateExerciseRequest,
	ExerciseResponse,
	ExercisesPaginatedResponse,
	UpdateExerciseRequest,
} from "../../application/exercise/exercise.schemas";
import type { ExerciseRepository } from "../../application/ports/exercise.repository";
import { db } from "../db/client";
import { exercises, workouts } from "../db/schema";

type FindAllParams = {
	userId: string;
	workoutId?: string;
	page?: number;
	limit?: number;
};

export class DrizzleExerciseRepository implements ExerciseRepository {
	private async loadById(id: string): Promise<ExerciseResponse | null> {
		const exercise = await db.query.exercises.findFirst({
			where: (exercise, { eq, and }) => and(eq(exercise.id, id)),
		});

		if (!exercise) return null;

		return toExerciseResponse(exercise);
	}

	async create(data: CreateExerciseRequest): Promise<ExerciseResponse | null> {
		const [exercise] = await db
			.insert(exercises)
			.values({
				workoutId: data.workoutId,
				name: data.name,
				notes: data.notes,
				order: data.order,
			})
			.returning({ id: exercises.id });

		return this.loadById(exercise.id);
	}

	async findAll({
		userId,
		workoutId,
		page,
		limit,
	}: FindAllParams): Promise<ExercisesPaginatedResponse> {
		const shouldPaginate = page !== undefined && limit !== undefined;
		const offset = shouldPaginate ? (page - 1) * limit : undefined;

		const buildConditions = (
			exercise: { workoutId: typeof exercises.workoutId },
			helpers: {
				and: typeof and;
				eq: typeof eq;
				exists: typeof exists;
			},
		) => {
			const { and, eq, exists } = helpers;

			const conditions = [
				exists(
					db
						.select({ one: sql`1` })
						.from(workouts)
						.where(
							and(
								eq(workouts.id, exercise.workoutId),
								eq(workouts.userId, userId),
							),
						),
				),
				workoutId ? eq(exercise.workoutId, workoutId) : undefined,
			].filter(Boolean);

			return conditions.length
				? and(...(conditions as Parameters<typeof and>))
				: undefined;
		};

		const whereClause = buildConditions(exercises, { and, eq, exists });

		const [{ total }] = await db
			.select({ total: count() })
			.from(exercises)
			.where(whereClause);

		const data = await db.query.exercises.findMany({
			where: (exercise, helpers) => buildConditions(exercise, helpers),
			orderBy: (exercise, { asc }) => [asc(exercise.order)],
			...(shouldPaginate ? { limit, offset } : {}),
		});

		return toExercisesResponse(data, {
			page: shouldPaginate ? page : undefined,
			limit: shouldPaginate ? limit : undefined,
			total,
		});
	}

	async findById(id: string): Promise<ExerciseResponse | null> {
		return this.loadById(id);
	}

	async update(
		id: string,
		data: UpdateExerciseRequest,
	): Promise<ExerciseResponse | null> {
		const payload: Partial<typeof exercises.$inferInsert> = {};

		if (data.name !== undefined) payload.name = data.name;
		if (data.notes !== undefined) payload.notes = data.notes;
		if (data.completed !== undefined) payload.completed = data.completed;
		if (data.order !== undefined) payload.order = data.order;

		const [row] = await db
			.update(exercises)
			.set(payload)
			.where(eq(exercises.id, id))
			.returning({ id: exercises.id });

		if (!row) return null;

		return this.loadById(row.id);
	}

	async delete(id: string): Promise<boolean> {
		const result = await db
			.delete(exercises)
			.where(eq(exercises.id, id))
			.returning({ id: exercises.id });

		return result.length > 0;
	}
}
