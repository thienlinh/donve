CREATE TABLE "business_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"product" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"customer" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"market" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "strategy_briefs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"business" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"customer" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"market" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"funnel" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"offer" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"message" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"confirmed_at" timestamp,
	"confirmed_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "uq_business_profile_landing_page" ON "business_profiles" USING btree ("landing_page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_strategy_brief_landing_page" ON "strategy_briefs" USING btree ("landing_page_id");