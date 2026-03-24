import type { CommentResponse } from "../../application/comment/comment.schemas";
import type { CommentRepository } from "./comment.repository";
import type { WorkoutRepository } from "../workout/workout.repository";
import { AppError } from "../errors";

export class FindCommentByIdUseCase {
	constructor(
		private readonly commentRepository: CommentRepository,
		private readonly workoutRepository: WorkoutRepository,
	) {}

	async execute(id: string, userId: string): Promise<CommentResponse> {
		const comment = await this.commentRepository.findById(id);

		if (!comment) {
			throw new AppError("Comentário não encontrado", 404);
		}

		const userWorkout = await this.workoutRepository.findById(
			comment.workoutId,
			userId,
		);

		if (!userWorkout) {
			throw new AppError("Treino associado ao comentário não encontrado", 404);
		}

		if (userWorkout.user.id !== userId) {
			throw new AppError("Acesso negado ao comentário", 403);
		}

		return comment;
	}
}
