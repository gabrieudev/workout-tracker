import type { UserResponse } from "../user/user.schemas";
import type {
	WorkoutResponse,
	WorkoutsPaginatedResponse,
} from "./workout.schemas";

type WorkoutDb = {
	id: string;
	title: string;
	scheduledAt: Date;
	completedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
	user: UserResponse;
	exercises: Array<{
		id: string;
		workoutId: string;
		name: string;
		notes: string | null;
		completed: boolean;
		order: number;
	}>;
	comments: Array<{
		id: string;
		workoutId: string;
		content: string;
		createdAt: Date;
	}>;
};

const toISO = (value: Date | null) => (value ? value.toISOString() : null);

export const toWorkoutResponse = (workout: WorkoutDb): WorkoutResponse => ({
	id: workout.id,
	title: workout.title,
	user: workout.user,
	exercises: [...workout.exercises].sort((a, b) => a.order - b.order),
	comments: [...workout.comments]
		.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
		.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() })),
	scheduledAt: workout.scheduledAt.toISOString(),
	completedAt: toISO(workout.completedAt),
	createdAt: workout.createdAt.toISOString(),
	updatedAt: workout.updatedAt.toISOString(),
});

export const toWorkoutsResponse = (
	data: WorkoutDb[],
	meta: Omit<WorkoutsPaginatedResponse, "data">,
): WorkoutsPaginatedResponse => ({
	data: data.map(toWorkoutResponse),
	...meta,
});
