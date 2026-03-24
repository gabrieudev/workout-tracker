import type { CommentsPaginatedResponse } from "../../application/comment/comment.schemas";
import type { CommentRepository } from "./comment.repository";

export class FindAllCommentsUseCase {
	constructor(private readonly commentRepository: CommentRepository) {}

	async execute(params: {
		userId: string;
		workoutId?: string;
		page?: number;
		limit?: number;
		from?: Date;
		to?: Date;
	}): Promise<CommentsPaginatedResponse> {
		return await this.commentRepository.findAll({
			userId: params.userId,
			workoutId: params.workoutId,
			page: params.page,
			limit: params.limit,
			from: params.from,
			to: params.to,
		});
	}
}
