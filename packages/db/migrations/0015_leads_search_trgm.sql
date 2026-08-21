-- FR-E-01 search perf: `ilike('%term%')` in leadsRepository.listFiltered has a leading wildcard,
-- which defeats the existing btree indexes on leads. pg_trgm + GIN trigram indexes let Postgres
-- use an index for `%term%` ILIKE matches on the searched columns (full_name/phone/email).
CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_leads_full_name_trgm" ON "leads" USING gin ("full_name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_leads_phone_trgm" ON "leads" USING gin ("phone" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "ix_leads_email_trgm" ON "leads" USING gin ("email" gin_trgm_ops);
