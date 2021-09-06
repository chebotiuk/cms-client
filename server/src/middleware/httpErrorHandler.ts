import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'

const httpErrorHandler = (err: Error | HttpError, req: Req, res: Res, next: Next) => {
  if (err instanceof HttpError) {
    return res.status(err.status)
      .json(err)
  }

  const httpError = new HttpError(500)  
  res.status(httpError.status)
      .json(httpError)

  process.emit('uncaughtException', err)
}

export default httpErrorHandler
