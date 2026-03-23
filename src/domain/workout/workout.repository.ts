import type {
	CreateWorkoutInput,
	UpdateWorkoutInput,
	WorkoutResponse,
	WorkoutsResponse,
} from "../../application/workout/workout.schemas";

export interface WorkoutRepository {
	create(data: CreateWorkoutInput, userId: string): Promise<WorkoutResponse>;
	findAll(params: {
		userId: string;
		page?: number;
		limit?: number;
		from?: Date;
		to?: Date;
	}): Promise<WorkoutsResponse>;
	findById(id: string, userId: string): Promise<WorkoutResponse | null>;
	update(
		id: string,
		userId: string,
		data: UpdateWorkoutInput,
	): Promise<WorkoutResponse | null>;
	delete(id: string, userId: string): Promise<boolean>;
	getReport(
		userId: string,
		start: Date,
		end: Date,
	): Promise<{
		total: number;
		completed: number;
		percentage: number;
	}>;
}
