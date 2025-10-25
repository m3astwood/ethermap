CREATE TABLE "map_session" (
	"sid" varchar NOT NULL,
	"mapId" integer NOT NULL,
	"lastLocation" json NOT NULL,
	"zoom" integer NOT NULL,
	CONSTRAINT "map_session_sid_mapId_pk" PRIMARY KEY("sid","mapId")
);
--> statement-breakpoint
ALTER TABLE "map_session" ADD CONSTRAINT "map_session_sid_sessions_sid_fk" FOREIGN KEY ("sid") REFERENCES "public"."sessions"("sid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_session" ADD CONSTRAINT "map_session_mapId_maps_id_fk" FOREIGN KEY ("mapId") REFERENCES "public"."maps"("id") ON DELETE no action ON UPDATE no action;