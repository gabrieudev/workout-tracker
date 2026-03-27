import { and, count, eq, gte, lte } from "drizzle-orm";
import type {
	CreateWorkoutInput,
	UpdateWorkoutInput,
	WorkoutResponse,
	WorkoutsPaginatedResponse,
} from "../../application/workout/workout.schemas";
import type { WorkoutRepository } from "../../application/ports/workout.repository";
import { db } from "../db/client";
import { workouts } from "../db/schema";
import {
	toWorkoutResponse,
	toWorkoutsResponse,
} from "../../application/workout/workout.mapper";

type FindAllParams = {
	userId: string;
	page?: number;
	limit?: number;
	from?: Date;
	to?: Date;
};

type WorkoutDbWithRelations = {
	id: string;
	userId: string;
	title: string;
	scheduledAt: Date;
	completedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	user: {
		id: string;
		email: string;
		name: string;
	};
	exercises: Array<{
		id: string;
		workoutId: string;
		name: string;
		notes: string | null;
		completed: boolean;
		order: number;
	}>;
	comments: Array<{
		id: string;
		workoutId: string;
		content: string;
		createdAt: Date;
	}>;
};

export class DrizzleWorkoutRepository implements WorkoutRepository {
	private async loadById(
		id: string,
		userId: string,
	): Promise<WorkoutDbWithRelations | null> {
		const workout = await db.query.workouts.findFirst({
			where: (workout, { eq, and }) =>
				and(eq(workout.id, id), eq(workout.userId, userId)),
			with: {
				user: {
					columns: {
						id: true,
						email: true,
						name: true,
					},
				},
				exercises: true,
				comments: true,
			},
		});

		return (workout as WorkoutDbWithRelations | null) ?? null;
	}

	async create(
		data: CreateWorkoutInput,
		userId: string,
	): Promise<WorkoutResponse | null> {
		const [created] = await db
			.insert(workouts)
			.values({
				title: data.title,
				scheduledAt: new Date(data.scheduledAt),
				userId,
			})
			.returning({ id: workouts.id });

		const workout = await this.loadById(created.id, userId);

		if (!workout) return null;

		return toWorkoutResponse(workout);
	}

	async findAll({
		userId,
		page,
		limit,
		from,
		to,
	}: FindAllParams): Promise<WorkoutsPaginatedResponse> {
		const shouldPaginate = page !== undefined && limit !== undefined;
		const offset = shouldPaginate ? (page - 1) * limit : undefined;

		const filters = [
			eq(workouts.userId, userId),
			from ? gte(workouts.scheduledAt, from) : undefined,
			to ? lte(workouts.scheduledAt, to) : undefined,
		].filter(Boolean);

		const whereClause =
			filters.length > 0
				? and(...(filters as Parameters<typeof and>))
				: undefined;

		const [{ total }] = await db
			.select({ total: count() })
			.from(workouts)
			.where(whereClause);

		const data = await db.query.workouts.findMany({
			where: (workout, { eq, and, gte, lte }) => {
				const conditions = [
					eq(workout.userId, userId),
					from ? gte(workout.scheduledAt, from) : undefined,
					to ? lte(workout.scheduledAt, to) : undefined,
				].filter(Boolean);

				return conditions.length
					? and(...(conditions as Parameters<typeof and>))
					: undefined;
			},
			orderBy: (workout, { desc }) => [desc(workout.scheduledAt)],
			...(shouldPaginate ? { limit, offset } : {}),
			with: {
				user: {
					columns: {
						id: true,
						email: true,
						name: true,
					},
				},
				exercises: true,
				comments: true,
			},
		});

		return toWorkoutsResponse(data as WorkoutDbWithRelations[], {
			page: shouldPaginate ? page : undefined,
			limit: shouldPaginate ? limit : undefined,
			total,
		});
	}

	async findById(id: string, userId: string): Promise<WorkoutResponse | null> {
		const workout = await this.loadById(id, userId);

		if (!workout) return null;

		return toWorkoutResponse(workout);
	}

	async update(
		id: string,
		userId: string,
		data: UpdateWorkoutInput,
	): Promise<WorkoutResponse | null> {
		const payload: Partial<typeof workouts.$inferInsert> = {};

		if (data.title !== undefined) payload.title = data.title;
		if (data.scheduledAt !== undefined)
			payload.scheduledAt = new Date(data.scheduledAt);
		if (data.completedAt !== undefined) {
			payload.completedAt = data.completedAt
				? new Date(data.completedAt)
				: null;
		}

		const [row] = await db
			.update(workouts)
			.set({
				...payload,
				updatedAt: new Date(),
			})
			.where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
			.returning({ id: workouts.id });

		if (!row) return null;

		const workout = await this.loadById(row.id, userId);

		if (!workout) return null;

		return toWorkoutResponse(workout);
	}

	async delete(id: string, userId: string): Promise<boolean> {
		const result = await db
			.delete(workouts)
			.where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
			.returning({ id: workouts.id });

		return result.length > 0;
	}

	async getReport(
		userId: string,
		start: Date,
		end: Date,
	): Promise<{
		total: number;
		completed: number;
		percentage: number;
	}> {
		const rows = await db
			.select({
				id: workouts.id,
				completedAt: workouts.completedAt,
			})
			.from(workouts)
			.where(
				and(
					eq(workouts.userId, userId),
					gte(workouts.scheduledAt, start),
					lte(workouts.scheduledAt, end),
				),
			);

		const total = rows.length;
		const completed = rows.filter((w) => w.completedAt !== null).length;

		return {
			total,
			completed,
			percentage: total === 0 ? 0 : (completed / total) * 100,
		};
	}
}
