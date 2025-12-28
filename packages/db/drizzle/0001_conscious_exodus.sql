ALTER TABLE "users" ADD COLUMN "customer_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ends_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "renews_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" varchar(255);