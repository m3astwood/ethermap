import { Router } from 'express'

import { getAllMaps } from '../controllers/maps.js'

const router = Router()

router.get('/', (_, res) => {
  res.send('ethermap')
})

router.get('/maps', getAllMaps)


export default router

