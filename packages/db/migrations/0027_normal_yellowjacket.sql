CREATE TABLE "audit_findings" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"audit_run_id" text NOT NULL,
	"category" text NOT NULL,
	"severity" text NOT NULL,
	"message" text NOT NULL,
	"element_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"page_version_id" text NOT NULL,
	"overall_score" integer NOT NULL,
	"category_scores" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
