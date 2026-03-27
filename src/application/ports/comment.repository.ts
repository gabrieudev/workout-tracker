import type {
	CommentResponse,
	CommentsPaginatedResponse,
	CreateCommentRequest,
	UpdateCommentRequest,
} from "../comment/comment.schemas";

export interface CommentRepository {
	create(data: CreateCommentRequest): Promise<CommentResponse | null>;
	findAll(params: {
		userId: string;
		workoutId?: string;
		page?: number;
		limit?: number;
		from?: Date;
		to?: Date;
	}): Promise<CommentsPaginatedResponse>;
	findById(id: string): Promise<CommentResponse | null>;
	update(
		id: string,
		data: UpdateCommentRequest,
	): Promise<CommentResponse | null>;
	delete(id: string): Promise<boolean>;
}
