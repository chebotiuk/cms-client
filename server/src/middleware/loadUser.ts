import { Req, Res, Next } from '../server'
import { userModel } from '../models/userModel'

export default function(req: Req, res: Res, next: Next) {
  req.user = null

  if (!req.session.user) return next()

  userModel.readOneById(req.session.user)
    .then(user => { req.user = user })
    .then(() => next())
    .catch(next)
}
