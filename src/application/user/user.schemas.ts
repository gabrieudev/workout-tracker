import { z } from "zod";

export const userResponseSchema = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;
