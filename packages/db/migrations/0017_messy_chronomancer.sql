CREATE TABLE "data_subject_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"lead_id" text NOT NULL,
	"request_type" text NOT NULL,
	"received_at" timestamp DEFAULT now() NOT NULL,
	"due_at" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolved_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "data_subject_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "landing_skills" ADD COLUMN "enabled" boolean NOT NULL;--> statement-breakpoint
CREATE INDEX "ix_dsr_org" ON "data_subject_requests" USING btree ("org_id","status","due_at");--> statement-breakpoint
CREATE INDEX "ix_dsr_lead" ON "data_subject_requests" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "data_subject_requests" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "platform_read" ON "data_subject_requests" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');