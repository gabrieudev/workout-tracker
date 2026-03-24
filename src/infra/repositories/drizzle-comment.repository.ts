import { and, count, eq, exists, gte, lte, sql } from "drizzle-orm";
import {
	toCommentResponse,
	toCommentsResponse,
} from "../../application/comment/comment.mapper";
import type {
	CommentResponse,
	CommentsPaginatedResponse,
	CreateCommentRequest,
	UpdateCommentRequest,
} from "../../application/comment/comment.schemas";
import type { CommentRepository } from "../../domain/comment/comment.repository";
import { db } from "../db/client";
import { comments, workouts } from "../db/schema";

type FindAllParams = {
	userId: string;
	workoutId: string;
	page?: number;
	limit?: number;
	from?: Date;
	to?: Date;
};

export class DrizzleCommentRepository implements CommentRepository {
	private async loadById(id: string): Promise<CommentResponse | null> {
		const comment = await db.query.comments.findFirst({
			where: (comment, { eq, and }) => and(eq(comment.id, id)),
		});

		if (!comment) return null;

		return toCommentResponse(comment);
	}

	async create(data: CreateCommentRequest): Promise<CommentResponse | null> {
		const [comment] = await db
			.insert(comments)
			.values({
				createdAt: new Date(),
				content: data.content,
				workoutId: data.workoutId,
			})
			.returning({ id: comments.id });

		const createdComment = await this.loadById(comment.id);

		if (!createdComment) return null;

		return createdComment;
	}

	async findAll({
		userId,
		workoutId,
		page,
		limit,
		from,
		to,
	}: FindAllParams): Promise<CommentsPaginatedResponse> {
		const shouldPaginate = page !== undefined && limit !== undefined;
		const offset = shouldPaginate ? (page - 1) * limit : undefined;

		const buildConditions = (
			comment: any,
			helpers: {
				and: typeof and;
				gte: typeof gte;
				lte: typeof lte;
				eq: typeof eq;
				exists: typeof exists;
			},
		) => {
			const { and, gte, lte, eq, exists } = helpers;

			const conditions = [
				exists(
					db
						.select({ one: sql`1` })
						.from(workouts)
						.where(
							and(
								eq(workouts.id, comment.workoutId),
								eq(workouts.userId, userId),
							),
						),
				),
				workoutId ? eq(comment.workoutId, workoutId) : undefined,
				from ? gte(comment.createdAt, from) : undefined,
				to ? lte(comment.createdAt, to) : undefined,
			].filter(Boolean);

			return conditions.length
				? and(...(conditions as Parameters<typeof and>))
				: undefined;
		};

		const whereClause = buildConditions(comments, {
			and,
			gte,
			lte,
			eq,
			exists,
		});

		const [{ total }] = await db
			.select({ total: count() })
			.from(comments)
			.where(whereClause);

		const data = await db.query.comments.findMany({
			where: (comment, helpers) => buildConditions(comment, helpers),
			orderBy: (comment, { desc }) => [desc(comment.createdAt)],
			...(shouldPaginate ? { limit, offset } : {}),
		});

		return toCommentsResponse(data, {
			page: shouldPaginate ? page : undefined,
			limit: shouldPaginate ? limit : undefined,
			total,
		});
	}

	async findById(id: string): Promise<CommentResponse | null> {
		return this.loadById(id);
	}

	async update(
		id: string,
		data: UpdateCommentRequest,
	): Promise<CommentResponse | null> {
		const [comment] = await db
			.update(comments)
			.set({
				content: data.content,
			})
			.where(eq(comments.id, id))
			.returning({ id: comments.id });

		if (!comment) return null;

		return this.loadById(comment.id);
	}

	async delete(id: string): Promise<boolean> {
		const result = await db
			.delete(comments)
			.where(eq(comments.id, id))
			.returning({ success: sql`1` });

		return result.length > 0;
	}
}
