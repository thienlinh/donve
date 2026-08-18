CREATE TABLE "prompt_test_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"prompt_template_id" text NOT NULL,
	"model" text NOT NULL,
	"compiled_prompt" text NOT NULL,
	"output_html" text NOT NULL,
	"lighthouse" jsonb,
	"usage" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_test_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "ix_prompt_test_runs_template" ON "prompt_test_runs" USING btree ("prompt_template_id","created_at");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "prompt_test_runs" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));