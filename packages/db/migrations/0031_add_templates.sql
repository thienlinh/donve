CREATE TABLE "templates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"industry" text NOT NULL,
	"thumbnail_key" text,
	"page_spec" jsonb NOT NULL,
	"tokens" jsonb NOT NULL,
	"seo" jsonb,
	"architecture_notes" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
