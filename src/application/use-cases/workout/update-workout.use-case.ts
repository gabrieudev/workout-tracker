import type { UpdateWorkoutInput } from "../../workout/workout.schemas";
import { AppError } from "../../../domain/errors";
import type { WorkoutRepository } from "../../ports/workout.repository";

export class UpdateWorkoutUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(id: string, userId: string, data: UpdateWorkoutInput) {
		if (data.scheduledAt !== undefined) {
			const scheduledDate = new Date(data.scheduledAt);
			if (scheduledDate < new Date()) {
				throw new AppError(
					"Treino não pode ser agendado para uma data passada",
					400,
				);
			}
		}

		const workout = await this.repo.update(id, userId, data);

		if (!workout) {
			throw new AppError("Treino não encontrado", 404);
		}

		return workout;
	}
}
