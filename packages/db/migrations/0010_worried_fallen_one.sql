CREATE TABLE "app_usage_events" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"properties" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app_usage_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "ix_app_usage_events_org_time" ON "app_usage_events" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ix_app_usage_events_org_event_time" ON "app_usage_events" USING btree ("org_id","event_name","created_at");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "app_usage_events" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "app_usage_events" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');