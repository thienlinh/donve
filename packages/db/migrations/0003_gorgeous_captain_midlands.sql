CREATE TABLE "source_links" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"landing_page_id" uuid,
	"name" text NOT NULL,
	"key" text NOT NULL,
	"utm_source" text NOT NULL,
	"utm_medium" text NOT NULL,
	"utm_campaign" text NOT NULL,
	"utm_content" text NOT NULL,
	"utm_term" text,
	"target_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "source_links" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_source_link_campaign_key" ON "source_links" USING btree ("campaign_id","key");--> statement-breakpoint
CREATE INDEX "ix_source_links_campaign" ON "source_links" USING btree ("org_id","campaign_id");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "source_links" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "source_links" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');
--> statement-breakpoint
ALTER TABLE "source_links" FORCE ROW LEVEL SECURITY;