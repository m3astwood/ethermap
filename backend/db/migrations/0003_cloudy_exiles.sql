CREATE TABLE "map_session" (
	"sid" varchar NOT NULL,
	"mapId" integer NOT NULL,
	"lastLocation" json NOT NULL,
	"zoom" integer NOT NULL,
	CONSTRAINT "map_session_sid_mapId_pk" PRIMARY KEY("sid","mapId")
);
