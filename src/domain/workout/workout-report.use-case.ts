import type { WorkoutRepository } from "./workout.repository";

export class WorkoutReportUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(userId: string, from: Date, to: Date) {
		return await this.repo.getReport(userId, from, to);
	}
}
