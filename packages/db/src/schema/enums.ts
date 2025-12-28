import { pgEnum } from "drizzle-orm/pg-core"

export const tierEnum = pgEnum('tier', ['free', 'pro'])