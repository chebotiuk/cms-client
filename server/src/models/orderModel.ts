import { Model, ModelError } from './Model';
import { productModel } from './productModel';
import { OrderProduct } from '../services/emailService.ts';

enum AccountType {
  undefined,
  wholesale,
  tax,
  market
}

type ShippingInfo = {
  contact: string;
  shippingAddress: string;
  phoneNumber: string;
}

export type OrderInput = {
  orderCategory?: AccountType
  shippingInfo: ShippingInfo,
  products: Array<{
    id: string
    article: string
    additionalOptions: Array<string>
    amount: number
    price: string
  }>
}

class OrderModel extends Model {
  collectionName = 'orders'

  getDefaultValues = () => ({
    orderCategory: AccountType.market
  })

  indexes = []

  resolvers = {}

  constructor() {
    super()
    this.createIndexes()
  }

  createOrder = async (orderInput: OrderInput) => {
    const order: {
      orderCategory?: AccountType,
      shippingInfo: ShippingInfo,
      products: Array<{
        article: number
        name: string
        accountedPrice: string
        additionalOptions: Array<{ key: string, accountedPrice: number }>
        amount: number
      }>,
      totalPrice: number
    } = {
      orderCategory: orderInput.orderCategory,
      shippingInfo: orderInput.shippingInfo,
      products: [],
      totalPrice: 0
    }

    order.products = await Promise.all(orderInput.products.map(
      async (productItem): Promise<OrderProduct>  => {
        const product = await productModel.readProductById(productItem.id)
        
        if (product === null) throw new ModelError('Base dependency document not found')

        let { article, name, prices = [], additionalOptions = [] } = product

        const price = prices.find(({ key }: {
          key: string
        }) => key === productItem.price)

        if (price) order.totalPrice += (price.accountedPrice * productItem.amount)

        if (productItem.additionalOptions) {
          additionalOptions = productItem.additionalOptions.map(
            (key: any) => {
              const additionalOption = additionalOptions.find((item: any) => item.key === key)
              if (!additionalOption) throw new ModelError('Base dependency document not found')

              const { accountedPrice } = additionalOption

              order.totalPrice += (accountedPrice * productItem.amount)

              return { key, accountedPrice }
            }
          )
        }

        return { article, name, accountedPrice: price ? price.accountedPrice : 0, additionalOptions, amount: productItem.amount }
      }
    ))

    return this.createOne(order)
  }
}

export const orderModel = new OrderModel
