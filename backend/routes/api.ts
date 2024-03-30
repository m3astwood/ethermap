import { Router } from 'express'
const router = Router()

// MAPS
import { getMapByName, getAllMaps, getMapPoints } from '../controllers/maps'
router.get('/maps', getAllMaps)
router.get('/map/:name', getMapByName)
router.get('/map/:id/points', getMapPoints)

// POINTS
import { createPoint, deletePoint, getPointById, updatePoint } from '../controllers/points'
router.get('/point/:id', getPointById)
router.post('/point', createPoint)
router.put('/point/:id', updatePoint)
router.delete('/point/:id', deletePoint)

// SESSION
import { updateUserSession, getUserSession } from '../controllers/user'
router.get('/user', getUserSession)
router.post('/user', updateUserSession)

export default router
