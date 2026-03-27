import type {
	CreateWorkoutInput,
	WorkoutResponse,
} from "../../workout/workout.schemas";
import { AppError } from "../../../domain/errors";
import type { WorkoutRepository } from "../../ports/workout.repository";

export class CreateWorkoutUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(
		data: CreateWorkoutInput,
		userId: string,
	): Promise<WorkoutResponse> {
		const scheduledDate = new Date(data.scheduledAt);

		if (scheduledDate < new Date()) {
			throw new AppError(
				"Treino não pode ser agendado para uma data passada",
				400,
			);
		}

		const workout = await this.repo.create(data, userId);

		if (!workout) {
			throw new AppError("Erro ao criar treino", 500);
		}

		return workout;
	}
}
