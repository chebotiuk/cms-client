import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import http from 'http'

import config from './config'
import corsHeaders from './middleware/corsHeaders'
import httpLogger from './middleware/httpLogger'
import createLogger from './libs/logger'
import httpErrorHandler from './middleware/httpErrorHandler'
import { ServiceError, HttpError } from './libs/error'
import { Attributes } from './models/Model'
import { parseAttributes } from './middleware/parseAttributes'
import { IObject } from './@types'
import { MongoError } from "../node_modules/@types/mongodb"

export interface Req extends IObject {
  user?: object | null;
  session: any;
  attr: Attributes;
}
export interface Res extends IObject {}
export interface Next {
  (arg?: HttpError | Error | ServiceError | MongoError): void;
}
export interface RequestHandler {
  (req: Req, res: Res, next: Next): void;
}

export interface App extends IObject {}

export const initServer = async () => {
  const { default: socket } = await import('./socket')
  const { default: routes } = await import('./routes')
  const { default: loadUser } = await import('./middleware/loadUser')
  const { default: sessionStore } = await import('./libs/sessionStore')

  const log = createLogger(module)
  const app = express()

  if (process.env.NODE_ENV === 'development') {
    app.use(httpLogger as RequestHandler)
  }

  app.use(corsHeaders as RequestHandler)

  app.use(bodyParser.json({ limit: config.get('db:limits:reqBodySize') }))

  app.use(parseAttributes as RequestHandler)

  app.use(cookieParser()) // req.headers.cookie -> req.cookie

  app.set('trust proxy', 1) // trust first proxy
  app.use(session({
    secret: config.get('session:secret'),
    cookie: config.get('session:cookie'),
    store: sessionStore,
    resave: false,
    saveUninitialized: true
  }))

  app.use(loadUser as RequestHandler)

  routes(app)

  app.use(httpErrorHandler as any)

  const port = process.env.PORT
  const server = http.createServer(app)
    .listen(port, () => {
      log.info('Express server listening on port ' + port)
      log.info('NODE_ENV: ' + process.env.NODE_ENV)
    })

  server.on('error', (err: ServiceError) => {
    if (err.code === 'EACCES') {
      console.error(`No access to port ${port}`)
    }
  })

  server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })

  const io = socket(server)
  io.set('origins', '*:*')
  app.set('io', io) // we can get it via req.app.get('io')
}
