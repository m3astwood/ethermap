import { eq } from 'drizzle-orm'
import session from 'express-session'
import type { Db } from '../db'
import { type SessionsSchema, sessions } from '../db/schema/session.schema'

export class DrizzlePostgresSessionStore extends session.Store {
  db: Db
  sessionTable: SessionsSchema

  constructor(options: { db: Db; table: SessionsSchema }) {
    super()
    this.db = options.db
    this.sessionTable = options.table
  }

  async get(sid: string, callback: (err: any, session?: session.SessionData | null) => void) {
    try {
      const session = await this.db.query.sessions.findFirst({
        where: eq(sessions.sid, sid),
      })

      if (session) {
        callback(null, session.sess as session.SessionData)
      } else {
        callback(null, null)
      }
    } catch (err) {
      callback(err)
    }
  }

  async set(sid: string, sess: session.SessionData, callback?: (err?: any) => void) {
    try {
      const expired = new Date(sess.cookie.expires as Date)

      await this.db.insert(this.sessionTable).values({ sid, sess, expired }).onConflictDoUpdate({ target: this.sessionTable.sid, set: { sess, expired } })

      callback?.()
    } catch (err) {
      callback?.(err)
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await this.db.delete(this.sessionTable).where(eq(this.sessionTable.sid, sid)).execute()
      callback?.()
    } catch (err) {
      callback?.(err)
    }
  }
}
