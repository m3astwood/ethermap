import { Router } from 'express'
import { getMapByName } from '../controllers/maps.js'

const router = Router()

router.get('/:mapName', getMapByName)

export default router
