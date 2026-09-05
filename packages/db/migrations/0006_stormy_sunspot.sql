CREATE TABLE "prompt_categories" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prompt_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "prompt_library_entries" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"category_slug" text NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"prompt_text" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "prompt_library_entries_slug_unique" UNIQUE("slug")
);
