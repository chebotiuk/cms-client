import { Req, Res, Next } from '../server'
import { User, userModel, IUserDocument } from '../models/userModel'
import { HttpError } from '../libs/error'
import { ModelError } from '../models/Model'

class AuthController {
  public getAuthStatus(req: Req, res: Res) {
    const { username, type, createdAt } = req.user as User

    res.json({ username, type, createdAt })
  }

  public login(req: Req, res: Res, next: Next) {
    const username = req.body.username
    const password = req.body.password

    userModel.readByUsername(username)
      .then(async (user: IUserDocument) => {
        if (user) {
          if (await userModel.checkPassword(user._id, password)) {
            return user
          } else {
            throw new HttpError(403, 'Password incorrect')
          }
        }
          
        return userModel.createUser({
          username,
          password,
        })
      })
      .then((user: User) => {
        req.session.user = user._id
        res.status(200)
          .json({})
      })
      .catch((err: Error) => {
        if (
          err instanceof ModelError && err.message === 'Base dependency document not found'
        ) return next(new HttpError(400, 'User not found'))

        next(err)
      })
  }

  public logout(req: Req, res: Res, next: Next) {
    const sid = req.session.id
    const io = req.app.get('io')

    req.session.destroy((err: any) => {
      io.sockets._events.sessreload(sid) // generate system io event

      if (err) return next(err)

      res.status(200)
        .json({})
    })
  }
}

const authController = new AuthController()
export default authController
