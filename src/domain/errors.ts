export class AppError extends Error {
	status: number;

	constructor(message: string, status = 400) {
		super(message);
		this.status = status;
	}
}

export class NotFoundError extends AppError {
	constructor(message = "Recurso não encontrado") {
		super(message, 404);
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Não autorizado") {
		super(message, 401);
	}
}
