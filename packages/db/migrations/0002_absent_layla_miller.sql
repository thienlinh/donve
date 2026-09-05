CREATE TABLE "fulfillment_tasks" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "fulfillment_tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_fulfillment_order" ON "fulfillment_tasks" USING btree ("org_id","order_id");--> statement-breakpoint
CREATE INDEX "ix_fulfillment_status" ON "fulfillment_tasks" USING btree ("org_id","status","updated_at");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "fulfillment_tasks" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "fulfillment_tasks" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');
--> statement-breakpoint
ALTER TABLE "fulfillment_tasks" FORCE ROW LEVEL SECURITY;