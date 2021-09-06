import util from 'util'
import http from 'http'
 
export class HttpError {
  name: string | undefined
  status: number
  message: string

  constructor (status: number, message?: string) {
    Error.captureStackTrace(this, HttpError)

    this.status = status
    this.message = message || http.STATUS_CODES[status] || 'Http error'
  }
}

util.inherits(HttpError, Error)
HttpError.prototype.name = 'HttpError'

export class ServiceError {
  name: string | undefined

  constructor(public code: string | number, public message?: string) {
    Error.captureStackTrace(this, ServiceError)

    this.code = code
    this.message = message || 'Error'
  }
}

util.inherits(ServiceError, Error)
ServiceError.prototype.name = 'ServiceError'
