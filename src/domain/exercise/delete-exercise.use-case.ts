import { AppError } from "../errors";
import type { ExerciseRepository } from "./exercise.repository";
import type { FindExerciseByIdUseCase } from "./find-exercise-by-id.use-case";

export class DeleteExerciseUseCase {
	constructor(
		private readonly exerciseRepository: ExerciseRepository,
		private readonly findExerciseByIdUseCase: FindExerciseByIdUseCase,
	) {}

	async execute(id: string, userId: string): Promise<void> {
		const exercise = await this.findExerciseByIdUseCase.execute(id, userId);

		if (!exercise) {
			throw new AppError("Exercício não encontrado", 404);
		}

		const deleted = await this.exerciseRepository.delete(id);

		if (!deleted) {
			throw new AppError("Erro ao deletar exercício", 500);
		}
	}
}
