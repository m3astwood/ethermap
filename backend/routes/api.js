import { Router } from 'express'
const router = Router()

// MAPS
import { getAllMaps } from '../controllers/maps.js'
import { getMapByName } from '../controllers/maps.js'

router.get('/maps', getAllMaps)
router.get('/map/:mapName', getMapByName)

// POINTS
import { createPoint } from '../controllers/points.js'
router.post('/point/add', createPoint)

export default router
