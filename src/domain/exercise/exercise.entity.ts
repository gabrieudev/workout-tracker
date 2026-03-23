export type Exercise = {
	id: string;
	workoutId: string;
	name: string;
	notes: string | null;
	completed: boolean;
	order: number;
};
