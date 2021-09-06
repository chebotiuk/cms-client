import { api } from '../endpoints'
import categoryController from '../../controllers/categoryController'
import { App } from '../../server'

const {
  read,
  readOne,
  createOne,
  updateOne,
  deleteOne
} = categoryController

export default (app: App) =>
  app
    .get(api.v1 + '/categories', read)
    .get(api.v1 + '/categories/:id', readOne)
    .post(api.v1 + '/categories', createOne)
    .put(api.v1 + '/categories/:id', updateOne)
    .delete(api.v1 + '/categories/:id',deleteOne)
