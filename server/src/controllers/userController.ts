import { HttpError } from '../libs/error'
import { userModel } from '../models/userModel'
import { Req, Res, Next } from '../server'
import { IObject } from '../@types'

class UserController {
  public read (req: Req, res: Res, next: Next) {
    userModel.readAll(req.attr)
      .toArray()
      .then((users: Array<IObject>) => { res.json(users) })
      .catch(next)
  }

  public readOne (req: Req, res: Res, next: Next) {
    try {
      var id = req.params.id
    } catch (err) {
      return next(new HttpError(404, 'User not found'))
    }

    userModel.readOneById(id, req.attr)
      .then(user => {
        if (!user) throw new HttpError(404, 'User not found')
        res.json(user)
      })
      .catch(next)
  }
}

const userController = new UserController()
export default userController
