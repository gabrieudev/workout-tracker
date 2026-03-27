import type {
	CommentResponse,
	CreateCommentRequest,
} from "../../comment/comment.schemas";
import { AppError } from "../../../domain/errors";
import type { CommentRepository } from "../../ports/comment.repository";

export class CreateCommentUseCase {
	constructor(private repo: CommentRepository) {}

	async execute(data: CreateCommentRequest): Promise<CommentResponse> {
		const result = await this.repo.create(data);

		if (!result) {
			throw new AppError("Erro ao criar comentário", 500);
		}

		return result;
	}
}
