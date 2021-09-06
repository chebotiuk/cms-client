import { orderModel } from '../models/orderModel'
import { Req, Res, Next } from '../server'
import { sendOrderNotificationEmail } from '../services/emailService.ts';
import { ModelError } from '../models/Model';

class OrderController {
  public read(req: Req, res: Res, next: Next) {
    orderModel.readAll(req.attr)
      .toArray()
      .then((orders: Array<object>) => {
        res.json(orders)
      })
      .catch(next)
  }

  public createOne(req: Req, res: Res, next: Next) {
    const { orderCategory, shippingInfo, products } = req.body

    orderModel.createOrder({ orderCategory, shippingInfo, products })
      .then(order => {
        res.json(order)
        return order
      })
      .then(order => { sendOrderNotificationEmail(order) })
      .catch(err => {
        err instanceof ModelError && err.message === 'Base dependency document not found'

        next(err)
      })
  }
}

const orderController = new OrderController()
export default orderController
