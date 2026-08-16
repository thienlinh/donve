CREATE TABLE "ai_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"provider" text NOT NULL,
	"encrypted_key" text,
	"key_last4" text,
	"default_model" text NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_connections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "ai_usage" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"connection_id" text NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"credit_cost" integer DEFAULT 0 NOT NULL,
	"context" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_skills" (
	"landing_page_id" text NOT NULL,
	"skill_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt_templates" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text,
	"slug" text NOT NULL,
	"sections" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"variables" jsonb DEFAULT '{}'::jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"campaign_id" text,
	"deployment_id" text,
	"type" text NOT NULL,
	"session_hash" text,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_products" (
	"campaign_id" text NOT NULL,
	"product_id" text NOT NULL,
	"org_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"public_id" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"form_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"payment_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"utm_defaults" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"price" numeric(12, 0) DEFAULT '0' NOT NULL,
	"description" text,
	"images" jsonb DEFAULT '[]'::jsonb,
	"attributes" jsonb DEFAULT '{}'::jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" text,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invites_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"sales_config" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"ai_credit_balance" integer DEFAULT 0 NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"lead_id" text NOT NULL,
	"consent_type" text DEFAULT 'data_collection' NOT NULL,
	"policy_version" text NOT NULL,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "lead_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"lead_id" text NOT NULL,
	"type" text NOT NULL,
	"body" text,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"actor_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"persona" text,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"utm" jsonb DEFAULT '{}'::jsonb,
	"stage" text DEFAULT 'new' NOT NULL,
	"assignee_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"code" text NOT NULL,
	"lead_id" text NOT NULL,
	"campaign_id" text NOT NULL,
	"product_id" text,
	"amount" numeric(12, 0) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" timestamp,
	"fulfilled_at" timestamp,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payment_connections" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"provider" text DEFAULT 'sepay' NOT NULL,
	"encrypted_api_key" text NOT NULL,
	"bank_bin" text NOT NULL,
	"account_number" text NOT NULL,
	"account_name" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payment_connections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"order_id" text,
	"provider" text DEFAULT 'sepay' NOT NULL,
	"provider_tx_id" text NOT NULL,
	"amount" numeric(12, 0) NOT NULL,
	"raw_payload" jsonb NOT NULL,
	"match_type" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "refund_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"order_id" text NOT NULL,
	"payment_id" text,
	"reason" text NOT NULL,
	"amount" numeric(12, 0) NOT NULL,
	"remitter_info" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"evidence_key" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "refund_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "unmatched_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"provider_tx_id" text NOT NULL,
	"raw_payload" jsonb NOT NULL,
	"reason" text NOT NULL,
	"candidate_order_ids" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolved_order_id" text,
	"resolved_by" text,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unmatched_transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text,
	"to" text NOT NULL,
	"template" text NOT NULL,
	"resend_id" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_domains" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"hostname" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"cf_hostname_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custom_domains_hostname_unique" UNIQUE("hostname")
);
--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"page_version_id" text NOT NULL,
	"hostname" text NOT NULL,
	"status" text NOT NULL,
	"r2_prefix" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publish_outbox" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"deployment_id" text NOT NULL,
	"hostname" text NOT NULL,
	"target_deploy_id" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"applied_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"session_id" text NOT NULL,
	"role" text NOT NULL,
	"content" jsonb NOT NULL,
	"token_usage" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"campaign_id" text,
	"name" text NOT NULL,
	"current_version_id" text,
	"thumbnail_key" text,
	"chat_session_id" text,
	"source" text DEFAULT 'ai' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "page_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"file_name" text NOT NULL,
	"r2_key" text NOT NULL,
	"mime" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"variants" jsonb DEFAULT '{}'::jsonb,
	"source" text DEFAULT 'user_upload' NOT NULL,
	"license" jsonb DEFAULT '{}'::jsonb,
	"unverified_source" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_versions" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"seq" integer NOT NULL,
	"html_key" text NOT NULL,
	"srcmap_key" text NOT NULL,
	"origin" text NOT NULL,
	"patch" jsonb,
	"chat_message_id" text,
	"label" text,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"pruned_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "studio_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"landing_page_id" text NOT NULL,
	"srcmap_id" text NOT NULL,
	"body" text NOT NULL,
	"screenshot_key" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_usage_org_time" ON "ai_usage" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_landing_skill" ON "landing_skills" USING btree ("landing_page_id","skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_skill" ON "skills" USING btree ("org_id","slug");--> statement-breakpoint
CREATE INDEX "ix_events" ON "events" USING btree ("org_id","campaign_id","type","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_cp" ON "campaign_products" USING btree ("campaign_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_campaign_public_id" ON "campaigns" USING btree ("public_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "ix_products_org" ON "products" USING btree ("org_id","type");--> statement-breakpoint
CREATE INDEX "ix_audit_org_time" ON "audit_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_membership" ON "memberships" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE INDEX "ix_consent_lead" ON "consents" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "ix_act_lead" ON "lead_activities" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lead_phone" ON "leads" USING btree ("org_id","phone") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "ix_leads_list" ON "leads" USING btree ("org_id","campaign_id","stage","created_at");--> statement-breakpoint
CREATE INDEX "ix_leads_assignee" ON "leads" USING btree ("org_id","assignee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_order_code" ON "orders" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "ix_orders_status" ON "orders" USING btree ("org_id","status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_payment_conn_org" ON "payment_connections" USING btree ("org_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_payment_tx" ON "payments" USING btree ("provider","provider_tx_id");--> statement-breakpoint
CREATE INDEX "ix_refund_org" ON "refund_requests" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "ix_unmatched_org" ON "unmatched_transactions" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "ix_email_org_time" ON "email_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ix_deploy_host" ON "deployments" USING btree ("hostname","status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_deploy_live_host" ON "deployments" USING btree ("hostname") WHERE status = 'live';--> statement-breakpoint
CREATE INDEX "ix_outbox_status" ON "publish_outbox" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "ix_msg_session" ON "chat_messages" USING btree ("session_id","created_at");--> statement-breakpoint
CREATE INDEX "ix_lp_org" ON "landing_pages" USING btree ("org_id","campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_pv" ON "page_versions" USING btree ("landing_page_id","seq");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "ai_connections" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "consents" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "leads" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "orders" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "payment_connections" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "payments" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "refund_requests" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "unmatched_transactions" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "org_isolation" ON "chat_messages" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));