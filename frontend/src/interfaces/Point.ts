import type { Marker } from 'leaflet'

export interface Point {
  id: number
  name?: string
  notes?: string
  location: { lat: number, lng: number }
  map_id: number
  created_by: string
  created_at?: string
  updated_by: string
  updated_at?: string
}

export interface PointMarker extends Point, Marker {}


