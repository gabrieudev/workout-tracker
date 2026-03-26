import type {
	CreateExerciseRequest,
	ExerciseResponse,
} from "../../application/exercise/exercise.schemas";
import { AppError } from "../errors";
import type { ExerciseRepository } from "./exercise.repository";

export class CreateExerciseUseCase {
	constructor(private repo: ExerciseRepository) {}

	async execute(data: CreateExerciseRequest): Promise<ExerciseResponse> {
		const result = await this.repo.create(data);

		if (!result) {
			throw new AppError("Erro ao criar exercício", 500);
		}

		return result;
	}
}
