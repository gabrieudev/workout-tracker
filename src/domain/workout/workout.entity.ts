export type Workout = {
	id: string;
	userId: string;
	title: string;
	scheduledAt: Date;
	completedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};
