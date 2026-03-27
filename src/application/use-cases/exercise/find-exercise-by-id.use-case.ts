import type { ExerciseResponse } from "../../exercise/exercise.schemas";
import { AppError } from "../../../domain/errors";
import type { WorkoutRepository } from "../../ports/workout.repository";
import type { ExerciseRepository } from "../../ports/exercise.repository";

export class FindExerciseByIdUseCase {
	constructor(
		private readonly exerciseRepository: ExerciseRepository,
		private readonly workoutRepository: WorkoutRepository,
	) {}

	async execute(id: string, userId: string): Promise<ExerciseResponse> {
		const exercise = await this.exerciseRepository.findById(id);

		if (!exercise) {
			throw new AppError("Exercício não encontrado", 404);
		}

		const userWorkout = await this.workoutRepository.findById(
			exercise.workoutId,
			userId,
		);

		if (!userWorkout) {
			throw new AppError("Treino associado ao exercício não encontrado", 404);
		}

		if (userWorkout.user.id !== userId) {
			throw new AppError("Acesso negado ao exercício", 403);
		}

		return exercise;
	}
}
