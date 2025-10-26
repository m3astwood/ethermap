import { eq } from 'drizzle-orm'
import type { SessionData, Store } from 'hono-sessions'
import type { Db } from '../db'
import { sessions, SessionsTable } from '../db/schema/session.schema'

export class DrizzlePostgresSessionStore implements Store {
  db: Db
  sessions: SessionsTable

  constructor(options: { db: Db; table: SessionsTable }) {
    this.db = options.db
    this.sessions = options.table
  }

  async getSessionById(sid: string): Promise<SessionData | null> {
    const session = await this.db.query.sessions.findFirst({
      where: eq(sessions.sid, sid),
    })

    return session ? session.sess as SessionData : null
  }

  async createSession(sid: string, data: SessionData) {
    try {
      const expired = new Date(data._expire as unknown as Date)
      await this.db
        .insert(this.sessions)
        .values({ sid, sess: data, expired })
        .onConflictDoUpdate({ target: this.sessions.sid, set: { sess: data, expired } })
    } catch (err) {
      console.error(err)
    }
  }

  async persistSessionData(sid: string, sessionData: SessionData) {
     await this.createSession(sid, sessionData)
  }

  async deleteSession(sid: string) {
    try {
      await this.db.delete(this.sessions).where(eq(this.sessions.sid, sid)).execute()
    } catch (err) {
      console.error(err)
    }
  }
}
