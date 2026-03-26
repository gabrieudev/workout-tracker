import type {
	ExerciseResponse,
	UpdateExerciseRequest,
} from "../../application/exercise/exercise.schemas";
import { AppError } from "../errors";
import type { ExerciseRepository } from "./exercise.repository";
import type { FindExerciseByIdUseCase } from "./find-exercise-by-id.use-case";

export class UpdateExerciseUseCase {
	constructor(
		private readonly exerciseRepository: ExerciseRepository,
		private readonly findExerciseByIdUseCase: FindExerciseByIdUseCase,
	) {}

	async execute(
		id: string,
		userId: string,
		data: UpdateExerciseRequest,
	): Promise<ExerciseResponse> {
		const exercise = await this.findExerciseByIdUseCase.execute(id, userId);

		if (!exercise) {
			throw new AppError("Exercício não encontrado", 404);
		}

		const updatedExercise = await this.exerciseRepository.update(id, data);

		if (!updatedExercise) {
			throw new AppError("Erro ao atualizar exercício", 500);
		}

		return updatedExercise;
	}
}
