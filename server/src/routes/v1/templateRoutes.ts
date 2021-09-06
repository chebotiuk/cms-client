import { api } from '../endpoints'
import templateController from '../../controllers/templateController'
import { App } from '../../server'

const {
  read,
  readOne,
  createOne,
  updateOne,
  deleteOne
} = templateController

export default (app: App) =>
  app
    .get(api.v1 + '/templates', read)
    .get(api.v1 + '/templates/:id', readOne)
    .post(api.v1 + '/templates', createOne)
    .put(api.v1 + '/templates/:id', updateOne)
    .delete(api.v1 + '/templates/:id', deleteOne)
