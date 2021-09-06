import optionController from '../../controllers/optionController'
import { api } from '../endpoints'
import { App } from '../../server'

const {
  read,
  readOne,
  createOne,
  updateOne,
  deleteOne
} = optionController

export default (app: App) =>
  app
    .get(api.v1 + '/options', read)
    .get(api.v1 + '/options/:id', readOne)
    .get(api.v1 + '/options/group/:group', readOne)
    .post(api.v1 + '/options', createOne)
    .put(api.v1 + '/options/:id', updateOne)
    .delete(api.v1 + '/options/:id', deleteOne)
