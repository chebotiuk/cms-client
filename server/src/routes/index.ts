import v1 from './v1'
import { HttpError } from '../libs/error'
import { Req, Res, Next, App } from '../server'
import createLogger from '../libs/logger'

const log = createLogger(module)

export default (app: App) => {
  v1(app)

  app.get('/healthcheck', (req: Req, res: Res, next: Next) => {
    res.status(200).end()
  })

  app.use((req: Req, res: Res, next: Next) => {
    next(new HttpError(404, '404 Page not found'))
  })
}
