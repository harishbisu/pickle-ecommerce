CREATE TABLE "promotional_visits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"utm_source" text NOT NULL,
	"visit_count" integer DEFAULT 0 NOT NULL,
	"url" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "promotional_visits_utm_source_unique" UNIQUE("utm_source")
);
