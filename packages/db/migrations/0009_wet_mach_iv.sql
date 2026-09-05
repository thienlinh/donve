DROP INDEX "uq_skill";--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "uq_skill" UNIQUE NULLS NOT DISTINCT("org_id","slug");