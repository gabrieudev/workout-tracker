import { logger } from "@bogeychan/elysia-logger";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import z from "zod";
import { auth, OpenAPI } from "./infra/auth/auth";
import { errorPlugin } from "./presentation/http/error-handler";
import { healthRoute } from "./presentation/http/routes/health.route";
import { workoutRoutes } from "./presentation/http/routes/workout.routes";

const app = new Elysia()
	.mount(auth.handler)
	.use(
		openapi({
			path: "/docs",
			documentation: {
				info: {
					title: "Workout Tracker API",
					version: "1.0.0",
				},
				components: await OpenAPI.components,
				paths: await OpenAPI.getPaths(),
			},
			mapJsonSchema: {
				zod: z.toJSONSchema,
			},
		}),
	)
	.use(
		logger({
			level: process.env.NODE_ENV === "production" ? "info" : "debug",
			autoLogging: true,

			customProps(ctx) {
				return {
					method: ctx.request.method,
					path: ctx.path,
				};
			},
		}),
	)
	.use(errorPlugin)
	.use(healthRoute)
	.use(workoutRoutes)
	.listen(process.env.PORT || 3000);

console.log(`Servidor rodando em ${app.server?.hostname}:${app.server?.port}`);
