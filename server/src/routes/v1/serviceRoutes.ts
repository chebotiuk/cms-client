import { api } from '../endpoints'
import { App } from '../../server'

export default (app: App) =>
  app
    .get(api.v1 + '/service', async (req: any, res: any, next: any) => {

      res.status(200)
        .json({})
    })
