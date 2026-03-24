import type { CommentsPaginatedResponse } from "./comment.schemas";

type CommentDb = {
	id: string;
	workoutId: string;
	content: string;
	createdAt: Date;
};

export const toCommentResponse = (comment: CommentDb) => ({
	id: comment.id,
	workoutId: comment.workoutId,
	content: comment.content,
	createdAt: comment.createdAt.toISOString(),
});

export const toCommentsResponse = (
	data: CommentDb[],
	meta: Omit<CommentsPaginatedResponse, "data">,
): CommentsPaginatedResponse => ({
	data: data.map(toCommentResponse),
	...meta,
});
