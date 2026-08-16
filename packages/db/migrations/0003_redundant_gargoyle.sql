ALTER TABLE "invites" ALTER COLUMN "token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "inviter_id" text;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "memberships" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;