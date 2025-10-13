import type { Request, Response } from 'express'

const getUserSession = (req: Request, res: Response) => {
  res.json({ user: req.session.user })
}

const updateUserSession = (req: Request, res: Response) => {
  req.session.user = { ...req.session.user, ...req.body }

  res.json({ user: req.session.user })
}

export { getUserSession, updateUserSession }
