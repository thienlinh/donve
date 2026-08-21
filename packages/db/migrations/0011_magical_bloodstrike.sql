ALTER TABLE "campaigns" ADD COLUMN "assignment_mode" text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "round_robin_cursor" text;