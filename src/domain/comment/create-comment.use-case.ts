import type {
	CommentResponse,
	CreateCommentRequest,
} from "../../application/comment/comment.schemas";
import { AppError } from "../errors";
import type { CommentRepository } from "./comment.repository";

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
