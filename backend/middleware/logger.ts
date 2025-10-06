import { NextFunction } from 'express'
import env from '../lib/env'

export const accessLogger = (req: Request, _res: Response, next: NextFunction) => {
  if (env.NODE_ENV !== 'prod') {
    // @ts-ignore: types not loading from pino
    req.log.info('something')
  }

  next()
}
