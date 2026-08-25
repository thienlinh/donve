CREATE TABLE "feature_flags" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "feature_flags_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "org_feature_overrides" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"feature_key" text NOT NULL,
	"enabled" text NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "org_feature_overrides" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "plan_features" (
	"id" text PRIMARY KEY NOT NULL,
	"plan_id" text NOT NULL,
	"feature_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "disabled_at" timestamp;--> statement-breakpoint
CREATE UNIQUE INDEX "ux_org_feature" ON "org_feature_overrides" USING btree ("org_id","feature_key");--> statement-breakpoint
CREATE UNIQUE INDEX "ux_plan_feature" ON "plan_features" USING btree ("plan_id","feature_key");--> statement-breakpoint
CREATE POLICY "org_isolation" ON "org_feature_overrides" AS PERMISSIVE FOR ALL TO public USING (org_id = current_setting('app.current_org', true)) WITH CHECK (org_id = current_setting('app.current_org', true));--> statement-breakpoint
CREATE POLICY "platform_read" ON "org_feature_overrides" AS PERMISSIVE FOR SELECT TO public USING (current_setting('app.is_platform_admin', true) = 'true');--> statement-breakpoint
-- Seeds the one feature flag that is actually enforced today (`requireFeature("custom_domain")`
-- on `/api/domains/*`, apps/api/src/app.ts). Without these rows every org — including paid ones —
-- would lose custom domains the moment that middleware ships, so the data has to land in the
-- same migration, not in `bun run db:seed` (which never runs in CI/CD; see platform-admin.md §9).
-- Ids are literal ULIDs because `id()`'s default is app-side (`schema/columns.ts`), not a DB default.
INSERT INTO "feature_flags" ("id", "key", "description") VALUES
  ('01M0VW2ZXA80161FZDWM472W33', 'custom_domain', 'Publish landing pages on the org''s own domain (FR-G-04)')
  ON CONFLICT ("key") DO NOTHING;--> statement-breakpoint
INSERT INTO "plan_features" ("id", "plan_id", "feature_key") VALUES
  ('01M0VW2ZXBAEQ46TJGMFK0F0V7', 'starter', 'custom_domain'),
  ('01M0VW2ZXB0YDAQ0DRXAPT0GE6', 'pro', 'custom_domain')
  ON CONFLICT ("plan_id", "feature_key") DO NOTHING;