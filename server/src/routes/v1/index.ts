import { App } from '../../server'
import categoryRoutes from './categoryRoutes'
import loginRoutes from './loginRoutes'
import optionRoutes from './optionRoutes'
import productRoutes from './productRoutes'
import uploadRoutes from './uploadRoutes'
import userRoutes from './userRoutes'
import orderRoutes from './orderRoutes'
import templateRoutes from './templateRoutes'
import logRoutes from './logRoutes'
import optionGroupRoutes from './optionGroupRoutes'
import blockRoutes from './blockRoutes'
import serviceRoutes from './serviceRoutes'

export default (app: App) => {
  logRoutes(app)
  loginRoutes(app)
  productRoutes(app)
  categoryRoutes(app)
  userRoutes(app)
  uploadRoutes(app)
  orderRoutes(app)
  optionGroupRoutes(app)
  blockRoutes(app)
  templateRoutes(app)
  optionRoutes(app) // experimental
  serviceRoutes(app) // experimental
}
