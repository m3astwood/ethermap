CREATE TABLE IF NOT EXISTS "maps" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now(),
	CONSTRAINT "maps_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "points" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"notes" varchar,
	"location" json NOT NULL,
	"mapId" integer NOT NULL,
	"createdBy" varchar,
	"createdAt" timestamp DEFAULT now(),
	"updatedBy" varchar,
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"sid" varchar NOT NULL,
	"sess" json,
	"expired" timestamp
);
