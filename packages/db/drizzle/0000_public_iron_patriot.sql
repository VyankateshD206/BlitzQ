CREATE TYPE "public"."tier" AS ENUM('free', 'pro');--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"submitted" boolean DEFAULT false,
	"quiz" jsonb DEFAULT 'null'::jsonb,
	"answer" jsonb DEFAULT 'null'::jsonb,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"password" varchar(255),
	"profile_img" varchar(255),
	"tier" "tier" DEFAULT 'free',
	"quota" integer DEFAULT 1,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "quizzes_user_idx" ON "quizzes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quizzes_quiz_idx" ON "quizzes" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_provider_idx" ON "users" USING btree ("provider");