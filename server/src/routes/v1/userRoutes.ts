import { api } from '../endpoints'
import userController from '../../controllers/userController'
import { App } from '../../server'

const {
  read,
  readOne
} = userController

export default (app: App) =>
  app
    .get(api.v1 + '/users', read)
    .get(api.v1 + '/user/:id', readOne)
