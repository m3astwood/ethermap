import type { Marker } from 'leaflet'
import type { UserSession } from './User'

export interface Point {
  id: number
  name?: string
  notes?: string
  location: { lat: number, lng: number }
  mapId: number
  createdBy: UserSession
  createdAt?: string
  updatedBy: UserSession
  updatedAt?: string
}

export interface PointMarker extends Point, Marker {}
