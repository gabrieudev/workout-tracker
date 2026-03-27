import { DrizzleCommentRepository } from "../infra/repositories/drizzle-comment.repository";
import { DrizzleExerciseRepository } from "../infra/repositories/drizzle-exercise.repository";
import { DrizzleWorkoutRepository } from "../infra/repositories/drizzle-workout.repository";
import {
	CreateCommentUseCase,
	CreateExerciseUseCase,
	CreateWorkoutUseCase,
	DeleteCommentUseCase,
	DeleteExerciseUseCase,
	DeleteWorkoutUseCase,
	FindAllCommentsUseCase,
	FindAllExercisesUseCase,
	FindAllWorkoutsUseCase,
	FindCommentByIdUseCase,
	FindExerciseByIdUseCase,
	FindWorkoutByIdUseCase,
	UpdateCommentUseCase,
	UpdateExerciseUseCase,
	UpdateWorkoutUseCase,
	WorkoutReportUseCase,
} from "../application/use-cases";

export const buildContainer = () => {
	const workoutRepository = new DrizzleWorkoutRepository();
	const exerciseRepository = new DrizzleExerciseRepository();
	const commentRepository = new DrizzleCommentRepository();

	const createWorkoutUseCase = new CreateWorkoutUseCase(workoutRepository);
	const findAllWorkoutsUseCase = new FindAllWorkoutsUseCase(workoutRepository);
	const findWorkoutByIdUseCase = new FindWorkoutByIdUseCase(workoutRepository);
	const updateWorkoutUseCase = new UpdateWorkoutUseCase(workoutRepository);
	const deleteWorkoutUseCase = new DeleteWorkoutUseCase(workoutRepository);
	const workoutReportUseCase = new WorkoutReportUseCase(workoutRepository);

	const findExerciseByIdUseCase = new FindExerciseByIdUseCase(
		exerciseRepository,
		workoutRepository,
	);
	const findAllExercisesUseCase = new FindAllExercisesUseCase(
		exerciseRepository,
	);
	const createExerciseUseCase = new CreateExerciseUseCase(exerciseRepository);
	const updateExerciseUseCase = new UpdateExerciseUseCase(
		exerciseRepository,
		findExerciseByIdUseCase,
	);
	const deleteExerciseUseCase = new DeleteExerciseUseCase(
		exerciseRepository,
		findExerciseByIdUseCase,
	);

	const findCommentByIdUseCase = new FindCommentByIdUseCase(
		commentRepository,
		workoutRepository,
	);
	const findAllCommentsUseCase = new FindAllCommentsUseCase(commentRepository);
	const createCommentUseCase = new CreateCommentUseCase(commentRepository);
	const updateCommentUseCase = new UpdateCommentUseCase(
		commentRepository,
		findCommentByIdUseCase,
	);
	const deleteCommentUseCase = new DeleteCommentUseCase(
		commentRepository,
		findCommentByIdUseCase,
	);

	return {
		workout: {
			createWorkoutUseCase,
			findAllWorkoutsUseCase,
			findWorkoutByIdUseCase,
			updateWorkoutUseCase,
			deleteWorkoutUseCase,
			workoutReportUseCase,
		},
		exercise: {
			findExerciseByIdUseCase,
			findAllExercisesUseCase,
			createExerciseUseCase,
			updateExerciseUseCase,
			deleteExerciseUseCase,
		},
		comment: {
			findCommentByIdUseCase,
			findAllCommentsUseCase,
			createCommentUseCase,
			updateCommentUseCase,
			deleteCommentUseCase,
		},
	};
};
