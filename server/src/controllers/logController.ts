import winston from 'winston'
import { HttpError } from '../libs/error'

import { Req, Res, Next } from '../server'

const filename = 'logs/rest.log'

const logger = new winston.Logger({
  transports: [
    new (winston.transports.File)({ filename })
  ]
})

const logTypes = ['log', 'info', 'warn', 'error']

class LogController {
  public log(req: Req, res: Res, next: Next) {
    const { message, type } = req.body

    const valid = logTypes.includes(type)

    if (!valid)
      return next(new HttpError(404, type + " is not supported, supported types: " + logTypes.join(', ')))
    

    logger[type](message)

    res.json("")
  }
}

const logController = new LogController()
export default logController
