import type { ExercisesPaginatedResponse } from "./exercise.schemas";

type ExerciseDb = {
	id: string;
	workoutId: string;
	name: string;
	notes: string | null;
	completed: boolean;
	order: number;
};

export const toExerciseResponse = (exercise: ExerciseDb) => ({
	id: exercise.id,
	workoutId: exercise.workoutId,
	name: exercise.name,
	notes: exercise.notes,
	completed: exercise.completed,
	order: exercise.order,
});

export const toExercisesResponse = (
	data: ExerciseDb[],
	meta: Omit<ExercisesPaginatedResponse, "data">,
): ExercisesPaginatedResponse => ({
	data: data.map(toExerciseResponse),
	...meta,
});
