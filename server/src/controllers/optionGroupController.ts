import { optionGroupModel } from '../models/optionGroupModel'
import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'

class OptionGroupController {
  public read(req: Req, res: Res, next: Next) {
    optionGroupModel.readAll(req.attr)
      .toArray()
      .then((options: Array<object>) => {
        res.json(options)
      })
      .catch(next)
  }

  public readOne(req: Req, res: Res, next: Next) {
    optionGroupModel.readOneById(req.params.id, req.attr)
      .then(option => {
        if (option) {
          res.json(option)
        } else {
          throw new HttpError(404, 'Option group not found')
        }
      })
      .catch(next)
  }

  public createOne(req: Req, res: Res, next: Next) {
    const { value, price, group, hidden } = req.body

    optionGroupModel.createOne({ value, price, group, hidden })
      .then(option => { res.json(option) })
      .catch(next)
  }

  public updateOne(req: Req, res: Res, next: Next) {
    const { value, price, group, hidden } = req.body
    const { id } = req.params

    optionGroupModel.updateOneById(
      id,
      { value, price, group, hidden }
    )
      .then(option => { res.json(option) })
      .catch(next)
  }

  public deleteOne(req: Req, res: Res, next: Next) {
    const { id } = req.params

    optionGroupModel.deleteOneById(id)
      .then(() => { res.json("") })
      .catch(next)
  }
}

const optionGroupController = new OptionGroupController()
export default optionGroupController
