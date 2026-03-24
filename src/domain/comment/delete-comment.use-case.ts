import type { CommentRepository } from "./comment.repository";
import type { FindCommentByIdUseCase } from "./find-comment-by-id.use-case";
import { AppError } from "../errors";

export class DeleteCommentUseCase {
	constructor(
		private readonly commentRepository: CommentRepository,
		private readonly findCommentByIdUseCase: FindCommentByIdUseCase,
	) {}

	async execute(id: string, userId: string): Promise<void> {
		const comment = await this.findCommentByIdUseCase.execute(id, userId);

		if (!comment) {
			throw new AppError("Comentário não encontrado", 404);
		}

		const deleted = await this.commentRepository.delete(id);

		if (!deleted) {
			throw new AppError("Erro ao deletar comentário", 500);
		}
	}
}
