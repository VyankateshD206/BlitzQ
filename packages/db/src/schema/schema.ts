import { pgTable, uuid, varchar, integer, index, uniqueIndex, jsonb, boolean, timestamp} from "drizzle-orm/pg-core";
import { tierEnum } from "./enums";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }),
    profileImg: varchar("profile_img", { length: 255 }),
    tier: tierEnum("tier").default("free"),
    quota: integer("quota").default(1),
    customerId: varchar("customer_id", { length: 255 }), // Allow null for customerId
    endsAt: timestamp("ends_at", { mode: 'date' }), // Allow null for endsAt
    renewsAt: timestamp("renews_at", { mode: 'date' }), // Allow null for renewsAt
    proStatus: varchar("status", { length: 255 })
}, (table) => ({

    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    providerIdx: index("users_provider_idx").on(table.provider)
}));

export const quizzes = pgTable("quizzes", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    submitted: boolean("submitted").default(false),
    quiz: jsonb("quiz").default(null),
    answer: jsonb("answer").default(null),
    userId: uuid("user_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at", { mode: 'date' }).defaultNow(),
}, (table) => ({
    userIdx: index("quizzes_user_idx").on(table.userId),
    quizIdx: index("quizzes_quiz_idx").on(table.id)
}));