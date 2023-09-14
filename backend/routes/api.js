import { Router } from 'express'
const router = Router()

// MAPS
import { getMapByName, getAllMaps, getMapPoints } from '../controllers/maps.js'
router.get('/maps', getAllMaps)
router.get('/map/:name', getMapByName)
router.get('/map/:id/points', getMapPoints)

// POINTS
import { createPoint, deletePoint, updatePoint } from '../controllers/points.js'
router.post('/point/add', createPoint)
router.put('/point/:id', updatePoint)
router.delete('/point/:id', deletePoint)

export default router
