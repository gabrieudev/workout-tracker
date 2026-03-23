import type { UpdateWorkoutInput } from "../../application/workout/workout.schemas";
import { AppError } from "../errors";
import type { WorkoutRepository } from "./workout.repository";

export class UpdateWorkoutUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(id: string, userId: string, data: UpdateWorkoutInput) {
		const existingWorkout = await this.repo.findById(id, userId);

		if (!existingWorkout) {
			throw new AppError("Treino não encontrado", 404);
		}

		const updatedWorkout = await this.repo.update(id, userId, data);

		if (!updatedWorkout) {
			throw new AppError("Erro ao atualizar o treino", 500);
		}

		return updatedWorkout;
	}
}
