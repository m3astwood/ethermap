import type { Marker } from 'leaflet'
import type { UserSession } from './User'

export interface Point {
  id: number
  name?: string
  notes?: string
  location: { lat: number, lng: number }
  map_id: number
  created_by: string
  created_at?: string
  created_by_user: UserSession
  updated_by: string
  updated_at?: string
  updated_by_user: UserSession
}

export interface PointMarker extends Point, Marker {}
