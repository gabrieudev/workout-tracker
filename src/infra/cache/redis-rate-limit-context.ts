import { redis } from "./redis-client";

export class RedisContext {
	private windowMs: number;

	constructor(windowMs: number) {
		this.windowMs = windowMs;
	}

	async init() {}

	async increment(key: string) {
		const ttlSeconds = Math.ceil(this.windowMs / 1000);

		const count = await redis.incr(key);

		if (count === 1) {
			await redis.expire(key, ttlSeconds);
		}

		const ttl = await redis.ttl(key);

		return {
			count,
			nextReset: new Date(Date.now() + ttl * 1000),
		};
	}

	async decrement(key: string) {
		await redis.decr(key);
	}

	async reset(key: string) {
		await redis.del(key);
	}

	async kill() {
		await redis.quit();
	}
}
