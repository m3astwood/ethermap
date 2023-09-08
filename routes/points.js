import { Router } from 'express'
import { setPoint } from '../controllers/points.js'

const router = Router()

router.post('/addpoint', setPoint)

export default router
