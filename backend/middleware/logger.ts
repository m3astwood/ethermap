import { NextFunction } from 'express'
import type { HttpRequest } from '@types/pino-http'
import env from '../lib/env'

export const accessLogger = (req: Request, _res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== 'prod') {
    (req as Request & HttpRequest).log.info('something')
  }

  next()
}
