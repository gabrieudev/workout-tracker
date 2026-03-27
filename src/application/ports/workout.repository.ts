import type {
	CreateWorkoutInput,
	UpdateWorkoutInput,
	WorkoutResponse,
	WorkoutsPaginatedResponse,
} from "../workout/workout.schemas";

export interface WorkoutRepository {
	create(
		data: CreateWorkoutInput,
		userId: string,
	): Promise<WorkoutResponse | null>;
	findAll(params: {
		userId: string;
		page?: number;
		limit?: number;
		from?: Date;
		to?: Date;
	}): Promise<WorkoutsPaginatedResponse>;
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
