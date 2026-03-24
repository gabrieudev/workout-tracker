import { z } from "zod";

export const querySchema = z.object({
	page: z.string().optional(),
	limit: z.string().optional(),
	from: z.iso.datetime().nullable().optional(),
	to: z.iso.datetime().nullable().optional(),
});

export type QueryWorkoutsInput = z.infer<typeof querySchema>;
