import optionGroupController from '../../controllers/optionGroupController'
import { api } from '../endpoints'
import { App } from '../../server'

const {
  read,
  readOne,
  createOne,
  updateOne,
  deleteOne
} = optionGroupController

export default (app: App) =>
  app
    .get(api.v1 + '/option-groups', read)
    .get(api.v1 + '/option-groups/:id', readOne)
    .post(api.v1 + '/option-groups', createOne)
    .put(api.v1 + '/option-groups/:id', updateOne)
    .delete(api.v1 + '/option-groups/:id', deleteOne)
