ALTER TABLE "points" RENAME COLUMN "createdBy" TO "createdById";--> statement-breakpoint
ALTER TABLE "points" RENAME COLUMN "updatedBy" TO "updatedById";--> statement-breakpoint
ALTER TABLE "map_session" DROP CONSTRAINT "map_session_sid_sessions_sid_fk";
--> statement-breakpoint
ALTER TABLE "map_session" DROP CONSTRAINT "map_session_mapId_maps_id_fk";
