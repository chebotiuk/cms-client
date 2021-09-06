import { api } from '../endpoints'
import productsController from '../../controllers/productController'
import { App } from '../../server'

const {
  createOne,
  read,
  readPage,
  readOne,
  updateOne,
  deleteOne
} = productsController

export default (app: App) =>
  app
    .get(api.v1 + '/products', read)
    .get(api.v1 + '/products/page', readPage)
    .get(api.v1 + '/products/:id', readOne)
    .post(api.v1 + '/products', createOne)
    .put(api.v1 + '/products/:id', updateOne)
    .delete(api.v1 + '/products/:id', deleteOne)
