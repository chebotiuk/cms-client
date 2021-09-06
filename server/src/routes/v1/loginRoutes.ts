import authController from '../../controllers/authController'
import { api } from '../endpoints'
import checkAuth from '../../middleware/checkAuth'
import { App } from '../../server'

const {
  login,
  logout,
  getAuthStatus
} = authController

export default (app: App) =>
  app
    .post(api.v1 + '/login', login)
    .post(api.v1 + '/logout', logout)
    .get(api.v1 + '/authorized_user', checkAuth, getAuthStatus)
