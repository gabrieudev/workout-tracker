import { pgTable } from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core/indexes";
import { text, timestamp, uuid } from "drizzle-orm/pg-core/columns";

export const verifications = pgTable(
	"verifications",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);
