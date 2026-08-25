CREATE TABLE "event_definitions" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"page_version_id" text NOT NULL,
	"event_name" text NOT NULL,
	"element_id" text,
	"component_id" text NOT NULL,
	"required_properties" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "anonymous_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "landing_page_id" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "page_version_id" text;--> statement-breakpoint
CREATE INDEX "ix_event_definitions_landing_page" ON "event_definitions" USING btree ("org_id","landing_page_id");