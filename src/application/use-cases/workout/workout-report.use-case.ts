import type { WorkoutRepository } from "../../ports/workout.repository";

export class WorkoutReportUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(userId: string, start: Date, end: Date) {
		return await this.repo.getReport(userId, start, end);
	}
}
