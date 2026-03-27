import type {
	CommentResponse,
	UpdateCommentRequest,
} from "../../comment/comment.schemas";
import { AppError } from "../../../domain/errors";
import type { CommentRepository } from "../../ports/comment.repository";
import type { FindCommentByIdUseCase } from "./find-comment-by-id.use-case";

export class UpdateCommentUseCase {
	constructor(
		private repo: CommentRepository,
		private findCommentByIdUseCase: FindCommentByIdUseCase,
	) {}

	async execute(
		id: string,
		userId: string,
		data: UpdateCommentRequest,
	): Promise<CommentResponse> {
		await this.findCommentByIdUseCase.execute(id, userId);

		const result = await this.repo.update(id, data);

		if (!result) {
			throw new AppError("Comentário não encontrado", 404);
		}

		return result;
	}
}
