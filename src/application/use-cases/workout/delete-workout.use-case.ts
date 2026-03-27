import { AppError } from "../../../domain/errors";
import type { WorkoutRepository } from "../../ports/workout.repository";

export class DeleteWorkoutUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(id: string, userId: string) {
		const deleted = await this.repo.delete(id, userId);

		if (!deleted) {
			throw new AppError("Treino não encontrado", 404);
		}
	}
}
