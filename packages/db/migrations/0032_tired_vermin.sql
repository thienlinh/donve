CREATE TABLE "entity_images" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"owner_type" text NOT NULL,
	"owner_id" text NOT NULL,
	"kind" text NOT NULL,
	"r2_key" text NOT NULL,
	"mime" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entity_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_entity_image" ON "entity_images" USING btree ("owner_type","owner_id","kind");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "entity_images" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));