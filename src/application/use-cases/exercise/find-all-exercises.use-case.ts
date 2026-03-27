import type { ExerciseRepository } from "../../ports/exercise.repository";

export class FindAllExercisesUseCase {
	constructor(private repo: ExerciseRepository) {}

	async execute(params: {
		userId: string;
		workoutId?: string;
		page?: number;
		limit?: number;
	}) {
		return await this.repo.findAll(params);
	}
}
