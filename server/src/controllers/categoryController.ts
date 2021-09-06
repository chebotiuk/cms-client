import { categoryModel } from '../models/categoryModel'
import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'

class CategoryController {
  public read (req: Req, res: Res, next: Next) {
    categoryModel.readAll(req.attr)
      .toArray()
      .then((categories: object[]) => {
        res.json(categories)
      })
      .catch(next)
  }

  public readOne(req: Req, res: Res, next: Next) {
    categoryModel.readOneById(req.params.id, req.attr)
      .then(category => {
        if (category) {
          res.json(category)
        } else {
          throw new HttpError(404, 'Category not found')
        }
      })
      .catch(next)
  }

  public createOne(req: Req, res: Res, next: Next) {
    const { name } = req.body

    categoryModel.createOne({ name })
      .then(category => { res.json(category) })
      .catch(next)
  }

  public updateOne(req: Req, res: Res, next: Next) {
    const { name } = req.body
    const { id } = req.params

    categoryModel.updateOneById(id, { name })
      .then(({ n }: any) => {
        if (n === 0) throw new HttpError(404, 'No category with following id found')
        res.json("")
      })
      .catch(next)
  }

  public deleteOne(req: Req, res: Res, next: Next) {
    const { id } = req.params

    categoryModel.deleteOneById(id)
      .then(() => { res.json("") })
      .catch(next)
  }
}

const categoryController = new CategoryController()
export default categoryController
