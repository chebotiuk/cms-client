import orderController from '../../controllers/orderController'
import { api } from '../endpoints'
import { App } from '../../server'

const {
  createOne,
  read
} = orderController

export default (app: App) =>
  app
    .get(api.v1 + '/orders', read)
    .post(api.v1 + '/orders', createOne)
