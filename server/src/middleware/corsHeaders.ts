import { Req, Res, Next } from '../server'

export default function (req: Req, res: Res, next: Next) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, Accept, Content-Type, Content-Disposition, Authorization, X-Requested-With'
  )
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, PATCH, HEAD, DELETE, GET')
    return res.end()
  }

  next()
}
