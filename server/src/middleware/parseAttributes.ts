import { Req, Res, Next } from '../server'

export type Attributes = {
  sort?: string,
  order?: 'asc' | 'desc',
  filter?: object,
  projection?: object,
  skip?: number,
  limit?: number
}

export function parseAttributes(req: Req, res: Res, next: Next) {
  let { query } = req

  req.attr = {
    ...query,
    ...(query.filter ? { filter: JSON.parse(query.filter) } : {}),
    ...(query.projection ? { projection: JSON.parse(query.projection) } : {}),
    ...(query.limit ? { limit: +query.limit } : {}),
    ...(query.skip ? { skip: +query.skip } : {})
  } as Attributes

  next()
}
