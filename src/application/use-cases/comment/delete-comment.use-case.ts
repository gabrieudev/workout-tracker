import { AppError } from "../../../domain/errors";
import type { CommentRepository } from "../../ports/comment.repository";
import type { FindCommentByIdUseCase } from "./find-comment-by-id.use-case";

export class DeleteCommentUseCase {
	constructor(
		private repo: CommentRepository,
		private findCommentByIdUseCase: FindCommentByIdUseCase,
	) {}

	async execute(id: string, userId: string) {
		await this.findCommentByIdUseCase.execute(id, userId);

		const deleted = await this.repo.delete(id);

		if (!deleted) {
			throw new AppError("Comentário não encontrado", 404);
		}
	}
}
