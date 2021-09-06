import { optionModel } from '../models/optionModel'
import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'

class OptionController {
  public read(req: Req, res: Res, next: Next) {
    optionModel.readAll(req.attr)
      .toArray()
      .then((options: Array<object>) => {
        res.json(options)
      })
      .catch(next)
  }

  public readOne(req: Req, res: Res, next: Next) {
    optionModel.readOneById(req.params.id, req.attr)
      .then(option => {
        if (option) {
          res.json(option)
        } else {
          throw new HttpError(404, 'Option not found')
        }
      })
      .catch(next)
  }

  public readOneByGroup(req: Req, res: Res, next: Next) {
    optionModel.readOptionByGroup(req.params.group)
      .then(option => {
        if (option) {
          res.json(option)
        } else {
          throw new HttpError(404, 'Option not found')
        }
      })
      .catch(next)
  }

  public createOne(req: Req, res: Res, next: Next) {
    const { value, price, group, hidden } = req.body

    optionModel.createOne({ value, price, group, hidden })
      .then(option => { res.json(option) })
      .catch(next)
  }

  public updateOne(req: Req, res: Res, next: Next) {
    const { value, price, group, hidden } = req.body
    const { id } = req.params

    optionModel.updateOneById(
      id,
      { value, price, group, hidden }
    )
      .then(option => { res.json(option) })
      .catch(next)
  }

  public deleteOne(req: Req, res: Res, next: Next) {
    const { id } = req.params

    optionModel.deleteOneById(id)
      .then(() => { res.json("") })
      .catch(next)
  }
}

const optionController = new OptionController()
export default optionController
