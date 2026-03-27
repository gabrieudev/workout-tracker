import type { CommentRepository } from "../../ports/comment.repository";

export class FindAllCommentsUseCase {
	constructor(private repo: CommentRepository) {}

	async execute(params: {
		userId: string;
		workoutId?: string;
		page?: number;
		limit?: number;
		from?: Date;
		to?: Date;
	}) {
		return await this.repo.findAll(params);
	}
}
