import type {
	CommentResponse,
	UpdateCommentRequest,
} from "../../application/comment/comment.schemas";
import type { CommentRepository } from "./comment.repository";
import type { FindCommentByIdUseCase } from "./find-comment-by-id.use-case";
import { AppError } from "../errors";

export class UpdateCommentUseCase {
	constructor(
		private readonly commentRepository: CommentRepository,
		private readonly findCommentByIdUseCase: FindCommentByIdUseCase,
	) {}

	async execute(
		id: string,
		userId: string,
		data: UpdateCommentRequest,
	): Promise<CommentResponse> {
		const comment = await this.findCommentByIdUseCase.execute(id, userId);

		if (!comment) {
			throw new AppError("Comentário não encontrado", 404);
		}

		const updatedComment = await this.commentRepository.update(id, data);

		if (!updatedComment) {
			throw new AppError("Erro ao atualizar comentário", 500);
		}

		return updatedComment;
	}
}
