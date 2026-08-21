ALTER TABLE "custom_domains" ADD COLUMN "landing_page_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "custom_domains" ADD COLUMN "verification" jsonb DEFAULT '{}'::jsonb;