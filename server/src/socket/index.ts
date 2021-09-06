import socketio from 'socket.io'
import cookie from 'cookie'
import cookieParser from 'cookie-parser'

import { User, userModel } from '../models/userModel'
import createLogger from '../libs/logger'
import config from '../config'
import sessionStore from '../libs/sessionStore'
import { Server } from 'http'
import { HttpError } from '../libs/error';
import { ObjectID } from 'bson';

type SessionId = string

interface ISession {
  id?: SessionId
  user?: ObjectID | string
  sid?: SessionId
}

interface IHandshake {
  cookies: {
    [key: string]: string
  }
  session: ISession
  user?: User
  [key: string]: any
}

const log = createLogger(module)

function loadSession(sid: SessionId) {
  return sessionStore.get(sid)
}

function loadUser (session: ISession) {
  if (!session.user) {
    log.debug(`Session ${session.id} is anonymous`)
    return null
  }

  return userModel.readOneById(session.user)
}

export default function (server: Server) {
  const io = socketio(server, {
    origins: 'localhost:*'
  })

  io.use(function(socket: any, next: () => void) {
    const handshake = socket.handshake as IHandshake
    handshake.cookies = cookie.parse(handshake.headers.cookie || '')
    const sidCookie = handshake.cookies['connect.sid']
    const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'))

    if (sid) {
      loadSession(sid)
        .then((session: ISession) => {
          if (!session) {
            throw new HttpError(401, 'No session')
          }

          const userSession = {
            ...session,
            id: sid,
          }

          handshake.session = userSession
          return userSession
        })
        .then(loadUser)
        .then((user: User | null) => {
          if (!user) {
            throw new HttpError(401, 'Not a user, anonymous user cant be connected')
          }

          handshake.user = user
          return user
        })
        .then(() => { next() })
        .catch((err: Error) => {
          log.error(err as any)
        })
    }
  })

  io.on('sessreload', function(sid: SessionId) {
    const clients = io.sockets.sockets // getting list of sockets

    Object.values(clients).forEach(function(client: any) {
      const handshake = client.handshake as IHandshake
      if (handshake.session.id !== sid) return

      loadSession(sid)
        .then((session: ISession) => {
          if (!session) {
            client.emit('logout', 'handshake anauthorized')
            client.disconnect()
            return
          }

          handshake.session = {
            ...session,
            id: sid,
          }
        })
        .catch(() => {
          client.emit('reconnect_error', 'server error')
          client.disconnect()
          return
        })
    })
  })


  const connectedUsers: Array<string> = []
  io.on('connection', function (socket: any) {
    const handshake = socket.handshake as IHandshake

    if (handshake.user) {
      var username = handshake.user.username
      connectedUsers.push(username)
      io.sockets.emit('connectedUsersUpdate', connectedUsers)
    }

    socket.on('disconnect', function() {
      const indexOfUser = connectedUsers.indexOf(username)
      if (indexOfUser !== -1) {
        connectedUsers.splice(indexOfUser, 1)
        io.sockets.emit('connectedUsersUpdate', connectedUsers)
      }
    })

    socket.on('requestUserState', function () {
      io.sockets.emit('responseUserState', connectedUsers)
    })
  })

  return io
}
