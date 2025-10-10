import type { Session } from 'express-session'

export interface UserData {
  id: number
  name: string
  colour: string
}

export interface UserServerData {
  user: UserData
  pos: { lat: number, lng: number}
  session: string
}

export interface UserSession {
  sid: string
  sess: Session & { user: UserData }
  expired: string
}

