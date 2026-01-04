import type { SessionData } from 'hono-sessions'
import type { LatLng } from 'leaflet'

export interface UserData {
  id: number
  name: string
  colour: string
}

export interface UserServerData {
  user: UserData
  pos: LatLng
  session: string
}

export interface UserSession {
  sid: string
  sess: SessionData<UserData>
  expired: string
}
