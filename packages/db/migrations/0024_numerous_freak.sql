CREATE TABLE "tiktok_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"advertiser_id" text NOT NULL,
	"page_id" text,
	"encrypted_access_token" text NOT NULL,
	"subscription_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tiktok_connections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_tiktok_connections_org_campaign" ON "tiktok_connections" USING btree ("org_id","campaign_id");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "tiktok_connections" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "platform_read" ON "tiktok_connections" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');