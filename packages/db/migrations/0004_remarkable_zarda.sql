CREATE TABLE "platform_audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"staff_user_id" text NOT NULL,
	"action" text NOT NULL,
	"target_org_id" text,
	"target_type" text,
	"target_id" text,
	"meta" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_staff" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_staff_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE POLICY "platform_read" ON "ai_connections" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "consents" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "leads" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "orders" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "payment_connections" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "payments" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "refund_requests" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "unmatched_transactions" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "platform_read" ON "chat_messages" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');