import { blockModel } from '../models/blockModel'
import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'

class BlockController {
  public read(req: Req, res: Res, next: Next) {
    blockModel.readAll(req.attr)
      .toArray()
      .then((blocks: Array<object>) => {
        res.json(blocks)
      })
      .catch(next)
  }

  public readOne(req: Req, res: Res, next: Next) {
    blockModel.readOneById(req.params.id, req.attr)
      .then(block => {
        if (block) {
          res.json(block)
        } else {
          throw new HttpError(404, 'Block not found')
        }
      })
      .catch(next)
  }

  public readOneByKey(req: Req, res: Res, next: Next) {
    blockModel.readOneByKey(req.params.key)
      .then(block => {
        if (block) {
          res.json(block)
        } else {
          throw new HttpError(404, 'Block not found')
        }
      })
      .catch(next)
  }

  public createOne(req: Req, res: Res, next: Next) {
    const { key, textBlock } = req.body

    blockModel.createOne({ key, textBlock })
      .then(block => { res.json(block) })
      .catch(next)
  }

  public updateOne(req: Req, res: Res, next: Next) {
    const { key, textBlock } = req.body
    const { id } = req.params

    blockModel.updateOneById(
      id,
      { key, textBlock }
    )
      .then(block => { res.json(block) })
      .catch(next)
  }

  public deleteOne(req: Req, res: Res, next: Next) {
    const { id } = req.params

    blockModel.deleteOneById(id)
      .then(() => { res.json("") })
      .catch(next)
  }
}

const blockController = new BlockController()
export default blockController
