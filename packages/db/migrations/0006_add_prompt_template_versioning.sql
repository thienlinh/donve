ALTER TABLE "prompt_templates" ALTER COLUMN "sections" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "prompt_templates" ALTER COLUMN "variables" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "prompt_templates" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "trial_uses_remaining" integer DEFAULT 3 NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "uq_prompt_template" ON "prompt_templates" USING btree ("org_id","slug");