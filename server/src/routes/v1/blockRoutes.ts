import { api } from '../endpoints'
import blockController from '../../controllers/blockController'
import { App } from '../../server'

const {
  read,
  readOne,
  readOneByKey,
  createOne,
  updateOne,
  deleteOne
} = blockController

export default (app: App) =>
  app
    .get(api.v1 + '/blocks', read)
    .get(api.v1 + '/blocks/:id', readOne)
    .get(api.v1 + '/blocks/key/:key', readOneByKey)
    .post(api.v1 + '/blocks', createOne)
    .put(api.v1 + '/blocks/:id', updateOne)
    .delete(api.v1 + '/blocks/:id', deleteOne)
