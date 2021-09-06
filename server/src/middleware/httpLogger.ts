import { Req, Res, Next } from '../server'
import createLogger from '../libs/logger'

const log = createLogger(module)

export default function(req: Req, res: Res, next: Next) {
  log.info(`req: ${req.method} ${req.url}`)

  next()
}
