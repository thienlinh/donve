ALTER TABLE "prompt_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "org_isolation" ON "prompt_templates" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_or_platform_read" ON "prompt_templates" AS PERMISSIVE FOR SELECT TO public USING (org_id = current_setting('app.current_org', true) OR org_id IS NULL);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "skills" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_or_platform_read" ON "skills" AS PERMISSIVE FOR SELECT TO public USING (org_id = current_setting('app.current_org', true) OR org_id IS NULL);