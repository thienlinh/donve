CREATE TABLE "optimization_hypotheses" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"hypothesis" text NOT NULL,
	"rationale" text NOT NULL,
	"evidence_refs" jsonb DEFAULT '[]'::jsonb,
	"expected_impact" text NOT NULL,
	"status" text DEFAULT 'proposed' NOT NULL,
	"reviewed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
