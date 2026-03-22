import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/client";
import * as schema from "../db/schema";
import { openAPI } from "better-auth/plugins";
//import { RedisClient } from "bun";

//const redis = new RedisClient(process.env.REDIS_URL as string);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		schema,
		provider: "pg",
		usePlural: true,
		camelCase: false,
	}),
	emailAndPassword: {
		enabled: true,
		password: {
			hash: (password: string) => Bun.password.hash(password),
			verify: ({ password, hash }: { password: string; hash: string }) =>
				Bun.password.verify(password, hash),
		},
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
	session: {
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutos
		},
	},
	//secondaryStorage: {
	//	async get(key) {
	//		return await redis.get(key);
	//	},
	//	async delete(key) {
	//		await redis.del(key);
	//	},
	//	async set(key, value, ttl) {
	//		const result = await redis.set(key, value);
	//		if (typeof ttl === "number") {
	//			await redis.expire(key, ttl);
	//		}
	//		return result;
	//	},
	//},
	plugins: [openAPI()],
	basePath: "/api/auth",
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => (_schema ??= auth.api.generateOpenAPISchema());

export const OpenAPI = {
	getPaths: (prefix = "/api/auth") =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];

				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method];

					operation.tags = ["Auth"];
				}
			}

			return reference;
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
