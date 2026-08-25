CREATE TABLE "custom_page_bundles" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"source_kind" text NOT NULL,
	"detected_forms" jsonb DEFAULT '[]'::jsonb,
	"imported_at" timestamp DEFAULT now() NOT NULL,
	"last_reuploaded_at" timestamp
);
