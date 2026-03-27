import type {
	ExerciseResponse,
	UpdateExerciseRequest,
} from "../../exercise/exercise.schemas";
import { AppError } from "../../../domain/errors";
import type { ExerciseRepository } from "../../ports/exercise.repository";
import type { FindExerciseByIdUseCase } from "./find-exercise-by-id.use-case";

export class UpdateExerciseUseCase {
	constructor(
		private repo: ExerciseRepository,
		private findExerciseByIdUseCase: FindExerciseByIdUseCase,
	) {}

	async execute(
		id: string,
		userId: string,
		data: UpdateExerciseRequest,
	): Promise<ExerciseResponse> {
		await this.findExerciseByIdUseCase.execute(id, userId);

		const result = await this.repo.update(id, data);

		if (!result) {
			throw new AppError("Exercício não encontrado", 404);
		}

		return result;
	}
}
