CREATE TABLE "assignment_rules" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"match_campaign_id" text,
	"match_persona" text,
	"strategy" text NOT NULL,
	"assignee_pool_ids" jsonb DEFAULT '[]'::jsonb,
	"fixed_assignee_id" text,
	"last_assigned_index" integer DEFAULT 0 NOT NULL,
	"sla_hours" integer,
	"on_sla_breach" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "assignment_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "saved_views" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"filter_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "source" text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "last_viewed_at" timestamp;--> statement-breakpoint
CREATE INDEX "ix_assignment_rules_org" ON "assignment_rules" USING btree ("org_id","priority");--> statement-breakpoint
CREATE INDEX "ix_saved_views_org" ON "saved_views" USING btree ("org_id");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "assignment_rules" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "platform_read" ON "assignment_rules" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "saved_views" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "platform_read" ON "saved_views" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');