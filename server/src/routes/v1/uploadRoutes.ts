import { api } from '../endpoints'
import uploadController from '../../controllers/uploadController'
import { App } from '../../server'

const {
  readOne,
  createOne,
  deleteOne,
} = uploadController

export default (app: App) =>
  app
    .get(api.v1 + '/uploads/:filename', readOne)
    .post(api.v1 + '/uploads', createOne)
    .delete(api.v1 + '/uploads/:id', deleteOne)
