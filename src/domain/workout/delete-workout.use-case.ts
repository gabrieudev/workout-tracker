import { AppError } from "../errors";
import type { WorkoutRepository } from "./workout.repository";

export class DeleteWorkoutUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(id: string, userId: string) {
		const workout = await this.repo.findById(id, userId);

		if (!workout) {
			throw new AppError("Treino não encontrado", 404);
		}

		if (!(await this.repo.delete(id, userId))) {
			throw new AppError("Erro ao deletar o treino", 500);
		}
	}
}
