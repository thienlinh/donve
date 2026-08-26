-- Postgres exempts a table's OWNER from its own RLS policies unless FORCE ROW LEVEL
-- SECURITY is also set (architecture.md §6/§6.1: RLS exists as defense-in-depth against
-- app-layer bugs, which is worthless if whichever role runs migrations/connects also
-- happens to own the tables it created — the common case unless a separate low-privilege
-- role is provisioned). FORCE makes the policy apply to the owner too (superusers and
-- roles with BYPASSRLS still bypass regardless — the runtime connection must be neither).
-- Every table below calls .enableRLS() in packages/db/src/schema — keep this list in sync
-- when a new table adopts RLS.
ALTER TABLE "ai_connections" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "skills" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "prompt_templates" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "prompt_test_runs" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "org_feature_overrides" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "leads" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "assignment_rules" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "saved_views" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "webhook_credentials" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notify_credentials" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "consents" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payments" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_connections" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "unmatched_transactions" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "data_subject_requests" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "refund_requests" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "webhook_delivery_failures" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tiktok_connections" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "entity_images" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chat_messages" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "products" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "campaigns" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "landing_pages" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "page_versions" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "deployments" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "custom_domains" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "ai_usage" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "email_logs" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "events" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "business_profiles" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "strategy_briefs" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "audit_runs" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "audit_findings" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "optimization_hypotheses" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "event_definitions" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lead_activities" FORCE ROW LEVEL SECURITY;
