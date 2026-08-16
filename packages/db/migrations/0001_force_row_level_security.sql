-- Postgres exempts a table's OWNER from its own RLS policies unless FORCE ROW LEVEL
-- SECURITY is also set (architecture.md §6/§6.1: RLS exists as defense-in-depth against
-- app-layer bugs, which is worthless if whichever role runs migrations/connects also
-- happens to own the tables it created — the common case unless a separate low-privilege
-- role is provisioned). FORCE makes the policy apply to the owner too (superusers and
-- roles with BYPASSRLS still bypass regardless — the runtime connection must be neither).
ALTER TABLE "ai_connections" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "consents" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "leads" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "orders" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payment_connections" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payments" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "refund_requests" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "unmatched_transactions" FORCE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "chat_messages" FORCE ROW LEVEL SECURITY;
