import { Elysia } from "elysia";
import {
	AppError,
	NotFoundError,
	UnauthorizedError,
} from "../../domain/errors";

export const errorPlugin = new Elysia()
	.error({
		AppError,
		NotFoundError,
		UnauthorizedError,
	})
	.onError(({ code, error, set }) => {
		console.error("ERROR:", error);

		// validação
		if (code === "VALIDATION") {
			set.status = 400;

			return {
				type: "validation",
				message: error.message,
				details: error.all ?? undefined,
			};
		}

		// 404 padrão do Elysia
		if (code === "NOT_FOUND") {
			set.status = 404;
			return {
				message: "Rota não encontrada",
			};
		}

		// erros customizados
		if (error instanceof AppError) {
			set.status = error.status;

			return {
				message: error.message,
			};
		}

		// fallback
		set.status = 500;

		return {
			message: "Erro interno do servidor",
		};
	});
