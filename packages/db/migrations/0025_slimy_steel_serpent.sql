ALTER TABLE "page_versions" ALTER COLUMN "html_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "page_versions" ALTER COLUMN "srcmap_key" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "page_versions" ADD COLUMN "spec" jsonb;