import { Router } from 'express'
const router = Router()

// MAPS
import { getAllMaps } from '../controllers/maps.js'
import { getMapByName } from '../controllers/maps.js'

router.get('/maps', getAllMaps)
router.get('/map/:mapName', getMapByName)

// POINTS
import { setPoint } from '../controllers/points.js'
router.post('/point/add', setPoint)

export default router
