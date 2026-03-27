import type {
	CreateExerciseRequest,
	ExerciseResponse,
	ExercisesPaginatedResponse,
	UpdateExerciseRequest,
} from "../exercise/exercise.schemas";

export interface ExerciseRepository {
	create(data: CreateExerciseRequest): Promise<ExerciseResponse | null>;
	findAll(params: {
		userId: string;
		workoutId?: string;
		page?: number;
		limit?: number;
	}): Promise<ExercisesPaginatedResponse>;
	findById(id: string): Promise<ExerciseResponse | null>;
	update(
		id: string,
		data: UpdateExerciseRequest,
	): Promise<ExerciseResponse | null>;
	delete(id: string): Promise<boolean>;
}
