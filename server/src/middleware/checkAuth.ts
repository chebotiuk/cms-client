import { HttpError } from '../libs/error'
import { Req, Res, Next } from '../server'

export default function(req: Req, res: Res, next: Next) {
  if (!req.session.user) return next(new HttpError(401))

  next()
}
