import { Subject } from 'rxjs'
import type { MapEvent } from '../interfaces/MapEvent'

export const MapEvent$ = new Subject<MapEvent>()

export function emitMapEvent(event: MapEvent) {
  MapEvent$.next(event)
}
