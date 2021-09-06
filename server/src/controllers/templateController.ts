import { templateModel } from '../models/templateModel'
import { Req, Res, Next } from '../server'
import { HttpError } from '../libs/error'

class TemplateController {
  public read(req: Req, res: Res, next: Next) {
    templateModel.readAll(req.attr)
      .toArray()
      .then((templates: object[]) => {
        res.json(templates)
      })
      .catch(next)
  }

  public readOne(req: Req, res: Res, next: Next) {
    templateModel.readOneById(req.params.id, req.attr)
      .then(template => {
        if (template) {
          res.json(template)
        } else {
          throw new HttpError(404, 'Template not found')
        }
      })
      .catch(next)
  }

  public createOne(req: Req, res: Res, next: Next) {
    const { name, items } = req.body

    templateModel.createOne({ name, items })
      .then(template => { res.json(template) })
      .catch(next)
  }

  public updateOne(req: Req, res: Res, next: Next) {
    const { name, items } = req.body
    const { id } = req.params

    templateModel.updateOneById(id, { name, items })
      .then(({ n }: any) => {
        if (n === 0) throw new HttpError(404, 'No template with following id found')
        res.json("")
      })
      .catch(next)
  }

  public deleteOne(req: Req, res: Res, next: Next) {
    const { id } = req.params

    templateModel.deleteOneById(id)
      .then(() => { res.json("") })
      .catch(next)
  }
}

const templateController = new TemplateController()
export default templateController
