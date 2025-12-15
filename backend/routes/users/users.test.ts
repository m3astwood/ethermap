// testing tools
import { migrate } from 'drizzle-orm/pglite/migrator'
import { testClient } from 'hono/testing'
import type { SessionData } from 'hono-sessions'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
// hono app
import { app } from '@/backend/app'
// db
import db from '@/backend/db'

// test agent (single request for all tests)
let client

describe.sequential('User routes', () => {
  // test setup
  beforeAll(async () => {
    await migrate(db, { migrationsFolder: './backend/db/migrations' })
  })

  beforeEach(async () => {
    client = testClient(app)
    // bingo test map created
    await client.api.maps[':name'].$get({
      param: {
        name: 'bingo',
      },
    })
  })

  it('should return a user associated with active session', async () => {
    const res = await client.api.users.$get()

    expect(res.status).toEqual(200)
    if (res.status === 200) {
      const body = await res.json()
      expect(body.sid).toBeTruthy()
      expect(body.sess).toBeTruthy()
      expect(body.expired).toBeTruthy()
      expect(body).toHaveProperty('name')
      expect(body).toHaveProperty('colour')
      expect(body.mapSessions?.constructor).toEqual(Array)
    }
  })

  it("should update active session's name and colour", async () => {
    let sessionCookie: SessionData | null = null
    const postRes = await client.api.users.$post({
      json: {
        name: 'test_name',
        colour: '#FF0033',
      },
    })

    // Extract the 'Set-Cookie' header from the first response
    const setCookieHeader = postRes.headers.get('Set-Cookie')

    if (setCookieHeader) {
      sessionCookie = setCookieHeader.split(';')[0]
    }

    expect(postRes.status).toEqual(201)
    if (postRes.status === 201 && sessionCookie) {
      const userRes = await client.api.users.$get({
        header: {
          Cookie: sessionCookie,
        },
      })
      const body = await userRes.json()
      expect(body.name).toEqual('test_name')
      expect(body.colour).toEqual('#FF0033')
    }
  })

  it('should return 422 if user data is invalid', async () => {
    const postRes = await client.api.users.$post({
      json: {
        name: 123,
        color: '#FF0033',
      },
    })
    expect(postRes.status).toEqual(422)
  })

  it('should set map session data for active session', async () => {
    let sessionCookie: SessionData | null = null
    const postRes = await client.api.users.map.$post({
      json: {
        mapId: 1,
        lastLocation: {
          lat: 20,
          lng: 50,
        },
        zoom: 2,
      },
    })

    const setCookieHeader = postRes.headers.get('Set-Cookie')

    if (setCookieHeader) {
      sessionCookie = setCookieHeader.split(';')[0]
    }

    expect(postRes.status).toEqual(201)
    if (postRes.status === 201 && sessionCookie) {
      const userRes = await client.api.users.$get({
        header: {
          Cookie: sessionCookie,
        },
      })
      const body = await userRes.json()
      expect(body.mapSessions?.constructor).toEqual(Array)

      const [mapSession] = body.mapSessions
      expect(mapSession.mapId).toEqual(1)
      expect(mapSession.lastLocation).toEqual({ lat: 20, lng: 50 })
      expect(mapSession.zoom).toEqual(2)
    }
  })

  it('should return 422 if mapSession data is invalid', async () => {
    const postRes = await client.api.users.map.$post({
      json: {
        invalid: 'json',
      },
    })

    expect(postRes.status).toEqual(422)
  })
})
