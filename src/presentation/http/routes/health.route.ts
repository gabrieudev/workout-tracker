import { Elysia } from "elysia";
import z from "zod";
import type { OpenAPIV3 } from "openapi-types";

const startTime = Date.now();

export const healthResponseSchema = z.object({
	status: z.literal("ok"),
	uptime: z.number(),
	timestamp: z.string(),
	service: z.string(),
	version: z.string(),
});

type HealthResponse = z.infer<typeof healthResponseSchema>;

export const healthRoute = new Elysia({ prefix: "/" }).get(
	"/",
	(): HealthResponse => ({
		status: "ok",
		uptime: Math.floor((Date.now() - startTime) / 1000),
		timestamp: new Date().toISOString(),
		service: "workout-tracker-api",
		version: "1.0.0",
	}),
	{
		response: {
			200: healthResponseSchema,
		},
		detail: {
			summary: "Healthcheck",
			description: "Verifica se a API está online.",
			tags: ["Health"],
			responses: {
				200: {
					description: "API saudável",
					content: {
						"application/json": {
							schema: z.toJSONSchema(
								healthResponseSchema,
							) as unknown as OpenAPIV3.SchemaObject,
						},
					},
				},
			},
		},
	},
);
