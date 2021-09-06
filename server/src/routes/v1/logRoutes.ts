import logController from '../../controllers/logController'
import { api } from '../endpoints'
import { App } from '../../server'

const {
  log,
} = logController

export default (app: App) =>
  app
    .post(api.v1 + '/logs', log)
