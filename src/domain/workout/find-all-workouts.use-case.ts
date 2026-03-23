import type { WorkoutRepository } from "./workout.repository";

export class FindAllWorkoutsUseCase {
	constructor(private repo: WorkoutRepository) {}

	async execute(params: {
		userId: string;
		page?: number;
		limit?: number;
		from?: Date;
		to?: Date;
	}) {
		return await this.repo.findAll({
			userId: params.userId,
			page: params.page,
			limit: params.limit,
			from: params.from,
			to: params.to,
		});
	}
}
