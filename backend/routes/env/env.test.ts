// testing tools
import { testClient } from 'hono/testing'
import { beforeEach, describe, expect, it } from 'vitest'

// hono app
import { app } from '@/backend/app'

// test agent
let client

describe('Environment routes', () => {
  beforeEach(() => {
    client = testClient(app)
  })

  it('should return client environment variables on GET "/api/environment" route', async () => {
    const res = await client.api.environment.$get()
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body.SENTRY_DSN).toBeTruthy()
  })
})
