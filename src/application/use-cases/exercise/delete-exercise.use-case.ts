import { AppError } from "../../../domain/errors";
import type { ExerciseRepository } from "../../ports/exercise.repository";
import type { FindExerciseByIdUseCase } from "./find-exercise-by-id.use-case";

export class DeleteExerciseUseCase {
	constructor(
		private repo: ExerciseRepository,
		private findExerciseByIdUseCase: FindExerciseByIdUseCase,
	) {}

	async execute(id: string, userId: string) {
		await this.findExerciseByIdUseCase.execute(id, userId);

		const deleted = await this.repo.delete(id);

		if (!deleted) {
			throw new AppError("Exercício não encontrado", 404);
		}
	}
}
