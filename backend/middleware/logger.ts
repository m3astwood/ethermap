import type { NextFunction } from 'express'
import env from '../lib/env'

export const accessLogger = (req: Request, _res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== 'prod') {
    // @ts-expect-error: types not loading from pino
    req.log.info('something')
  }

  next()
}
