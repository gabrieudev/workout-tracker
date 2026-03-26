import type { ExercisesPaginatedResponse } from "../../application/exercise/exercise.schemas";
import type { ExerciseRepository } from "./exercise.repository";

export class FindAllExercisesUseCase {
	constructor(private readonly exerciseRepository: ExerciseRepository) {}

	async execute(params: {
		userId: string;
		workoutId?: string;
		page?: number;
		limit?: number;
	}): Promise<ExercisesPaginatedResponse> {
		return await this.exerciseRepository.findAll({
			userId: params.userId,
			workoutId: params.workoutId,
			page: params.page,
			limit: params.limit,
		});
	}
}
