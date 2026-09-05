ALTER TABLE "leads" ADD COLUMN "source_link_id" uuid;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "source_link_id" uuid;--> statement-breakpoint
CREATE INDEX "ix_leads_source_link" ON "leads" USING btree ("org_id","source_link_id");