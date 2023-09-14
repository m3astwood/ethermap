import { Router } from 'express'
const router = Router()

// MAPS
import { getAllMaps } from '../controllers/maps.js'
import { getMapByName } from '../controllers/maps.js'

router.get('/maps', getAllMaps)
router.get('/map/:mapName', getMapByName)

// POINTS
import { createPoint, deletePoint, updatePoint } from '../controllers/points.js'
router.post('/point/add', createPoint)
router.put('/point/:id', updatePoint)
router.delete('/point/:id', deletePoint)

export default router
