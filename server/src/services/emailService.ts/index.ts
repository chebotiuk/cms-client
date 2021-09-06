import nodemailer from 'nodemailer'
import nunjucks from "nunjucks"

import config from '../../config'
import createLogger from '../../libs/logger'

const log = createLogger(module)

enum AccountType {
  undefined,
  wholesale,
  tax,
  market
}

type ShippingInfo = {
  contact: string,
  shippingAddress: string,
  phoneNumber: string
}

export type OrderProduct = {
  article: number
  name: string
  accountedPrice: string
  additionalOptions: Array<{ key: string, accountedPrice: number }>
  amount: number
}

export type Order = {
  orderCategory?: AccountType,
  shippingInfo: ShippingInfo,
  products: Array<OrderProduct>,
  totalPrice: number
}

let transporter: any

if (config.get('mail:host')) {
  transporter = nodemailer.createTransport({
    host: config.get('mail:host'),
    port: 465,
    auth: {
      user: config.get('mail:auth:user'),
      pass: config.get('mail:auth:pass')
    },
  })
} else {
  transporter = nodemailer.createTransport({
    service: config.get('mail:service'),
    auth: {
      user: config.get('mail:auth:user'),
      pass: config.get('mail:auth:pass')
    }
  })
}

export const sendOrderNotificationEmail = (order: Order) => transporter.sendMail({
  from: config.get('mail:auth:user'),
  to: config.get('mail:auth:user'),
  subject: 'New order from cms',
  html: nunjucks.render('src/views/emailOrderTemplate.html', order)
})
  .catch(<T extends Error>(err: T) => { log.error(err) })

export const emailService = transporter
