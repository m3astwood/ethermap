// import { Router } from 'express'
// const router = Router()
//
// // MAPS
// import { getMapByName, getAllMaps, getMapPoints } from '../controllers/maps'
// router.get('/maps', getAllMaps)
// router.get('/map/:name', getMapByName)
// router.get('/map/:id/points', getMapPoints)
//
// // POINTS
// import { createPoint, deletePoint, getPointById, updatePoint } from '../controllers/points'
// router.get('/point/:id', getPointById)
// router.post('/point', createPoint)
// router.put('/point/:id', updatePoint)
// router.delete('/point/:id', deletePoint)
//
// // SESSION
// import { updateUserSession, getUserSession } from '../controllers/user'
// router.get('/user', getUserSession)
// router.post('/user', updateUserSession)
//
// // SERVER SENT EVENTS
// import { mapEvents } from '../controllers/maps'
// router.get('/events/map/:id', mapEvents)
//
// export default router

import { Hono } from 'hono'
import db from '../db'
import { eq } from 'drizzle-orm'
import { points } from '../db/schema'

const pointProdecures = new Hono()
  .get('/:id', async (c) => {
    try {
      const { id } = c.req.param()
      const point = await db.query.points.findFirst({
        where: eq(points.id, Number.parseInt(id)),
        with: {
          createdBy: true,
          updatedBy: true
        }
      })

      if (!point) {
        c.status(404)
        throw new Error(`Point with id ${id} cannot be found`)
      }

      c.status(200)
      c.json(point)
    } catch (err) {
      console.error(err)
      return c.json({ error: err })
    }
  })

export { pointProdecures }
