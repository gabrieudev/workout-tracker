import { AppError } from "../../../domain/errors";
import type { WorkoutRepository } from "../../ports/workout.repository";

export class FindWorkoutByIdUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(id: string, userId: string) {
		const workout = await this.repo.findById(id, userId);

		if (!workout) {
			throw new AppError("Treino não encontrado", 404);
		}

		return workout;
	}
}
