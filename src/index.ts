import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";
import z from "zod";
import { auth, OpenAPI } from "./infra/auth/auth";
import { healthRoute } from "./presentation/http/routes/health.route";

const app = new Elysia()
	.mount(auth.handler)
	.use(healthRoute)
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
	.listen(3000);

console.log(`Servidor rodando em ${app.server?.hostname}:${app.server?.port}`);
