CREATE TABLE "ai_connections" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
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
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"connection_id" uuid NOT NULL,
	"model" text NOT NULL,
	"input_tokens" integer NOT NULL,
	"output_tokens" integer NOT NULL,
	"credit_cost" integer DEFAULT 0 NOT NULL,
	"context" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_usage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "landing_skills" (
	"landing_page_id" uuid NOT NULL,
	"skill_id" uuid NOT NULL,
	"enabled" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prompt_templates" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid,
	"slug" text NOT NULL,
	"sections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"variables" jsonb DEFAULT '[]'::jsonb,
	"version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_templates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "prompt_test_runs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"prompt_template_id" uuid NOT NULL,
	"model" text NOT NULL,
	"compiled_prompt" text NOT NULL,
	"output_html" text NOT NULL,
	"lighthouse" jsonb,
	"usage" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prompt_test_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"is_active_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "skills" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"campaign_id" uuid,
	"deployment_id" uuid,
	"type" text NOT NULL,
	"session_hash" text,
	"anonymous_id" text,
	"landing_page_id" uuid,
	"page_version_id" uuid,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"issuer" text,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"active_organization_id" uuid,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"key" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "org_feature_overrides" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"feature_key" text NOT NULL,
	"enabled" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "org_feature_overrides" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plan_features" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"plan_id" text NOT NULL,
	"feature_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"product" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"customer" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"market" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "business_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "strategy_briefs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"business" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"customer" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"market" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"funnel" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"offer" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"message" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"confirmed_at" timestamp,
	"confirmed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "strategy_briefs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "campaign_products" (
	"campaign_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"org_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"public_id" text NOT NULL,
	"name" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"goal" text,
	"starts_at" timestamp,
	"ends_at" timestamp,
	"form_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"payment_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"utm_defaults" jsonb DEFAULT '{}'::jsonb,
	"assignment_mode" text DEFAULT 'manual' NOT NULL,
	"round_robin_cursor" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "campaigns" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
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
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"inviter_id" uuid,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"sales_config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"plan" text DEFAULT 'free' NOT NULL,
	"ai_credit_balance" integer DEFAULT 0 NOT NULL,
	"trial_uses_remaining" integer DEFAULT 3 NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"disabled_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "organizations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "assignment_rules" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"match_campaign_id" uuid,
	"match_persona" text,
	"strategy" text NOT NULL,
	"assignee_pool_ids" jsonb DEFAULT '[]'::jsonb,
	"fixed_assignee_id" uuid,
	"last_assigned_index" integer DEFAULT 0 NOT NULL,
	"sla_hours" integer,
	"on_sla_breach" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "assignment_rules" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "consents" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"consent_type" text DEFAULT 'data_collection' NOT NULL,
	"policy_version" text NOT NULL,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "consents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "data_subject_requests" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
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
CREATE TABLE "lead_activities" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"lead_id" uuid NOT NULL,
	"type" text NOT NULL,
	"body" text,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"actor_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_activities" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"persona" text,
	"custom_fields" jsonb DEFAULT '{}'::jsonb,
	"utm" jsonb DEFAULT '{}'::jsonb,
	"stage" text DEFAULT 'new' NOT NULL,
	"assignee_id" uuid,
	"source" text DEFAULT 'manual' NOT NULL,
	"last_viewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"anonymized_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notify_credentials" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"encrypted_secret" text NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notify_credentials" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"code" text NOT NULL,
	"lead_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"product_id" uuid,
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
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
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
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"order_id" uuid,
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
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"order_id" uuid NOT NULL,
	"payment_id" uuid,
	"reason" text NOT NULL,
	"amount" numeric(12, 0) NOT NULL,
	"remitter_info" jsonb DEFAULT '{}'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"evidence_key" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "refund_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "saved_views" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"filter_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"shared" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "saved_views" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tiktok_connections" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"advertiser_id" text NOT NULL,
	"page_id" text,
	"encrypted_access_token" text NOT NULL,
	"subscription_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tiktok_connections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "unmatched_transactions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"provider_tx_id" text NOT NULL,
	"raw_payload" jsonb NOT NULL,
	"reason" text NOT NULL,
	"candidate_order_ids" jsonb DEFAULT '[]'::jsonb,
	"status" text DEFAULT 'pending' NOT NULL,
	"resolved_order_id" uuid,
	"resolved_by" uuid,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "unmatched_transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_credentials" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"provider" text NOT NULL,
	"encrypted_secret" text NOT NULL,
	"verify_token" text,
	"encrypted_page_access_token" text,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "webhook_credentials" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "webhook_delivery_failures" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"campaign_id" uuid NOT NULL,
	"source" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_attempt_at" timestamp,
	"resolved_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "webhook_delivery_failures" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "custom_page_bundles" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"source_kind" text NOT NULL,
	"detected_forms" jsonb DEFAULT '[]'::jsonb,
	"imported_at" timestamp DEFAULT now() NOT NULL,
	"last_reuploaded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "email_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid,
	"to" text NOT NULL,
	"template" text NOT NULL,
	"resend_id" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "optimization_hypotheses" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"hypothesis" text NOT NULL,
	"rationale" text NOT NULL,
	"evidence_refs" jsonb DEFAULT '[]'::jsonb,
	"expected_impact" text NOT NULL,
	"status" text DEFAULT 'proposed' NOT NULL,
	"reviewed_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "optimization_hypotheses" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "platform_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"staff_user_id" uuid NOT NULL,
	"action" text NOT NULL,
	"target_org_id" uuid,
	"target_type" text,
	"target_id" uuid,
	"meta" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_staff" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "platform_staff_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "custom_domains" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"hostname" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"cf_hostname_id" text,
	"verification" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custom_domains_hostname_unique" UNIQUE("hostname")
);
--> statement-breakpoint
ALTER TABLE "custom_domains" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"page_version_id" uuid NOT NULL,
	"hostname" text NOT NULL,
	"status" text NOT NULL,
	"r2_prefix" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deployments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "publish_outbox" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"deployment_id" uuid NOT NULL,
	"hostname" text NOT NULL,
	"target_deploy_id" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"applied_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "audit_findings" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"audit_run_id" uuid NOT NULL,
	"category" text NOT NULL,
	"severity" text NOT NULL,
	"message" text NOT NULL,
	"element_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_findings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "audit_runs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"page_version_id" uuid NOT NULL,
	"overall_score" integer NOT NULL,
	"category_scores" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_runs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"session_id" uuid NOT NULL,
	"role" text NOT NULL,
	"content" jsonb NOT NULL,
	"token_usage" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "chat_sessions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"title" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entity_images" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"owner_type" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"kind" text NOT NULL,
	"r2_key" text NOT NULL,
	"mime" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entity_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "landing_pages" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"campaign_id" uuid,
	"name" text NOT NULL,
	"current_version_id" uuid,
	"thumbnail_key" text,
	"chat_session_id" uuid,
	"source" text DEFAULT 'ai' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "landing_pages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "page_assets" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"r2_key" text NOT NULL,
	"mime" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"poster_key" text,
	"variants" jsonb DEFAULT '{}'::jsonb,
	"source" text DEFAULT 'user_upload' NOT NULL,
	"license" jsonb DEFAULT '{}'::jsonb,
	"unverified_source" boolean DEFAULT false NOT NULL,
	"usage_confirmed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_versions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"seq" integer NOT NULL,
	"html_key" text,
	"srcmap_key" text,
	"spec" jsonb,
	"origin" text NOT NULL,
	"patch" jsonb,
	"chat_message_id" uuid,
	"label" text,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"pruned_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "page_versions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "studio_comments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"srcmap_id" text NOT NULL,
	"body" text NOT NULL,
	"screenshot_key" text,
	"status" text DEFAULT 'queued' NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"industry" text NOT NULL,
	"thumbnail_key" text,
	"page_spec" jsonb NOT NULL,
	"tokens" jsonb NOT NULL,
	"seo" jsonb,
	"architecture_notes" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_definitions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"org_id" uuid NOT NULL,
	"landing_page_id" uuid NOT NULL,
	"page_version_id" uuid NOT NULL,
	"event_name" text NOT NULL,
	"element_id" text,
	"component_id" text NOT NULL,
	"required_properties" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_definitions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_org_id_organizations_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ix_usage_org_time" ON "ai_usage" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_landing_skill" ON "landing_skills" USING btree ("landing_page_id","skill_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_prompt_template" ON "prompt_templates" USING btree ("org_id","slug");--> statement-breakpoint
CREATE INDEX "ix_prompt_test_runs_template" ON "prompt_test_runs" USING btree ("prompt_template_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_skill" ON "skills" USING btree ("org_id","slug");--> statement-breakpoint
CREATE INDEX "ix_events" ON "events" USING btree ("org_id","campaign_id","type","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_org_feature" ON "org_feature_overrides" USING btree ("org_id","feature_key");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_plan_feature" ON "plan_features" USING btree ("plan_id","feature_key");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_business_profile_landing_page" ON "business_profiles" USING btree ("landing_page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_strategy_brief_landing_page" ON "strategy_briefs" USING btree ("landing_page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_cp" ON "campaign_products" USING btree ("campaign_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_campaign_public_id" ON "campaigns" USING btree ("public_id") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "ix_products_org" ON "products" USING btree ("org_id","type");--> statement-breakpoint
CREATE INDEX "ix_audit_org_time" ON "audit_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_membership" ON "memberships" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE INDEX "ix_assignment_rules_org" ON "assignment_rules" USING btree ("org_id","priority");--> statement-breakpoint
CREATE INDEX "ix_consent_lead" ON "consents" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX "ix_dsr_org" ON "data_subject_requests" USING btree ("org_id","status","due_at");--> statement-breakpoint
CREATE INDEX "ix_dsr_lead" ON "data_subject_requests" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE INDEX "ix_act_lead" ON "lead_activities" USING btree ("lead_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_lead_phone" ON "leads" USING btree ("org_id","phone") WHERE deleted_at IS NULL;--> statement-breakpoint
CREATE INDEX "ix_leads_list" ON "leads" USING btree ("org_id","campaign_id","stage","created_at");--> statement-breakpoint
CREATE INDEX "ix_leads_assignee" ON "leads" USING btree ("org_id","assignee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_notify_credentials_org_provider" ON "notify_credentials" USING btree ("org_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_order_code" ON "orders" USING btree ("org_id","code");--> statement-breakpoint
CREATE INDEX "ix_orders_status" ON "orders" USING btree ("org_id","status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_payment_conn_org" ON "payment_connections" USING btree ("org_id","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_payment_tx" ON "payments" USING btree ("provider","provider_tx_id");--> statement-breakpoint
CREATE INDEX "ix_refund_org" ON "refund_requests" USING btree ("org_id","status");--> statement-breakpoint
CREATE INDEX "ix_saved_views_org" ON "saved_views" USING btree ("org_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_tiktok_connections_org_campaign" ON "tiktok_connections" USING btree ("org_id","campaign_id");--> statement-breakpoint
CREATE INDEX "ix_unmatched_org" ON "unmatched_transactions" USING btree ("org_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_webhook_credentials_org_provider" ON "webhook_credentials" USING btree ("org_id","provider");--> statement-breakpoint
CREATE INDEX "ix_webhook_delivery_failures_status" ON "webhook_delivery_failures" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "ix_email_org_time" ON "email_logs" USING btree ("org_id","created_at");--> statement-breakpoint
CREATE INDEX "ix_deploy_host" ON "deployments" USING btree ("hostname","status");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_deploy_live_host" ON "deployments" USING btree ("hostname") WHERE status = 'live';--> statement-breakpoint
CREATE INDEX "ix_outbox_status" ON "publish_outbox" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "ix_msg_session" ON "chat_messages" USING btree ("session_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_entity_image" ON "entity_images" USING btree ("owner_type","owner_id","kind");--> statement-breakpoint
CREATE INDEX "ix_lp_org" ON "landing_pages" USING btree ("org_id","campaign_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_pv" ON "page_versions" USING btree ("landing_page_id","seq");--> statement-breakpoint
CREATE INDEX "ix_event_definitions_landing_page" ON "event_definitions" USING btree ("org_id","landing_page_id");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "ai_connections" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "ai_connections" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "ai_usage" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "prompt_templates" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "org_or_platform_read" ON "prompt_templates" AS PERMISSIVE FOR SELECT TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid OR org_id IS NULL);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "prompt_test_runs" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "skills" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "org_or_platform_read" ON "skills" AS PERMISSIVE FOR SELECT TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid OR org_id IS NULL);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "events" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "events" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "org_feature_overrides" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "org_feature_overrides" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "business_profiles" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "business_profiles" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "strategy_briefs" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "strategy_briefs" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "campaigns" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "campaigns" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "products" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "products" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "assignment_rules" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "assignment_rules" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "consents" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "consents" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "data_subject_requests" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "data_subject_requests" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "lead_activities" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "lead_activities" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "leads" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "leads" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "notify_credentials" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "notify_credentials" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "orders" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "orders" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "payment_connections" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "payment_connections" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "payments" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "payments" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "refund_requests" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "refund_requests" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "saved_views" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "saved_views" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "tiktok_connections" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "tiktok_connections" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "unmatched_transactions" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "unmatched_transactions" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "webhook_credentials" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "webhook_credentials" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "webhook_delivery_failures" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "webhook_delivery_failures" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation_or_null" ON "email_logs" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid OR org_id IS NULL) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid OR org_id IS NULL);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "optimization_hypotheses" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "optimization_hypotheses" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "custom_domains" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "custom_domains" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "deployments" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "deployments" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "audit_findings" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "audit_findings" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "audit_runs" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "audit_runs" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "chat_messages" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "chat_messages" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "entity_images" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "org_isolation" ON "landing_pages" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "landing_pages" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "page_versions" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "page_versions" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
CREATE POLICY "org_isolation" ON "event_definitions" AS PERMISSIVE FOR ALL TO public USING (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid) WITH CHECK (org_id = NULLIF(current_setting('app.current_org', true), '')::uuid);--> statement-breakpoint
CREATE POLICY "platform_read" ON "event_definitions" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');