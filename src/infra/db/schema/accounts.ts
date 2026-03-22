import { pgTable } from "drizzle-orm/pg-core";
import { index, uniqueIndex } from "drizzle-orm/pg-core/indexes";
import { text, timestamp, uuid } from "drizzle-orm/pg-core/columns";
import { users } from "./users";

export const accounts = pgTable(
	"accounts",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [
		index("account_userId_idx").on(table.userId),
		uniqueIndex("account_provider_account_unique").on(
			table.providerId,
			table.accountId,
		),
	],
);
