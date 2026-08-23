CREATE TABLE "webhook_delivery_failures" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"source" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_attempt_at" timestamp,
	"resolved_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "webhook_delivery_failures" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "ix_webhook_delivery_failures_status" ON "webhook_delivery_failures" USING btree ("status","created_at");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "webhook_delivery_failures" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "platform_read" ON "webhook_delivery_failures" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');